"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const attendanceController_1 = require("../controllers/attendanceController");
const setupRoutes = (bot) => {
    bot.action('mark_present', (ctx) => {
        console.log('mark_present action triggered');
        (0, attendanceController_1.markPresent)(ctx);
    });
    bot.action('mark_absent', (ctx) => {
        console.log('mark_absent action triggered');
        (0, attendanceController_1.markAbsent)(ctx);
    });
    bot.action('today_status', (ctx) => {
        console.log('today_status action triggered');
        (0, attendanceController_1.getTodayAttendanceStatus)(ctx);
    });
    bot.action('attendance', (ctx) => {
        console.log('attendance action triggered');
        (0, attendanceController_1.getAttendance)(ctx);
    });
    bot.command('help', (ctx) => {
        ctx.reply('Send /start to start the bot.');
    });
};
exports.setupRoutes = setupRoutes;
