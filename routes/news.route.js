import { Router } from 'express';
import { getNews, getNewsById } from '../controllers/news.controller.js'

const router = new Router({ mergeParams: true });

router.get('/data', getNews);
router.get('/data/:id', getNewsById);

export default router;
