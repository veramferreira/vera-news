const { selectArticleById } = require("../models/article_id.models");

exports.getArticlebyId = (req, res, next) => {
  const { article_id: article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ result: article });
    })
    .catch((err) => {
      next(err);
    });
};
