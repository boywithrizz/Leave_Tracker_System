import { Telegraf } from 'telegraf';
import { markPresent, markAbsent, getAttendance, getTodayAttendanceStatus } from '../controllers/attendanceController';

export const setupRoutes = (bot: Telegraf) => {
  bot.action('mark_present', (ctx) => {
    console.log('mark_present action triggered');
    markPresent(ctx);
  });

  bot.action('mark_absent', (ctx) => {
    console.log('mark_absent action triggered');
    markAbsent(ctx);
  });

  bot.action('today_status', (ctx) => {
    console.log('today_status action triggered');
    getTodayAttendanceStatus(ctx);
  });

  bot.action('attendance', (ctx) => {
    console.log('attendance action triggered');
    getAttendance(ctx);
  });

  bot.command('help', (ctx) => {
    ctx.reply('Send /start to start the bot.');
  });
};