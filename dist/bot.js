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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const telegraf_1 = require("telegraf");
const routes_1 = require("./routes");
const database_1 = require("./database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const session_1 = require("./middleware/session");
const dailyReminder_1 = require("./cron/dailyReminder");
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.use(session_1.sessionMiddleware);
bot.command('signup', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [username, password] = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text.split(' ').slice(1)) || [];
    if (!username || !password) {
        ctx.reply('Usage: /signup <username> <password>');
        return;
    }
    const db = yield (0, database_1.initializeDatabase)();
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    yield db.collection('users').insertOne({ user_id: ctx.from.id.toString(), username, password: hashedPassword });
    ctx.reply('User registered successfully!');
}));
bot.command('signin', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [username, password] = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text.split(' ').slice(1)) || [];
    if (!username || !password) {
        ctx.reply('Usage: /signin <username> <password>');
        return;
    }
    const db = yield (0, database_1.initializeDatabase)();
    const user = yield db.collection('users').findOne({ username });
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        ctx.reply('Invalid username or password.');
        return;
    }
    ctx.session.user = { user_id: user.user_id, username: user.username };
    ctx.reply('Signed in successfully!');
}));
bot.command('commands', (ctx) => {
    ctx.reply('Available commands:\n' +
        '/signup <username> <password> - Sign up for a new account\n' +
        '/signin <username> <password> - Sign in to your account\n' +
        '/set_schedule <schedule> - Set your weekly class schedule\n' +
        '/help - Get help information\n' +
        '/start - Start the bot and display the menu');
});
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ctx.session.user) {
        ctx.reply('Please sign in first using /signin <username> <password>');
        return;
    }
    ctx.reply(`Welcome, ${ctx.session.user.username}! This bot will help you track attendance.`, telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback('Mark Present', 'mark_present')],
        [telegraf_1.Markup.button.callback('Mark Absent', 'mark_absent')],
        [telegraf_1.Markup.button.callback('Get Today\'s Status', 'today_status')],
        [telegraf_1.Markup.button.callback('Get Attendance', 'attendance')],
        [telegraf_1.Markup.button.callback('Set Schedule', 'set_schedule')],
        [telegraf_1.Markup.button.callback('Help', 'help')]
    ]));
}));
(0, routes_1.setupRoutes)(bot);
(0, dailyReminder_1.setupDailyReminder)(bot);
bot.launch().then(() => {
    console.log('Bot is up and running');
});
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
