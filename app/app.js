const express = require("express");
const cors = require("cors");
const {
  getTopics,
  getUsers,
  getArticles,
  getArticleByID,
  patchArticleByID,
  getCommentsByArticleID,
  postComment,
  getUserByID,
  deleteCommentByID,
  getEndpoints,
  patchCommentByID,
  postTopic,
  postArticle,
  deleteArticleByID,
} = require("./controllers/api-controllers");
const {
  pathNotFoundErr,
  errorHandler,
  handle500s,
} = require("./controllers/error-controllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);
app.get("/api/users/:username", getUserByID);
app.get("/api", getEndpoints);

app.patch("/api/articles/:article_id", patchArticleByID);
app.patch("/api/comments/:comment_id", patchCommentByID);

app.post("/api/articles/:article_id/comments", postComment);
app.post("/api/topics", postTopic);
app.post("/api/articles", postArticle);

app.delete("/api/comments/:comment_id", deleteCommentByID);
app.delete("/api/articles/:article_id", deleteArticleByID);

app.all("/*", pathNotFoundErr);

app.use(errorHandler);
app.use(handle500s);

module.exports = app;
