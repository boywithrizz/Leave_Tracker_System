import { Telegraf, Context } from 'telegraf';
import { markPresent, markAbsent, getAttendance, getTodayAttendanceStatus } from '../controllers/attendanceController';
import { setSchedule } from '../controllers/scheduleController';

interface SessionContext extends Context {
  session: {
    user?: any;
  };
}

export const setupRoutes = (bot: Telegraf<SessionContext>) => {
  bot.action('mark_present', (ctx) => {
    if (!ctx.session.user) {
      ctx.reply('User information not available. Please sign in first.');
      return;
    }
    console.log('mark_present action triggered');
    markPresent(ctx as SessionContext);
  });

  bot.action('mark_absent', (ctx) => {
    if (!ctx.session.user) {
      ctx.reply('User information not available. Please sign in first.');
      return;
    }
    console.log('mark_absent action triggered');
    markAbsent(ctx as SessionContext);
  });

  bot.action('today_status', (ctx) => {
    if (!ctx.session.user) {
      ctx.reply('User information not available. Please sign in first.');
      return;
    }
    console.log('today_status action triggered');
    getTodayAttendanceStatus(ctx as SessionContext);
  });

  bot.action('attendance', (ctx) => {
    if (!ctx.session.user) {
      ctx.reply('User information not available. Please sign in first.');
      return;
    }
    console.log('attendance action triggered');
    getAttendance(ctx as SessionContext);
  });

  bot.command('set_schedule', (ctx) => {
    if (!ctx.session.user) {
      ctx.reply('User information not available. Please sign in first.');
      return;
    }
    console.log('set_schedule command triggered');
    setSchedule(ctx as SessionContext);
  });

  bot.action('help', (ctx) => {
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

  bot.action('commands', (ctx) => {
    ctx.reply(
      'Available commands:\n' +
      '/signup <username> <password> - Sign up for a new account\n' +
      '/signin <username> <password> - Sign in to your account\n' +
      '/set_schedule <schedule> - Set your weekly class schedule\n' +
      '/help - Get help information\n' +
      '/start - Start the bot and display the menu'
    );
  });
};