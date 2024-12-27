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
exports.initializeDatabase = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
let db;
// Function to initialize the database connection
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!db) {
        const client = new mongodb_1.MongoClient(process.env.MONGODB_URI, {
            tlsAllowInvalidCertificates: true, // Disable SSL validation (for testing purposes)
        });
        yield client.connect();
        db = client.db('attendance_db'); // Replace with your database name
        try {
            yield db.collection('attendance').createIndex({ user_id: 1, date: 1 }, { unique: true });
            yield db.collection('users').createIndex({ user_id: 1 }, { unique: true });
            yield db.collection('schedule').createIndex({ user_id: 1 }, { unique: true });
        }
        catch (error) {
            if (error.code !== 11000) { // Ignore duplicate key error
                console.error('Error creating indexes:', error);
            }
        }
    }
    return db;
});
exports.initializeDatabase = initializeDatabase;
