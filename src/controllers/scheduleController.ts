import { Context } from 'telegraf';
import { initializeDatabase } from '../database';

interface SessionContext extends Context {
  session: {
    user?: any;
  };
}

// Function to set the weekly class schedule
export const setSchedule = async (ctx: SessionContext) => {
  if (!('text' in ctx.message!)) {
    ctx.reply('Invalid message format.');
    return;
  }

  const schedule = ctx.message.text.split(' ').slice(1).join(' ');
  if (!schedule) {
    ctx.reply('Usage: /set_schedule <schedule>');
    return;
  }

  const db = await initializeDatabase();
  const userId = ctx.session.user.user_id;

  try {
    await db.collection('schedule').updateOne(
      { user_id: userId },
      { $set: { schedule } },
      { upsert: true }
    );
    ctx.reply('Schedule set successfully!');
  } catch (error: any) {
    console.error('Error setting schedule:', error);
    ctx.reply('An error occurred while setting the schedule.');
  }
};