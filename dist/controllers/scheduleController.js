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
exports.setSchedule = void 0;
const database_1 = require("../database");
// Function to set the weekly class schedule
const setSchedule = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!('text' in ctx.message)) {
        ctx.reply('Invalid message format.');
        return;
    }
    const schedule = ctx.message.text.split(' ').slice(1).join(' ');
    if (!schedule) {
        ctx.reply('Usage: /set_schedule <schedule>');
        return;
    }
    const db = yield (0, database_1.initializeDatabase)();
    const userId = ctx.session.user.user_id;
    try {
        yield db.collection('schedule').updateOne({ user_id: userId }, { $set: { schedule } }, { upsert: true });
        ctx.reply('Schedule set successfully!');
    }
    catch (error) {
        console.error('Error setting schedule:', error);
        ctx.reply('An error occurred while setting the schedule.');
    }
});
exports.setSchedule = setSchedule;
