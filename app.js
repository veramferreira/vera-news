const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { psqlErrors, otherErrors } = require("./errors");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchVotesByArticleId,
} = require("./controllers/articles.controller");
const { deleteComment } = require("./controllers/comments.controller");
const app = express();

app.use(express.json())

// Endpoints

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId)
app.patch("/api/articles/:article_id", patchVotesByArticleId)

app.delete("/api/comments/:comment_id", deleteComment)

// Error handling

app.use(psqlErrors);

app.use(otherErrors);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server error! We're very sorry!" });
});

module.exports = app;
