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
exports.setupDailyReminder = void 0;
const database_1 = require("../database");
const setupDailyReminder = (bot) => {
    const cron = require('node-cron');
    cron.schedule('30 15 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield (0, database_1.initializeDatabase)();
        const users = yield db.collection('users').find().toArray();
        users.forEach(user => {
            bot.telegram.sendMessage(user.user_id, 'Reminder: Please mark your attendance for today if you haven\'t done so already.');
        });
    }), {
        timezone: "Asia/Kolkata"
    });
};
exports.setupDailyReminder = setupDailyReminder;
