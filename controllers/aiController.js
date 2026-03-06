/**
 * AI Controller - Chat, Qwen API, RAG
 */

const db = require('../database');

// Qwen API configuration
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
const QWEN_API_KEY = process.env.QWEN_API_KEY;

// Create new conversation
async function createConversation(req, res) {
  try {
    const userId = req.user.id;
    const { title } = req.body;
    
    const result = await db.pool.query(
      'INSERT INTO ai_conversations (user_id, title) VALUES ($1, $2) RETURNING *',
      [userId, title || 'New Conversation']
    );
    
    res.json({
      success: true,
      conversation: result.rows[0]
    });
    
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
}

// Get user's conversations
async function getConversations(req, res) {
  try {
    const userId = req.user.id;
    
    const result = await db.pool.query(
      `SELECT id, title, message_count, created_at, updated_at
       FROM ai_conversations
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId]
    );
    
    res.json({
      success: true,
      conversations: result.rows
    });
    
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
}

// Get conversation messages
async function getMessages(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Verify conversation belongs to user
    const convResult = await db.pool.query(
      'SELECT id FROM ai_conversations WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const result = await db.pool.query(
      `SELECT id, role, content, model, tokens_used, created_at
       FROM ai_messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [id]
    );
    
    res.json({
      success: true,
      messages: result.rows
    });
    
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}

// Build user context for AI
async function buildUserContext(userId) {
  try {
    // Get user profile
    const profileResult = await db.pool.query(
      `SELECT p.*, u.full_name, u.email
       FROM health_profiles p
       JOIN users u ON u.id = p.user_id
       WHERE p.user_id = $1`,
      [userId]
    );
    
    // Get recent metrics (last 7 days)
    const metricsResult = await db.pool.query(
      `SELECT category, metric_type, value, unit, recorded_at
       FROM health_metrics
       WHERE user_id = $1
       AND recorded_at > CURRENT_DATE - INTERVAL '7 days'
       ORDER BY recorded_at DESC`,
      [userId]
    );
    
    // Get active goals
    const goalsResult = await db.pool.query(
      `SELECT category, title, current_value, target_value, unit
       FROM goals
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );
    
    // Get recent symptoms
    const symptomsResult = await db.pool.query(
      `SELECT symptom, severity, is_active
       FROM symptoms
       WHERE user_id = $1 AND is_active = true
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );
    
    return {
      profile: profileResult.rows[0] || null,
      recentMetrics: metricsResult.rows,
      activeGoals: goalsResult.rows,
      symptoms: symptomsResult.rows
    };
    
  } catch (err) {
    console.error('Build context error:', err);
    return null;
  }
}

// Search knowledge base
async function searchKnowledge(query, category = null) {
  try {
    let sql = 'SELECT * FROM knowledge_chunks WHERE content ILIKE $1';
    const params = [`%${query}%`];
    
    if (category) {
      sql += ' AND category = $2';
      params.push(category);
    }
    
    sql += ' LIMIT 3';
    
    const result = await db.pool.query(sql, params);
    return result.rows;
    
  } catch (err) {
    console.error('Search knowledge error:', err);
    return [];
  }
}

// Call Qwen API
async function callQwen(messages, options = {}) {
  try {
    if (!QWEN_API_KEY || QWEN_API_KEY === 'your_qwen_api_key') {
      // Return mock response for development
      return {
        content: 'This is a mock response. To use real AI, set QWEN_API_KEY environment variable.',
        tokens_used: 0
      };
    }
    
    const response = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      body: JSON.stringify({
        model: options.model || 'qwen-turbo',
        input: {
          messages: messages
        },
        parameters: {
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1500
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.output?.text || data.output?.message?.content,
      tokens_used: data.usage?.total_tokens || 0
    };
    
  } catch (err) {
    console.error('Qwen API error:', err);
    throw err;
  }
}

// Send message to AI
async function sendMessage(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content required' });
    }
    
    // Verify conversation belongs to user
    const convResult = await db.pool.query(
      'SELECT * FROM ai_conversations WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const conversation = convResult.rows[0];
    
    // Save user message
    await db.pool.query(
      'INSERT INTO ai_messages (conversation_id, role, content) VALUES ($1, $2, $3)',
      [id, 'user', content]
    );
    
    // Build context
    const userContext = await buildUserContext(userId);
    
    // Search knowledge base
    const knowledge = await searchKnowledge(content);
    
    // Build system prompt
    const systemPrompt = buildSystemPrompt(userContext, knowledge);
    
    // Get conversation history (last 10 messages)
    const historyResult = await db.pool.query(
      `SELECT role, content FROM ai_messages
       WHERE conversation_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [id]
    );
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...historyResult.rows.reverse().map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content }
    ];
    
    // Call AI
    const startTime = Date.now();
    const aiResponse = await callQwen(messages);
    const responseTime = Date.now() - startTime;
    
    // Save AI response
    const aiMessageResult = await db.pool.query(
      `INSERT INTO ai_messages (conversation_id, role, content, model, tokens_used, response_time_ms)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, 'assistant', aiResponse.content, 'qwen-turbo', aiResponse.tokens_used, responseTime]
    );
    
    // Update conversation
    await db.pool.query(
      `UPDATE ai_conversations
       SET message_count = message_count + 2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );
    
    // Log usage
    await db.pool.query(
      `INSERT INTO ai_usage (user_id, request_type, model, tokens_input, tokens_output)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'chat', 'qwen-turbo', content.length / 4, aiResponse.tokens_used]
    );
    
    res.json({
      success: true,
      message: aiMessageResult.rows[0]
    });
    
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message', message: err.message });
  }
}

// Build system prompt
function buildSystemPrompt(userContext, knowledge) {
  let prompt = `You are EthosLife AI Health Coach, a knowledgeable and supportive health assistant. 
You provide evidence-based advice on nutrition, fitness, sleep, mental health, and general wellness.
Be encouraging, practical, and personalized in your responses.

`;
  
  // Add user context if available
  if (userContext?.profile) {
    const p = userContext.profile;
    prompt += `User Profile:
- Name: ${p.full_name || 'Unknown'}
- Gender: ${p.gender || 'Not specified'}
- Height: ${p.height_cm || 'Unknown'}cm
- Weight: ${p.weight_kg || 'Unknown'}kg
- Activity Level: ${p.activity_level || 'Unknown'}
- Sleep Average: ${p.sleep_hours_avg || 'Unknown'} hours

`;
  }
  
  // Add active goals
  if (userContext?.activeGoals?.length > 0) {
    prompt += 'Active Goals:\n';
    userContext.activeGoals.forEach(g => {
      prompt += `- ${g.title}: ${g.current_value}/${g.target_value} ${g.unit}\n`;
    });
    prompt += '\n';
  }
  
  // Add relevant knowledge
  if (knowledge.length > 0) {
    prompt += 'Relevant Knowledge:\n';
    knowledge.forEach(k => {
      prompt += `- ${k.title}: ${k.content}\n`;
    });
    prompt += '\n';
  }
  
  prompt += `Instructions:
1. Be concise but informative
2. Always consider the user's context and goals
3. Provide actionable advice
4. Encourage healthy habits
5. If asked about medical emergencies, advise seeking professional help
6. Use markdown formatting for readability`;
  
  return prompt;
}

// One-off health advice (no conversation)
async function generateHealthAdvice(req, res) {
  try {
    const userId = req.user.id;
    const { question, category } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question required' });
    }
    
    // Build context
    const userContext = await buildUserContext(userId);
    
    // Search knowledge
    const knowledge = await searchKnowledge(question, category);
    
    // Build prompt
    const systemPrompt = buildSystemPrompt(userContext, knowledge);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ];
    
    // Call AI
    const aiResponse = await callQwen(messages, { maxTokens: 800 });
    
    // Log usage
    await db.pool.query(
      `INSERT INTO ai_usage (user_id, request_type, model, tokens_input, tokens_output)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'advice', 'qwen-turbo', question.length / 4, aiResponse.tokens_used]
    );
    
    res.json({
      success: true,
      advice: aiResponse.content,
      tokensUsed: aiResponse.tokens_used
    });
    
  } catch (err) {
    console.error('Generate advice error:', err);
    res.status(500).json({ error: 'Failed to generate advice' });
  }
}

module.exports = {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  generateHealthAdvice
};
