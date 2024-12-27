import dotenv from 'dotenv';
dotenv.config();

import { Telegraf, Markup, Context } from 'telegraf';
import { setupRoutes } from './routes';
import { initializeDatabase } from './database';
import bcrypt from 'bcrypt';
import { sessionMiddleware } from './middleware/session';
import { setupDailyReminder } from './cron/dailyReminder';

interface SessionContext extends Context {
  session: {
    user?: any;
  };
}

const bot = new Telegraf<SessionContext>(process.env.BOT_TOKEN!);

bot.use(sessionMiddleware);

bot.command('signup', async (ctx) => {
  const [username, password] = ctx.message?.text.split(' ').slice(1) || [];
  if (!username || !password) {
    ctx.reply('Usage: /signup <username> <password>');
    return;
  }

  const db = await initializeDatabase();
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({ user_id: ctx.from.id.toString(), username, password: hashedPassword });
  ctx.reply('User registered successfully!');
});

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
      [Markup.button.callback('Help', 'help')]
    ])
  );
});

setupRoutes(bot);
setupDailyReminder(bot);

bot.launch().then(() => {
  console.log('Bot is up and running');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));