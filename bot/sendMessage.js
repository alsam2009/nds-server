import bot from './telegramBot.js'
import dotenv from 'dotenv';

dotenv.config();

export const sendMessageToTelegram = async (message) => {
  const messageOptions = { parse_mode: 'HTML' };
  const chatId = process.env.CHAT_ID

  try {
  await bot.sendMessage(chatId, message, messageOptions)
  console.log('Сообщение в Telegram успешно отправлено');
  } catch {(error) =>
    console.error('Произошла ошибка при отправке сообщения в Telegram:', error);
  };
}