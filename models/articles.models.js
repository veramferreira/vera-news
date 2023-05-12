const db = require("../db/connection");
const { checkUsernameExists } = require("../db/seeds/utils");

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

  // check if any values are missing from the comment
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "required values missing!" });
  }

  // check if any of the values given are invalid data
  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "ooops! bad request: invalid data!" });
  }

  // check if username exists
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "username not found!" });
      }

      // check if article_id is valid
      return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]);
    })
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found!" });
      }

      // if so insert comment
      return db.query(
        `
        INSERT INTO comments
        (article_id, body, author)
        VALUES
        ($1, $2, $3)
        RETURNING comments.author AS username, comments.body
        `,
        [article_id, body, username]);
    })
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found!" });
      }
      return result.rows[0];
    });
};
