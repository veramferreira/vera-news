const {
  selectArticleById,
  fetchArticles,
  selectCommentByArticleId,
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

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id: article_id } = req.params;
  const { sort_by, order } = req.query;
  selectCommentByArticleId(article_id, sort_by, order)
    .then((result) => {
      res.status(200).send({ comments: result });
    })
    .catch((err) => {
      next(err);
    });
};
