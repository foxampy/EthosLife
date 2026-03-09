/**
 * EthosLife Telegram Bot
 * - Уведомления и напоминания
 * - Управление здоровьем
 * - Чат с AI
 * - Чат со специалистами
 * - Центр здоровья
 */

const TelegramBot = require('node-telegram-bot-api');
const db = require('../database');

require('dotenv').config();

// Configuration
const CONFIG = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  FOUNDER_CHAT_ID: process.env.FOUNDER_CHAT_ID,
  ADMIN_CHAT_IDS: process.env.ADMIN_CHAT_IDS ? process.env.ADMIN_CHAT_IDS.split(',') : []
};

// Initialize Bot
let bot = null;

if (CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_BOT_TOKEN !== 'your_bot_token_here') {
  try {
    bot = new TelegramBot(CONFIG.TELEGRAM_BOT_TOKEN, { polling: true });
    console.log('🤖 Telegram bot initialized');
  } catch (err) {
    console.error('❌ Failed to initialize Telegram bot:', err.message);
  }
}

// User sessions for conversation state
const userSessions = new Map();

// ==================== COMMANDS ====================

if (bot) {
  // /start - Welcome & Onboarding
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    
    const welcomeMessage = `
👋 Привет, ${firstName}! Добро пожаловать в EthosLife!

🌱 Я ваш персональный помощник здоровья.

📋 Что я умею:
• Напоминания о приёме лекарств
• Напоминания о тренировках
• Напоминания о сне
• Трекинг настроения
• Чат с AI-коучем
• Связь со специалистами
• Управление центром здоровья

🚀 Начните с выбора действия:
    `;
    
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🏃 Активность', callback_data: 'activity' },
            { text: '🥗 Питание', callback_data: 'nutrition' }
          ],
          [
            { text: '😴 Сон', callback_data: 'sleep' },
            { text: '🧠 Настроение', callback_data: 'mood' }
          ],
          [
            { text: '💊 Лекарства', callback_data: 'medications' },
            { text: '📅 Расписание', callback_data: 'schedule' }
          ],
          [
            { text: '🤖 AI-коуч', callback_data: 'ai_chat' },
            { text: '👨‍⚕️ Специалист', callback_data: 'specialist' }
          ],
          [
            { text: '🏥 Центр здоровья', callback_data: 'health_center' }
          ],
          [
            { text: '⚙️ Настройки', callback_data: 'settings' },
            { text: '📊 Прогресс', callback_data: 'progress' }
          ]
        ]
      }
    };
    
    try {
      await bot.sendMessage(chatId, welcomeMessage, keyboard);
      
      // Save user to database
      await db.query(
        `INSERT INTO telegram_users (chat_id, first_name, username) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (chat_id) DO UPDATE SET last_seen = NOW()`,
        [chatId, firstName, msg.from.username]
      );
    } catch (err) {
      console.error('Error in /start:', err);
    }
  });

  // /help - Help & Commands
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    
    const helpMessage = `
📚 Справка EthosLife

📋 Команды:
/start - Главное меню
/help - Справка
/reminders - Мои напоминания
/schedule - Расписание
/ai - Чат с AI-коучем
/specialist - Связь со специалистом
/center - Центр здоровья
/progress - Мой прогресс
/settings - Настройки

💡 Советы:
• Используйте кнопки для быстрого доступа
• Напишите сообщение для чата с AI
• Установите напоминания в настройках
    `;
    
    await bot.sendMessage(chatId, helpMessage);
  });

  // /reminders - View Reminders
  bot.onText(/\/reminders/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const user = await db.query(
        'SELECT * FROM telegram_users WHERE chat_id = $1',
        [chatId]
      );
      
      if (user.rows.length === 0) {
        await bot.sendMessage(chatId, '❌ Пользователь не найден. Нажмите /start');
        return;
      }
      
      const reminders = await db.query(
        'SELECT * FROM reminders WHERE user_id = $1 AND active = true ORDER BY time',
        [user.rows[0].id]
      );
      
      if (reminders.rows.length === 0) {
        await bot.sendMessage(chatId, '📭 У вас нет активных напоминаний');
        return;
      }
      
      let message = '📋 Ваши напоминания:\n\n';
      reminders.rows.forEach((reminder, index) => {
        message += `${index + 1}. ${reminder.title} - ${reminder.time}\n`;
      });
      
      await bot.sendMessage(chatId, message);
    } catch (err) {
      console.error('Error in /reminders:', err);
      await bot.sendMessage(chatId, '❌ Ошибка получения напоминаний');
    }
  });

  // /schedule - View Schedule
  bot.onText(/\/schedule/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const appointments = await db.query(
        `SELECT a.*, s.full_name as specialist_name 
         FROM appointments a
         JOIN telegram_users tu ON a.user_id = tu.id
         LEFT JOIN specialists s ON a.specialist_id = s.id
         WHERE tu.chat_id = $1 AND DATE(a.scheduled_at) >= $2
         ORDER BY a.scheduled_at
         LIMIT 5`,
        [chatId, today]
      );
      
      if (appointments.rows.length === 0) {
        await bot.sendMessage(chatId, '📭 Нет запланированных встреч');
        return;
      }
      
      let message = '📅 Ваше расписание:\n\n';
      appointments.rows.forEach((apt, index) => {
        const date = new Date(apt.scheduled_at);
        message += `${index + 1}. ${apt.specialist_name || 'Услуга'}\n`;
        message += `   📅 ${date.toLocaleDateString()} в ${date.toLocaleTimeString()}\n\n`;
      });
      
      await bot.sendMessage(chatId, message);
    } catch (err) {
      console.error('Error in /schedule:', err);
      await bot.sendMessage(chatId, '❌ Ошибка получения расписания');
    }
  });

  // /ai - AI Chat
  bot.onText(/\/ai/, async (msg) => {
    const chatId = msg.chat.id;
    
    userSessions.set(chatId, { state: 'ai_chat' });
    
    const message = `
🤖 AI-коуч готов к общению!

Напишите ваш вопрос о здоровье, питании, тренировках или любом другом аспекте.

Примеры вопросов:
• "Что съесть на завтрак?"
• "Как улучшить сон?"
• "Какая тренировка лучше?"
    `;
    
    await bot.sendMessage(chatId, message);
  });

  // /specialist - Contact Specialist
  bot.onText(/\/specialist/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const specialists = await db.query(
        'SELECT * FROM specialists WHERE is_verified = true LIMIT 5'
      );
      
      if (specialists.rows.length === 0) {
        await bot.sendMessage(chatId, '👨‍⚕️ Нет доступных специалистов');
        return;
      }
      
      const keyboard = {
        reply_markup: {
          inline_keyboard: specialists.rows.map(s => [
            { text: `👨‍⚕️ ${s.full_name || s.name}`, callback_data: `specialist_${s.id}` }
          ])
        }
      };
      
      await bot.sendMessage(chatId, '👨‍⚕️ Выберите специалиста:', keyboard);
    } catch (err) {
      console.error('Error in /specialist:', err);
      await bot.sendMessage(chatId, '❌ Ошибка получения специалистов');
    }
  });

  // /center - Health Center
  bot.onText(/\/center/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const centers = await db.query(
        'SELECT * FROM centers WHERE is_active = true LIMIT 5'
      );
      
      const keyboard = {
        reply_markup: {
          inline_keyboard: centers.rows.map(c => [
            { text: `🏥 ${c.name}`, callback_data: `center_${c.id}` }
          ])
        }
      };
      
      await bot.sendMessage(chatId, '🏥 Выберите центр здоровья:', keyboard);
    } catch (err) {
      console.error('Error in /center:', err);
      await bot.sendMessage(chatId, '❌ Ошибка получения центров');
    }
  });

  // /progress - View Progress
  bot.onText(/\/progress/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
      const user = await db.query(
        'SELECT * FROM telegram_users WHERE chat_id = $1',
        [chatId]
      );
      
      if (user.rows.length === 0) {
        await bot.sendMessage(chatId, '❌ Пользователь не найден. Нажмите /start');
        return;
      }
      
      const userId = user.rows[0].id;
      
      // Get stats
      const stats = await db.query(
        `SELECT 
          COUNT(*) as total_logs,
          MAX(created_at) as last_activity
         FROM daily_metrics 
         WHERE user_id = $1`,
        [userId]
      );
      
      const message = `
📊 Ваш прогресс

📈 Всего записей: ${stats.rows[0]?.total_logs || 0}
⏰ Последняя активность: ${stats.rows[0]?.last_activity ? new Date(stats.rows[0].last_activity).toLocaleDateString() : 'Нет'}

Продолжайте в том же духе! 🎉
      `;
      
      await bot.sendMessage(chatId, message);
    } catch (err) {
      console.error('Error in /progress:', err);
      await bot.sendMessage(chatId, '❌ Ошибка получения прогресса');
    }
  });

  // /settings - Settings
  bot.onText(/\/settings/, async (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔔 Напоминания', callback_data: 'settings_reminders' },
            { text: '🌐 Язык', callback_data: 'settings_language' }
          ],
          [
            { text: '🔔 Уведомления', callback_data: 'settings_notifications' },
            { text: '🔒 Приватность', callback_data: 'settings_privacy' }
          ],
          [
            { text: '📊 Экспорт данных', callback_data: 'export_data' },
            { text: '❌ Удалить аккаунт', callback_data: 'delete_account' }
          ]
        ]
      }
    };
    
    await bot.sendMessage(chatId, '⚙️ Настройки:', keyboard);
  });
}

// ==================== CALLBACK QUERIES (Button Clicks) ====================

if (bot) {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const firstName = query.from.first_name;
    
    try {
      switch (data) {
        // Health Modules
        case 'activity':
          await bot.sendMessage(chatId, '🏃 Активность\n\nЗапишите вашу тренировку:\n\nПример: "Бег 30 минут"');
          userSessions.set(chatId, { state: 'log_activity' });
          break;
          
        case 'nutrition':
          await bot.sendMessage(chatId, '🥗 Питание\n\nЗапишите что вы ели:\n\nПример: "Овсянка на молоке, 350 ккал"');
          userSessions.set(chatId, { state: 'log_nutrition' });
          break;
          
        case 'sleep':
          await bot.sendMessage(chatId, '😴 Сон\n\nОцените ваш сон (1-10):\n\nПример: "8"');
          userSessions.set(chatId, { state: 'log_sleep' });
          break;
          
        case 'mood':
          await bot.sendMessage(chatId, '🧠 Настроение\n\nКак вы себя чувствуете? (1-10)\n\n1 = Очень плохо\n10 = Отлично');
          userSessions.set(chatId, { state: 'log_mood' });
          break;
          
        case 'medications':
          await bot.sendMessage(chatId, '💊 Лекарства\n\nДобавить напоминание о лекарстве:\n\nПример: "Аспирин 100мг в 8:00"');
          userSessions.set(chatId, { state: 'add_medication' });
          break;
          
        case 'schedule':
          await bot.sendMessage(chatId, '📅 Расписание\n\nЗаписаться к специалисту:\n\nПример: "Нутрициолог завтра в 15:00"');
          userSessions.set(chatId, { state: 'book_appointment' });
          break;
          
        case 'ai_chat':
          await bot.sendMessage(chatId, '🤖 AI-коуч\n\nЗадайте ваш вопрос:\n\nПример: "Как улучшить сон?"');
          userSessions.set(chatId, { state: 'ai_chat' });
          break;
          
        case 'specialist':
          await bot.sendMessage(chatId, '👨‍⚕️ Специалист\n\nВыберите категорию:\n\n1. Нутрициолог\n2. Психолог\n3. Тренер\n4. Врач');
          userSessions.set(chatId, { state: 'select_specialist' });
          break;
          
        case 'health_center':
          await bot.sendMessage(chatId, '🏥 Центр здоровья\n\nВыберите тип центра:\n\n1. Fitness\n2. Wellness\n3. Medical\n4. Spa');
          userSessions.set(chatId, { state: 'select_center' });
          break;
          
        case 'settings':
          await bot.sendMessage(chatId, '⚙️ Настройки\n\nВыберите раздел:');
          break;
          
        case 'settings_reminders':
          await bot.sendMessage(chatId, '🔔 Напоминания\n\nУстановите время напоминаний:\n\nПример: "Лекарства в 8:00 и 20:00"');
          userSessions.set(chatId, { state: 'set_reminder' });
          break;
          
        case 'settings_language':
          const langKeyboard = {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🇷🇺 Русский', callback_data: 'lang_ru' },
                  { text: '🇬🇧 English', callback_data: 'lang_en' }
                ],
                [
                  { text: '🇪🇸 Español', callback_data: 'lang_es' },
                  { text: '🇩🇪 Deutsch', callback_data: 'lang_de' }
                ]
              ]
            }
          };
          await bot.sendMessage(chatId, '🌐 Выберите язык:', langKeyboard);
          break;
          
        case 'settings_notifications':
          await bot.sendMessage(chatId, '🔔 Уведомления\n\nВыберите типы уведомлений:\n\n✅ Напоминания\n✅ Прогресс\n✅ Достижения');
          break;
          
        case 'export_data':
          await bot.sendMessage(chatId, '📊 Экспорт данных\n\nВаши данные будут отправлены в формате JSON.\n\nОтправить?');
          break;
          
        case 'delete_account':
          await bot.sendMessage(chatId, '⚠️ Удаление аккаунта\n\nВы уверены? Это действие нельзя отменить.\n\nНапишите "ПОДТВЕРЖДАЮ" для удаления.');
          userSessions.set(chatId, { state: 'confirm_delete' });
          break;
          
        // Language selection
        case 'lang_ru':
          await db.query('UPDATE telegram_users SET language = $1 WHERE chat_id = $2', ['ru', chatId]);
          await bot.sendMessage(chatId, '✅ Язык изменён на Русский');
          break;
          
        case 'lang_en':
          await db.query('UPDATE telegram_users SET language = $1 WHERE chat_id = $2', ['en', chatId]);
          await bot.sendMessage(chatId, '✅ Language changed to English');
          break;
          
        default:
          // Handle specialist/center selection
          if (data.startsWith('specialist_')) {
            const specialistId = data.split('_')[1];
            await bot.sendMessage(chatId, `👨‍⚕️ Выбран специалист ID: ${specialist}\n\nЗапишите ваш вопрос:`);
            userSessions.set(chatId, { state: 'message_specialist', specialistId });
          } else if (data.startsWith('center_')) {
            const centerId = data.split('_')[1];
            await bot.sendMessage(chatId, `🏥 Выбран центр ID: ${centerId}\n\nЗаписаться на услугу?`);
          }
      }
      
      await bot.answerCallbackQuery(query.id);
    } catch (err) {
      console.error('Error in callback_query:', err);
    }
  });
}

// ==================== MESSAGE HANDLER (Chat & Logging) ====================

if (bot) {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const firstName = msg.from.first_name;
    
    // Skip commands
    if (text.startsWith('/')) return;
    
    try {
      const session = userSessions.get(chatId);
      
      if (!session) {
        await bot.sendMessage(chatId, '❌ Неизвестная команда. Нажмите /start для начала.');
        return;
      }
      
      // Handle different states
      switch (session.state) {
        case 'ai_chat':
          // Send to AI API
          const aiResponse = await getAIResponse(text, chatId);
          await bot.sendMessage(chatId, `🤖 AI-коуч:\n\n${aiResponse}`);
          break;
          
        case 'log_activity':
          await logHealthData(chatId, 'activity', text);
          await bot.sendMessage(chatId, '✅ Активность записана! 🏃');
          userSessions.delete(chatId);
          break;
          
        case 'log_nutrition':
          await logHealthData(chatId, 'nutrition', text);
          await bot.sendMessage(chatId, '✅ Питание записано! 🥗');
          userSessions.delete(chatId);
          break;
          
        case 'log_sleep':
          const sleepScore = parseInt(text);
          if (isNaN(sleepScore) || sleepScore < 1 || sleepScore > 10) {
            await bot.sendMessage(chatId, '❌ Введите число от 1 до 10');
            return;
          }
          await logHealthData(chatId, 'sleep', { score: sleepScore });
          await bot.sendMessage(chatId, '✅ Сон записан! 😴');
          userSessions.delete(chatId);
          break;
          
        case 'log_mood':
          const moodScore = parseInt(text);
          if (isNaN(moodScore) || moodScore < 1 || moodScore > 10) {
            await bot.sendMessage(chatId, '❌ Введите число от 1 до 10');
            return;
          }
          await logHealthData(chatId, 'mood', { score: moodScore });
          await bot.sendMessage(chatId, '✅ Настроение записано! 🧠');
          userSessions.delete(chatId);
          break;
          
        case 'add_medication':
          await createReminder(chatId, text);
          await bot.sendMessage(chatId, '✅ Напоминание создано! 💊');
          userSessions.delete(chatId);
          break;
          
        case 'set_reminder':
          await createReminder(chatId, text);
          await bot.sendMessage(chatId, '✅ Напоминание установлено! 🔔');
          userSessions.delete(chatId);
          break;
          
        case 'message_specialist':
          await sendMessageToSpecialist(chatId, session.specialistId, text);
          await bot.sendMessage(chatId, '✅ Сообщение отправлено специалисту! 👨‍⚕️');
          userSessions.delete(chatId);
          break;
          
        case 'confirm_delete':
          if (text === 'ПОДТВЕРЖДАЮ') {
            await deleteUser(chatId);
            await bot.sendMessage(chatId, '❌ Аккаунт удалён.');
          } else {
            await bot.sendMessage(chatId, '❌ Удаление отменено.');
          }
          userSessions.delete(chatId);
          break;
          
        default:
          await bot.sendMessage(chatId, '❌ Неизвестная команда. Нажмите /start для начала.');
          userSessions.delete(chatId);
      }
    } catch (err) {
      console.error('Error in message handler:', err);
      await bot.sendMessage(chatId, '❌ Произошла ошибка. Попробуйте позже.');
    }
  });
}

// ==================== HELPER FUNCTIONS ====================

async function getAIResponse(message, chatId) {
  // TODO: Integrate with Qwen AI API
  const responses = {
    'сон': 'Для улучшения сна рекомендую: ложиться в одно время, избегать экранов за 2 часа до сна, поддерживать температуру 18-20°C.',
    'питание': 'Здоровое питание включает: больше овощей и фруктов, меньше обработанной пищи, достаточное количество белка.',
    'тренировка': 'Для начала рекомендую 30 минут ходьбы в день. Постепенно увеличивайте интенсивность.',
    'стресс': 'Для снижения стресса: медитация, глубокое дыхание, прогулки на свежем воздухе.'
  };
  
  for (const [keyword, response] of Object.entries(responses)) {
    if (message.toLowerCase().includes(keyword)) {
      return response;
    }
  }
  
  return 'Я могу помочь с вопросами о сне, питании, тренировках и стрессе. Задайте конкретный вопрос!';
}

async function logHealthData(chatId, type, data) {
  const user = await db.query('SELECT id FROM telegram_users WHERE chat_id = $1', [chatId]);
  if (user.rows.length === 0) return;
  
  const userId = user.rows[0].id;
  
  // Insert into appropriate table based on type
  // TODO: Implement actual database logging
  console.log(`Logging ${type} for user ${userId}:`, data);
}

async function createReminder(chatId, reminderText) {
  const user = await db.query('SELECT id FROM telegram_users WHERE chat_id = $1', [chatId]);
  if (user.rows.length === 0) return;
  
  const userId = user.rows[0].id;
  
  // Parse reminder text and create reminder
  // TODO: Implement actual reminder creation
  console.log(`Creating reminder for user ${userId}:`, reminderText);
}

async function sendMessageToSpecialist(chatId, specialistId, message) {
  // TODO: Send message to specialist via Telegram or in-app
  console.log(`Message to specialist ${specialistId} from ${chatId}:`, message);
}

async function deleteUser(chatId) {
  await db.query('DELETE FROM telegram_users WHERE chat_id = $1', [chatId]);
  userSessions.delete(chatId);
}

// ==================== SCHEDULED REMINDERS ====================

// Send reminders every 5 minutes
setInterval(async () => {
  if (!bot) return;
  
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    
    const reminders = await db.query(
      `SELECT r.*, tu.chat_id, tu.first_name 
       FROM reminders r
       JOIN telegram_users tu ON r.user_id = tu.id
       WHERE r.active = true AND r.time = $1`,
      [currentTime]
    );
    
    for (const reminder of reminders.rows) {
      await bot.sendMessage(
        reminder.chat_id,
        `🔔 Напоминание\n\n${reminder.title}\n\n${reminder.description || ''}`
      );
    }
  } catch (err) {
    console.error('Error sending scheduled reminders:', err);
  }
}, 300000); // 5 minutes

module.exports = { bot };
