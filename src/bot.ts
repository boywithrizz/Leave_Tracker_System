// filepath: /c:/Users/hp/Ayush/Code/Web Dev/Projects/telegram-attendance-bot/src/bot.ts
import { Telegraf } from 'telegraf';
import { setupRoutes } from './routes';

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => ctx.reply('Welcome! This bot will help you track attendance.'));
bot.help((ctx) => ctx.reply('Send /start to start the bot.'));

setupRoutes(bot);

bot.launch().then(() => {
  console.log('Bot is up and running');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));