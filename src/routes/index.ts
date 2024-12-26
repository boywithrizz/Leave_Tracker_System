import { Telegraf } from 'telegraf';
import { markPresent, markAbsent, getAttendance, getTodayAttendanceStatus } from '../controllers/attendanceController';

export const setupRoutes = (bot: Telegraf) => {
  bot.action('mark_present', markPresent);
  bot.action('mark_absent', markAbsent);
  bot.action('today_status', getTodayAttendanceStatus);
  bot.action('attendance', getAttendance);
  bot.command('help', (ctx) => {
    ctx.reply('Send /start to start the bot.');
  });
};