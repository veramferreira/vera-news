const {
  selectArticleById,
  fetchArticles,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id: article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ result: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  fetchArticles()
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};
