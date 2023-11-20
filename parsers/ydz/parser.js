// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

import dotenv from 'dotenv';

dotenv.config();
// require('dotenv').config();

import { sendMessageToTelegram } from '../../bot/sendMessage.js';
import  { HEADERS, COOKIES } from './const.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb'

// const fs = require('fs');
// const path = require('path');
// const { MongoClient } = require('mongodb');


const headers = HEADERS;
const cookies = COOKIES;
const log = console.log;

function loadUrlsFromJson() {
  const filePath = path.join( process.cwd(), 'parsers', 'ydz', 'urls_chanels_nds.json');

  if (fs.existsSync(filePath)) {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const urlsChannels = JSON.parse(jsonData);
    return urlsChannels;
  } else {
    throw new Error(
      'JSON file not found. Create urls_chanels_nds.json with {"urls": ["url1", "url2", "..."]}'
    );
  }
}

function getAlias(url) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

async function getChannelData(channelUrlApi) {
  try {
    const response = await axios.get(channelUrlApi, {
      headers: headers,
      cookies: cookies,
      // withCredentials: true,
    });
    if (response.status === 200) {
      const jsonData = response.data;
      const channelData = [];
      const items = jsonData.items;
      const tagsChannels = [
        'Важное',
        'Новинки',
        'Обзоры',
        'Мероприятия',
        'Интересно',
      ];

      for (const item of items) {
        if (item.title !== '') {
          const title = item.title;
          const imageUrl = item.common_image.link;
          const articleUrl = item.share_link;
          const articlePreview = item.text;
          const publicationDate = new Date()
            .toISOString()
            .slice(0, 10)

          const tagChannel =
            tagsChannels[Math.floor(Math.random() * tagsChannels.length)];

          channelData.push({
            title,
            image_url: imageUrl,
            article_url: articleUrl,
            article_preview: articlePreview,
            publication_date: publicationDate,
            tag_article: tagChannel,
          });
        }
      }

      return channelData;
    } else {
      throw new Error(
        `Что-то пошло не так... Ответ сервера: ${response.status}`
      );
    }
  } catch (error) {
    log('ERROR!!', error);
    return ['У нас проблемы'];
  }
}

function getUrlApi(urlChannel) {
  const pattern = 'https://dzen.ru/api/v3/launcher/more?';
  const alias = getAlias(urlChannel);
  const urlApi =
    pattern +
    (urlChannel.includes('/id/')
      ? `channel_id=${getAlias(urlChannel)}`
      : `channel_name=${getAlias(urlChannel)}`);

  return urlApi;
}

function sendToTelegram(newNews, docsAfterSave) {
  const dateNow = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  });

  const message = `
  <b>Парсер NDS уcпешно отработал:</b>
${dateNow}
Добавлено в базу новостей: <b>${newNews}</b>
В базе новостей: <b>${docsAfterSave}</b>
`;
  sendMessageToTelegram(message)
}

async function saveToMongoDB(channelsInitDataBase) {
  const uri = process.env.DB_CONNECT;
  const client = new MongoClient(uri);
  let docsBeforeSave = 0; //
  let docsAfterSave = 0;
  let collection;

  try {
    await client.connect();

    const database = client.db('nds-app');
    collection = database.collection('news');
    docsBeforeSave = await collection.countDocuments({}, { hint: "_id_" });


    // Вставляем новые записи в базу данных
    if (channelsInitDataBase.length > 0) {
      const options = { ordered: false }; // Продолжаем вставку новостей, даже если возникнут дубликаты
      await collection.insertMany(channelsInitDataBase, options);
    } else {
      log('No news to save.');
    }
  } catch (error) {
    if (error.code === 11000) {
      // Обрабатываем ошибку дубликата записи и не выводим ее в консоль
      docsAfterSave = await collection.countDocuments({}, { hint: "_id_" });
      const newNews =  docsAfterSave - docsBeforeSave
      log(`\nНовых записей: ${newNews}`);
      log(`Сейчас записей в БД: ${docsAfterSave}`);
      sendToTelegram(newNews, docsAfterSave)
    } else {
      // Выводим в консоль другие ошибки, отличные от ошибки дубликата ключа
      log('Failed to save data to MongoDB:', error);
    }
  } finally {
    await client.close();
  }
}


async function main() {
  const initialDataFromJson = loadUrlsFromJson();
  const urlsFromJson = initialDataFromJson.urls;

  if (urlsFromJson && urlsFromJson.length > 0) {
    const channelsInitDataBase = [];

    for (let i = 0; i < urlsFromJson.length; i++) {
      const urlChannel = urlsFromJson[i];

      const channelUrlApi = getUrlApi(urlChannel);
      const channelData = await getChannelData(channelUrlApi);
      channelsInitDataBase.push(...channelData);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Задержка 2 секунды

    saveToMongoDB(channelsInitDataBase);
  }
}

// Точка входа
export default function startParser() {
  main()
}
