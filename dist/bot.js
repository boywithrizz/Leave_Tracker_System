"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// filepath: /c:/Users/hp/Ayush/Code/Web Dev/Projects/telegram-attendance-bot/src/bot.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const telegraf_1 = require("telegraf");
const routes_1 = require("./routes");
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    ctx.reply('Welcome! This bot will help you track attendance.', telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('Mark Present', 'mark_present')],
        [telegraf_1.Markup.button.callback('Mark Absent', 'mark_absent')],
        [telegraf_1.Markup.button.callback('Get Today\'s Status', 'today_status')],
        [telegraf_1.Markup.button.callback('Get Attendance', 'attendance')],
        [telegraf_1.Markup.button.callback('Help', 'help')]
    ]));
});
(0, routes_1.setupRoutes)(bot);
bot.launch().then(() => {
    console.log('Bot is up and running');
});
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
