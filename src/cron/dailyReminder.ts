import { Telegraf, Context } from 'telegraf';
import { initializeDatabase } from '../database';

interface SessionContext extends Context {
  session: {
    user?: any;
  };
}

// Function to set up daily reminders
export const setupDailyReminder = (bot: Telegraf<SessionContext>) => {
  const cron = require('node-cron');

  cron.schedule('30 15 * * *', async () => {
    const db = await initializeDatabase();
    const users = await db.collection('users').find().toArray();

    users.forEach(user => {
      bot.telegram.sendMessage(user.user_id, 'Reminder: Please mark your attendance for today if you haven\'t done so already.');
    });
  }, {
    timezone: "Asia/Kolkata"
  });
};