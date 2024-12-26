import { Context } from 'telegraf';
import { initializeDatabase } from '../database';

export const markAttendance = async (ctx: Context, status: 'present' | 'absent') => {
  if (!ctx.from) {
    ctx.reply('User information not available.');
    return;
  }

  const db = await initializeDatabase();
  const userId = ctx.from.id.toString();
  const date = new Date().toISOString().split('T')[0];

  try {
    await db.collection('attendance').updateOne(
      { user_id: userId, date },
      { $set: { status } },
      { upsert: true }
    );
    ctx.reply(`Attendance marked as ${status} for today.`);
  } catch (error: any) {
    ctx.reply('An error occurred while marking attendance.');
  }
};

export const markPresent = (ctx: Context) => markAttendance(ctx, 'present');
export const markAbsent = (ctx: Context) => markAttendance(ctx, 'absent');

export const getTodayAttendanceStatus = async (ctx: Context) => {
  if (!ctx.from) {
    ctx.reply('User information not available.');
    return;
  }

  const db = await initializeDatabase();
  const userId = ctx.from.id.toString();
  const date = new Date().toISOString().split('T')[0];

  const record = await db.collection('attendance').findOne({ user_id: userId, date });

  if (!record) {
    ctx.reply('No attendance record found for today.');
  } else {
    ctx.reply(`Your attendance status for today is: ${record.status}`);
  }
};

export const getAttendance = async (ctx: Context) => {
  if (!ctx.from) {
    ctx.reply('User information not available.');
    return;
  }

  const db = await initializeDatabase();
  const userId = ctx.from.id.toString();

  const records = await db.collection('attendance').find({ user_id: userId }).toArray();

  if (records.length === 0) {
    ctx.reply('No attendance records found.');
  } else {
    const dates = records.map(record => `${record.date}: ${record.status}`).join('\n');
    ctx.reply(`Your attendance records:\n${dates}`);
  }
};