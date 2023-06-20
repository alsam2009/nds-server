import { Router } from 'express';
import News from '../models/News.js';
import { getNews } from '../controllers/news.controller.js'

const router = new Router({ mergeParams: true });

router.get('/data', getNews);

export default router;
