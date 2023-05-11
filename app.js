const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { psqlErrors, otherErrors } = require("./errors");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controller");
const app = express();

// Endpoints

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

// Error handling

app.use(psqlErrors);

app.use(otherErrors);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server error! We're very sorry!" });
});

module.exports = app;
