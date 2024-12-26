import { Telegraf, Markup } from 'telegraf';
import { setupRoutes } from './routes';

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => {
  ctx.reply(
    'Welcome! This bot will help you track attendance.',
    Markup.inlineKeyboard([
      [Markup.button.callback('Mark Present', 'mark_present')],
      [Markup.button.callback('Mark Absent', 'mark_absent')],
      [Markup.button.callback('Get Today\'s Status', 'today_status')],
      [Markup.button.callback('Get Attendance', 'attendance')],
      [Markup.button.callback('Help', 'help')]
    ])
  );
});

setupRoutes(bot);

bot.launch().then(() => {
  console.log('Bot is up and running');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));