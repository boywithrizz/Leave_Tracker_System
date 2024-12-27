import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import { Telegraf, Markup, Context } from 'telegraf';
import { setupRoutes } from './routes';
import { initializeDatabase } from './database';
import bcrypt from 'bcrypt';
import { sessionMiddleware } from './middleware/session';
import { setupDailyReminder } from './cron/dailyReminder';
import { v4 as uuidv4 } from 'uuid';

interface SessionContext extends Context {
  session: {
    user?: any;
    step?: string;
    subjects?: string[];
    schedule?: any;
    currentDay?: number;
    currentPeriod?: number;
  };
}

const bot = new Telegraf<SessionContext>(process.env.BOT_TOKEN!);

bot.use(sessionMiddleware); // Use session middleware to manage user sessions

// Command to sign up a new user
bot.command('signup', async (ctx) => {
  const [username, password] = ctx.message?.text.split(' ').slice(1) || [];
  if (!username || !password) {
    ctx.reply('Usage: /signup <username> <password>');
    return;
  }

  const db = await initializeDatabase();
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4(); // Generate a unique user ID
  await db.collection('users').insertOne({ user_id: userId, username, password: hashedPassword });
  ctx.reply('User registered successfully!');
});

// Command to sign in an existing user
bot.command('signin', async (ctx) => {
  const [username, password] = ctx.message?.text.split(' ').slice(1) || [];
  if (!username || !password) {
    ctx.reply('Usage: /signin <username> <password>');
    return;
  }

  const db = await initializeDatabase();
  const user = await db.collection('users').findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    ctx.reply('Invalid username or password.');
    return;
  }

  ctx.session.user = { user_id: user.user_id, username: user.username };
  ctx.reply('Signed in successfully!');
});

// Command to list all available commands
bot.command('commands', (ctx) => {
  ctx.reply(
    'Available commands:\n' +
    '/signup <username> <password> - Sign up for a new account\n' +
    '/signin <username> <password> - Sign in to your account\n' +
    '/set_schedule <schedule> - Set your weekly class schedule\n' +
    '/help - Get help information\n' +
    '/start - Start the bot and display the menu'
  );
});

// Command to display help information
bot.command('help', (ctx) => {
  ctx.reply(
    'Help Information:\n' +
    '/signup <username> <password> - Sign up for a new account\n' +
    '/signin <username> <password> - Sign in to your account\n' +
    '/set_schedule <schedule> - Set your weekly class schedule\n' +
    '/commands - List all available commands\n' +
    '/start - Start the bot and display the menu\n\n' +
    'Created by - Ayush Yadav\n' +
    'Email - beatscupltors@gmail.com'
  );
});

// Command to start the bot and display the menu
bot.start(async (ctx) => {
  if (!ctx.session.user) {
    ctx.reply('Please sign in first using /signin <username> <password>');
    return;
  }

  ctx.reply(
    `Welcome, ${ctx.session.user.username}! This bot will help you track attendance.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Mark Present', 'mark_present')],
      [Markup.button.callback('Mark Absent', 'mark_absent')],
      [Markup.button.callback('Get Today\'s Status', 'today_status')],
      [Markup.button.callback('Get Attendance', 'attendance')],
      [Markup.button.callback('Set Schedule', 'set_schedule')],
      [Markup.button.callback('Help', 'help')],
      [Markup.button.callback('Commands', 'commands')]
    ])
  );
});

// Type guard to check if ctx.message has a text property
function hasTextProperty(message: any): message is { text: string } {
  return message && typeof message.text === 'string';
}

// Function to handle the set schedule process
const handleSetSchedule = async (ctx: SessionContext) => {
  const db = await initializeDatabase();
  const userId = ctx.session.user.user_id;

  if (!ctx.session.step) {
    ctx.session.step = 'subjects';
    ctx.session.subjects = [];
    ctx.reply('Please enter the names of your subjects, separated by commas.');
  } else if (ctx.session.step === 'subjects') {
    if (hasTextProperty(ctx.message)) {
      ctx.session.subjects = ctx.message.text.split(',').map(subject => subject.trim());
    }
    ctx.session.schedule = {};
    ctx.session.currentDay = 0;
    ctx.session.currentPeriod = 0;
    ctx.session.step = 'schedule';
    ctx.reply('Please enter the schedule for Monday. Enter the subject for period 1.');
  } else if (ctx.session.step === 'schedule') {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const day = dayNames[ctx.session.currentDay!];
    const period = ctx.session.currentPeriod! + 1;

    if (!ctx.session.schedule[day]) {
      ctx.session.schedule[day] = [];
    }

    if (hasTextProperty(ctx.message)) {
      ctx.session.schedule[day].push(ctx.message.text || 'Free');
    }

    if (ctx.session.currentPeriod! < 6) {
      ctx.session.currentPeriod!++;
      ctx.reply(`Enter the subject for period ${ctx.session.currentPeriod! + 1}.`);
    } else if (ctx.session.currentDay! < 4) {
      ctx.session.currentDay!++;
      ctx.session.currentPeriod = 0;
      ctx.reply(`Please enter the schedule for ${dayNames[ctx.session.currentDay!]}. Enter the subject for period 1.`);
    } else {
      await db.collection('schedule').updateOne(
        { user_id: userId },
        { $set: { schedule: ctx.session.schedule } },
        { upsert: true }
      );
      ctx.reply('Schedule set successfully!');
      ctx.session.step = undefined;
      ctx.session.subjects = undefined;
      ctx.session.schedule = undefined;
      ctx.session.currentDay = undefined;
      ctx.session.currentPeriod = undefined;
    }
  }
};

// Handle the set schedule command
bot.command('set_schedule', async (ctx) => {
  if (!ctx.session.user) {
    ctx.reply('User information not available. Please sign in first.');
    return;
  }
  ctx.reply('Let\'s set your weekly class schedule. Please follow the instructions.');
  handleSetSchedule(ctx);
});

// Handle text messages for the set schedule process
bot.on('text', async (ctx) => {
  if (ctx.session.step) {
    handleSetSchedule(ctx);
  }
});

setupRoutes(bot); // Set up routes for the bot
setupDailyReminder(bot); // Set up daily reminder

bot.launch().then(() => {
  console.log('Bot is up and running');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));