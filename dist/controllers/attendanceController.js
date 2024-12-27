"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendance = exports.getTodayAttendanceStatus = exports.markAbsent = exports.markPresent = exports.markAttendance = void 0;
const database_1 = require("../database");
const markAttendance = (ctx, status) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`markAttendance called with status: ${status}`);
    if (!ctx.from || !ctx.session.user) {
        ctx.reply('User information not available.');
        return;
    }
    const db = yield (0, database_1.initializeDatabase)();
    const userId = ctx.session.user.user_id;
    const date = new Date().toISOString().split('T')[0];
    try {
        yield db.collection('attendance').updateOne({ user_id: userId, date }, { $set: { status } }, { upsert: true });
        ctx.reply(`Attendance marked as ${status} for today.`);
    }
    catch (error) {
        console.error('Error marking attendance:', error);
        ctx.reply('An error occurred while marking attendance.');
    }
});
exports.markAttendance = markAttendance;
const markPresent = (ctx) => (0, exports.markAttendance)(ctx, 'present');
exports.markPresent = markPresent;
const markAbsent = (ctx) => (0, exports.markAttendance)(ctx, 'absent');
exports.markAbsent = markAbsent;
const getTodayAttendanceStatus = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getTodayAttendanceStatus called');
    if (!ctx.from || !ctx.session.user) {
        ctx.reply('User information not available.');
        return;
    }
    const db = yield (0, database_1.initializeDatabase)();
    const userId = ctx.session.user.user_id;
    const date = new Date().toISOString().split('T')[0];
    const record = yield db.collection('attendance').findOne({ user_id: userId, date });
    if (!record) {
        ctx.reply('No attendance record found for today.');
    }
    else {
        ctx.reply(`Your attendance status for today is: ${record.status}`);
    }
});
exports.getTodayAttendanceStatus = getTodayAttendanceStatus;
const getAttendance = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getAttendance called');
    if (!ctx.from || !ctx.session.user) {
        ctx.reply('User information not available.');
        return;
    }
    const db = yield (0, database_1.initializeDatabase)();
    const userId = ctx.session.user.user_id;
    const records = yield db.collection('attendance').find({ user_id: userId }).toArray();
    if (records.length === 0) {
        ctx.reply('No attendance records found.');
    }
    else {
        const dates = records.map(record => `${record.date}: ${record.status}`).join('\n');
        ctx.reply(`Your attendance records:\n${dates}`);
    }
});
exports.getAttendance = getAttendance;
