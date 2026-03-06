import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Fetch conversations
const fetchConversations = async () => {
  const response = await api.get('/ai/conversations');
  return response.data;
};

// Fetch messages for a conversation
const fetchMessages = async (conversationId) => {
  if (!conversationId) return { messages: [] };
  const response = await api.get(`/ai/conversations/${conversationId}/messages`);
  return response.data;
};

const AIChat = () => {
  const queryClient = useQueryClient();
  const [activeConversation, setActiveConversation] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch conversations
  const { data: conversationsData } = useQuery('conversations', fetchConversations);
  const conversations = conversationsData?.conversations || [];

  // Fetch messages for active conversation
  const { data: messagesData, refetch: refetchMessages } = useQuery(
    ['messages', activeConversation],
    () => fetchMessages(activeConversation),
    { enabled: !!activeConversation }
  );
  const messages = messagesData?.messages || [];

  // Create conversation mutation
  const createConversationMutation = useMutation(
    async () => {
      const response = await api.post('/ai/conversations', {
        title: 'New Conversation'
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('conversations');
        setActiveConversation(data.conversation.id);
      },
      onError: () => {
        toast.error('Failed to create conversation');
      }
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    async (content) => {
      const response = await api.post(`/ai/conversations/${activeConversation}/messages`, {
        content
      });
      return response.data;
    },
    {
      onMutate: () => {
        setIsTyping(true);
      },
      onSuccess: () => {
        refetchMessages();
        setInputMessage('');
        setIsTyping(false);
      },
      onError: () => {
        toast.error('Failed to send message');
        setIsTyping(false);
      }
    }
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    if (!activeConversation) {
      // Create new conversation first
      const result = await createConversationMutation.mutateAsync();
      if (result?.conversation?.id) {
        sendMessageMutation.mutate(inputMessage);
      }
    } else {
      sendMessageMutation.mutate(inputMessage);
    }
  };

  const handleNewChat = () => {
    setActiveConversation(null);
    createConversationMutation.mutate();
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar - Conversations */}
      <div className="w-64 neu-card m-4 mr-0 flex flex-col">
        <div className="p-4 border-b border-clay">
          <button
            onClick={handleNewChat}
            className="neu-button w-full text-sm py-3"
            disabled={createConversationMutation.isLoading}
          >
            {createConversationMutation.isLoading ? '...' : '+ New Chat'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full text-left p-3 rounded-xl mb-2 transition-all ${
                activeConversation === conv.id
                  ? 'bg-stone text-bone shadow-neu-inset'
                  : 'hover:bg-sand'
              }`}
            >
              <p className="font-medium truncate">{conv.title}</p>
              <p className="text-xs opacity-70">
                {new Date(conv.updated_at).toLocaleDateString()}
              </p>
            </button>
          ))}
          
          {conversations.length === 0 && (
            <p className="text-center text-ink-light text-sm p-4">
              No conversations yet. Start chatting!
            </p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 neu-card m-4 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-clay flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {activeConversation 
                ? conversations.find(c => c.id === activeConversation)?.title || 'Chat'
                : 'New Conversation'
              }
            </h2>
            <p className="text-sm text-ink-light">
              Your personal AI Health Coach
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !activeConversation && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-ink mb-2">
                  Welcome to EthosLife AI
                </h3>
                <p className="text-ink-light max-w-md mb-6">
                  I can help you with nutrition advice, workout plans, sleep tips, 
                  and answer your health questions. Start a conversation!
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <SuggestionButton 
                    text="Create a meal plan" 
                    onClick={() => setInputMessage("Create a healthy meal plan for this week")}
                  />
                  <SuggestionButton 
                    text="Sleep tips" 
                    onClick={() => setInputMessage("Give me tips for better sleep")}
                  />
                  <SuggestionButton 
                    text="Workout routine" 
                    onClick={() => setInputMessage("Suggest a beginner workout routine")}
                  />
                  <SuggestionButton 
                    text="Stress relief" 
                    onClick={() => setInputMessage("How can I reduce stress?")}
                  />
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-2 text-ink-light">
              <div className="animate-bounce">●</div>
              <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</div>
              <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-clay">
          <form onSubmit={handleSend} className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your health..."
              className="neu-input flex-1"
              disabled={sendMessageMutation.isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || sendMessageMutation.isLoading}
              className="neu-button px-6 disabled:opacity-50"
            >
              {sendMessageMutation.isLoading ? '...' : 'Send'}
            </button>
          </form>
          <p className="text-xs text-ink-light mt-2 text-center">
            AI responses are for informational purposes only. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isUser ? 'neu-card' : 'bg-sand rounded-2xl p-4'}`}>
        {!isUser && (
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2">🤖</span>
            <span className="font-semibold text-stone">EthosLife AI</span>
          </div>
        )}
        <div className={`prose prose-sm max-w-none ${isUser ? 'text-ink' : 'text-ink'}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <p className="text-xs text-ink-light mt-2 text-right">
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// Suggestion Button Component
const SuggestionButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="p-3 bg-sand rounded-xl hover:bg-clay hover:text-bone transition-colors text-left"
  >
    {text}
  </button>
);

export default AIChat;
