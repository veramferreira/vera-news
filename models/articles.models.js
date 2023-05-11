const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found!" });
      }
      return result.rows;
    });
};

exports.fetchArticles = (sort_by = "created_at", order = "DESC") => {
  return db
    .query(
      `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url
  ORDER BY articles.created_at DESC;
  `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectCommentByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "DESC"
) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found!" });
      }
      return result.rows;
    });
};

exports.createComment = (article_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `
  INSERT INTO comments
  (article_id, body, author)
  VALUES
  ($1, $2, $3)
  RETURNING comments.author AS username, comments.body
  `,
      [article_id, body, username]
    )
    .then((result) => {
      return result.rows[0];
    });
};
