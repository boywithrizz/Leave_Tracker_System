import { Context } from 'telegraf';
import { initializeDatabase } from '../database';

interface SessionContext extends Context {
  session: {
    user?: any;
  };
}

// Function to mark attendance
export const markAttendance = async (ctx: SessionContext, status: 'present' | 'absent') => {
  console.log(`markAttendance called with status: ${status}`);
  if (!ctx.from || !ctx.session.user) {
    ctx.reply('User information not available.');
    return;
  }

  const db = await initializeDatabase();
  const userId = ctx.session.user.user_id;
  const date = new Date().toISOString().split('T')[0];

  try {
    await db.collection('attendance').updateOne(
      { user_id: userId, date },
      { $set: { status } },
      { upsert: true }
    );
    ctx.reply(`Attendance marked as ${status} for today.`);
  } catch (error: any) {
    console.error('Error marking attendance:', error);
    ctx.reply('An error occurred while marking attendance.');
  }
};

// Function to mark present
export const markPresent = (ctx: SessionContext) => markAttendance(ctx, 'present');

// Function to mark absent
export const markAbsent = (ctx: SessionContext) => markAttendance(ctx, 'absent');

// Function to get today's attendance status
export const getTodayAttendanceStatus = async (ctx: SessionContext) => {
  console.log('getTodayAttendanceStatus called');
  if (!ctx.from || !ctx.session.user) {
    ctx.reply('User information not available.');
    return;
  }

  const db = await initializeDatabase();
  const userId = ctx.session.user.user_id;
  const date = new Date().toISOString().split('T')[0];

  const record = await db.collection('attendance').findOne({ user_id: userId, date });

  if (!record) {
    ctx.reply('No attendance record found for today.');
  } else {
    ctx.reply(`Your attendance status for today is: ${record.status}`);
  }
};

// Function to get attendance records
export const getAttendance = async (ctx: SessionContext) => {
  console.log('getAttendance called');
  if (!ctx.from || !ctx.session.user) {
    ctx.reply('User information not available.');
    return;
  }

  const db = await initializeDatabase();
  const userId = ctx.session.user.user_id;

  const records = await db.collection('attendance').find({ user_id: userId }).toArray();

  if (records.length === 0) {
    ctx.reply('No attendance records found.');
  } else {
    const dates = records.map(record => `${record.date}: ${record.status}`).join('\n');
    ctx.reply(`Your attendance records:\n${dates}`);
  }
};