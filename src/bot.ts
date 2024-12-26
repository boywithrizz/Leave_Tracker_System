import { Telegraf } from 'telegraf';
import { setupRoutes } from './routes';

const bot = new Telegraf('7274383239:AAGTONsMjxvgwRAkeR9pk-940BYuX2zm-rY');

bot.start((ctx) => ctx.reply('Welcome! This bot will help you track attendance.'));
bot.help((ctx) => ctx.reply('Send /start to start the bot.'));

setupRoutes(bot);

bot.launch().then(() => {
  console.log('Bot is up and running');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));