import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();
const botToken = process.env.TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

export default bot;