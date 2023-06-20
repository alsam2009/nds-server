import News from '../models/News.js'

export const getNews = async (req, res) => {
  try {
    // Парсинг параметров запроса
    const query = req.query.q;
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 10;
    const tag = req.query.tag_article;
    const random = parseInt(req.query.random);

    // Component RandomNews
    if (random) {
      const data = await News.aggregate([{ $sample: { size: random } }]);
      return res.json(data);
    }
    // Component Menu
    if (tag) {
      const data = await News
        .find({ tag_article: tag })
        .sort({ publication_date: -1 })
        .skip((page-1) * limit)
        .limit(limit);
      return res.json(data);
    }
    // Component Search
    if (query) {
      const re = new RegExp(query, 'i')
      const data = await News
        .find().or([
          { title: { $regex: re } },
          { article_preview: { $regex: re } }
        ])
        // Альтернативный вариант поиска: .find({$text: { $search: query, $language: 'ru'}}), но ищет только по полям из индекса и точное совпадение слова
        return res.json(data)
    }
    // Все новости
    const data = await News
    .find({ })
    .sort({ publication_date: -1 })
    .skip((page-1) * limit)
    .limit(limit);
  return res.status(200).json(data);
  } catch (e) {
    res.status(500).json({
      message: "На сервере произошла ошибка. Попробуйте позже.",
    });
  }
}

export const getNewsById = async (req, res) => {
    try {
      const data = await News.findById(req.params.id).exec();
      res.json(data);
  } catch (e) {
    res.status(500).json({
      message: "На сервере произошла ошибка. Попробуйте чутка позже.",
    });
  }
}


