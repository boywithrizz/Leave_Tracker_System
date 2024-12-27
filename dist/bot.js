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
dotenv_1.default.config(); // Load environment variables from .env file
const telegraf_1 = require("telegraf");
const routes_1 = require("./routes");
const database_1 = require("./database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const session_1 = require("./middleware/session");
const dailyReminder_1 = require("./cron/dailyReminder");
const uuid_1 = require("uuid");
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.use(session_1.sessionMiddleware); // Use session middleware to manage user sessions
// Command to sign up a new user
bot.command('signup', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [username, password] = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text.split(' ').slice(1)) || [];
    if (!username || !password) {
        ctx.reply('Usage: /signup <username> <password>');
        return;
    }
    const db = yield (0, database_1.initializeDatabase)();
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const userId = (0, uuid_1.v4)(); // Generate a unique user ID
    yield db.collection('users').insertOne({ user_id: userId, username, password: hashedPassword });
    ctx.reply('User registered successfully!');
}));
// Command to sign in an existing user
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
// Command to list all available commands
bot.command('commands', (ctx) => {
    ctx.reply('Available commands:\n' +
        '/signup <username> <password> - Sign up for a new account\n' +
        '/signin <username> <password> - Sign in to your account\n' +
        '/set_schedule <schedule> - Set your weekly class schedule\n' +
        '/help - Get help information\n' +
        '/start - Start the bot and display the menu');
});
// Command to display help information
bot.command('help', (ctx) => {
    ctx.reply('Help Information:\n' +
        '/signup <username> <password> - Sign up for a new account\n' +
        '/signin <username> <password> - Sign in to your account\n' +
        '/set_schedule <schedule> - Set your weekly class schedule\n' +
        '/commands - List all available commands\n' +
        '/start - Start the bot and display the menu\n\n' +
        'Created by - Ayush Yadav\n' +
        'Email - beatscupltors@gmail.com');
});
// Command to start the bot and display the menu
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
        [telegraf_1.Markup.button.callback('Help', 'help')],
        [telegraf_1.Markup.button.callback('Commands', 'commands')]
    ]));
}));
// Type guard to check if ctx.message has a text property
function hasTextProperty(message) {
    return message && typeof message.text === 'string';
}
// Function to handle the set schedule process
const handleSetSchedule = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, database_1.initializeDatabase)();
    const userId = ctx.session.user.user_id;
    if (!ctx.session.step) {
        ctx.session.step = 'subjects';
        ctx.session.subjects = [];
        ctx.reply('Please enter the names of your subjects, separated by commas.');
    }
    else if (ctx.session.step === 'subjects') {
        if (hasTextProperty(ctx.message)) {
            ctx.session.subjects = ctx.message.text.split(',').map(subject => subject.trim());
        }
        ctx.session.schedule = {};
        ctx.session.currentDay = 0;
        ctx.session.currentPeriod = 0;
        ctx.session.step = 'schedule';
        ctx.reply('Please enter the schedule for Monday. Enter the subject for period 1.');
    }
    else if (ctx.session.step === 'schedule') {
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const day = dayNames[ctx.session.currentDay];
        const period = ctx.session.currentPeriod + 1;
        if (!ctx.session.schedule[day]) {
            ctx.session.schedule[day] = [];
        }
        if (hasTextProperty(ctx.message)) {
            ctx.session.schedule[day].push(ctx.message.text || 'Free');
        }
        if (ctx.session.currentPeriod < 6) {
            ctx.session.currentPeriod++;
            ctx.reply(`Enter the subject for period ${ctx.session.currentPeriod + 1}.`);
        }
        else if (ctx.session.currentDay < 4) {
            ctx.session.currentDay++;
            ctx.session.currentPeriod = 0;
            ctx.reply(`Please enter the schedule for ${dayNames[ctx.session.currentDay]}. Enter the subject for period 1.`);
        }
        else {
            yield db.collection('schedule').updateOne({ user_id: userId }, { $set: { schedule: ctx.session.schedule } }, { upsert: true });
            ctx.reply('Schedule set successfully!');
            ctx.session.step = undefined;
            ctx.session.subjects = undefined;
            ctx.session.schedule = undefined;
            ctx.session.currentDay = undefined;
            ctx.session.currentPeriod = undefined;
        }
    }
});
// Handle the set schedule command
bot.command('set_schedule', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ctx.session.user) {
        ctx.reply('User information not available. Please sign in first.');
        return;
    }
    ctx.reply('Let\'s set your weekly class schedule. Please follow the instructions.');
    handleSetSchedule(ctx);
}));
// Handle text messages for the set schedule process
bot.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.session.step) {
        handleSetSchedule(ctx);
    }
}));
(0, routes_1.setupRoutes)(bot); // Set up routes for the bot
(0, dailyReminder_1.setupDailyReminder)(bot); // Set up daily reminder
bot.launch().then(() => {
    console.log('Bot is up and running');
});
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
