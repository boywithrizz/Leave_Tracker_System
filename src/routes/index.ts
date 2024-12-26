import { Telegraf } from 'telegraf';
import { markAttendance, getAttendance } from '../controllers/attendanceController';

export const setupRoutes = (bot: Telegraf) => {
  bot.command('mark', markAttendance);
  bot.command('attendance', getAttendance);
};