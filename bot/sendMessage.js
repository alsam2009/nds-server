import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

export const sendMessageToTelegram = async (message) => {
  const messageOptions = { parse_mode: 'HTML' };
  const chatId = process.env.CHAT_ID
  const botToken = process.env.TOKEN

  try {
    await axios.get(`
    https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=HTML
  `);
  console.log('Сообщение в Telegram успешно отправлено');
  } catch {(error) =>
    console.error('Произошла ошибка при отправке сообщения в Telegram:', error);
  };
}