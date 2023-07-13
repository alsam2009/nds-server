import { Router } from 'express';
import { getNews, getNewsById, sendNewsToTelegram } from '../controllers/news.controller.js'

const router = new Router({ mergeParams: true });

router.get('/data', getNews);
router.get('/data/:id', getNewsById);
router.post('/send-news', sendNewsToTelegram)

export default router;
