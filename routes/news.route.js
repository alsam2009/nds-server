import { Router } from 'express';
import { getNews, getNewsById, launchParser } from '../controllers/news.controller.js'

const router = new Router({ mergeParams: true });

router.get('/data', getNews);
router.get('/data/:id', getNewsById);
// router.post('/send-news', sendNewsToTelegram)
router.get('/parser', launchParser)

export default router;
