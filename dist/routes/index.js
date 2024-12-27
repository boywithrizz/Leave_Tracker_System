"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const attendanceController_1 = require("../controllers/attendanceController");
const scheduleController_1 = require("../controllers/scheduleController");
const setupRoutes = (bot) => {
    bot.action('mark_present', (ctx) => {
        if (!ctx.session.user) {
            ctx.reply('User information not available. Please sign in first.');
            return;
        }
        console.log('mark_present action triggered');
        (0, attendanceController_1.markPresent)(ctx);
    });
    bot.action('mark_absent', (ctx) => {
        if (!ctx.session.user) {
            ctx.reply('User information not available. Please sign in first.');
            return;
        }
        console.log('mark_absent action triggered');
        (0, attendanceController_1.markAbsent)(ctx);
    });
    bot.action('today_status', (ctx) => {
        if (!ctx.session.user) {
            ctx.reply('User information not available. Please sign in first.');
            return;
        }
        console.log('today_status action triggered');
        (0, attendanceController_1.getTodayAttendanceStatus)(ctx);
    });
    bot.action('attendance', (ctx) => {
        if (!ctx.session.user) {
            ctx.reply('User information not available. Please sign in first.');
            return;
        }
        console.log('attendance action triggered');
        (0, attendanceController_1.getAttendance)(ctx);
    });
    bot.command('set_schedule', (ctx) => {
        if (!ctx.session.user) {
            ctx.reply('User information not available. Please sign in first.');
            return;
        }
        console.log('set_schedule command triggered');
        (0, scheduleController_1.setSchedule)(ctx);
    });
    bot.command('help', (ctx) => {
        ctx.reply('Help Information:\n' +
            '/signup <username> <password> - Sign up for a new account\n' +
            '/signin <username> <password> - Sign in to your account\n' +
            '/set_schedule <schedule> - Set your weekly class schedule\n' +
            '/commands - List all available commands\n' +
            '/start - Start the bot and display the menu');
    });
};
exports.setupRoutes = setupRoutes;
