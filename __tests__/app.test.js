const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const sort = require("jest-sorted");
const endpoints = require("../endpoints.json");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");
const { expect } = require("@jest/globals");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  test("GET - status 200 - responds with a list of all available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ endpoints: endpoints });
      });
  });
});

describe("/api/topics", () => {
  describe("GET - status: 200 - responds with topics data", () => {
    test("should return an array of objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
        });
    });
    test("should return an array with all the topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
        });
    });
    test("all objects should have a slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET - status:200 - responds with article's data", () => {
    test("should respond with an object (article) containing all 8 properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.result.length).toBeGreaterThan(0);
          const article = body.result[0];
          expect(article.article_id).toBe(1);
          body.result.forEach((article) => {
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.body).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
          });
        });
    });
  });
  describe("GET - error status", () => {
    test("error status: 400 - invalid article id", () => {
      return request(app)
        .get("/api/articles/invalidid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request: invalid data type!");
        });
    });
    test("error status 404 - valid but non-existent article id", () => {
      return request(app)
        .get("/api/articles/5000")
        .expect(404)
        .then((res) => {
          const message = res.body.msg;
          expect(message).toBe("article not found!");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET - status 200 - responds with all articles", () => {
    test("all articles should be sorted in descending order by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("should return all articles with the correct properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(12);
          const articles = body.articles;
          articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
          });
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("GET - status 200 - responds with all comments for a specific article id", () => {
      test("should return an array of comments for a specific endpoint", () => {
        return request(app)
          .get("/api/articles/3/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(2);
            body.comments.forEach((comment) => {
              expect(typeof comment.article_id).toBe("number");
              expect(typeof comment.comment_id).toBe("number");
              expect(typeof comment.body).toBe("string");
              expect(typeof comment.author).toBe("string");
              expect(typeof comment.created_at).toBe("string");
              expect(typeof comment.votes).toBe("number");
            });
          });
      });
      test("comments should be sorted in an descending order by date", () => {
        return request(app)
          .get("/api/articles/3/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
    });
  });
  describe("GET - error status", () => {
    test("error status: 400 - invalid article id", () => {
      return request(app)
        .get("/api/articles/invalid_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request: invalid data type!");
        });
    });
    test("error status 404 - valid but non-existent article id", () => {
      return request(app)
        .get("/api/articles/5000")
        .expect(404)
        .then((res) => {
          const message = res.body.msg;
          expect(message).toBe("article not found!");
        });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  describe("POST - status 201 - responds with the newly created comment", () => {
    test("should insert an new object in the selected article with two properties: username and body", () => {
      const testNewComment = {
        username: "butter_bridge",
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(testNewComment)
        .expect(201)
        .then((result) => {
          const comment = result.body.posted;
          expect(comment.username).toBe("butter_bridge");
          expect(comment.body).toBe(
            " I carry a log — yes. Is it funny to you? It is not to me."
          );
        });
    });
  });
  describe("POST - error status", () => {
    test("error status: 400 - invalid endpoint", () => {
      const testNewComment = {
        username: "butter_bridge",
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
      };
      return request(app)
        .post("/api/articles/invalid_id/comments")
        .expect(400)
        .send(testNewComment)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request: invalid data type!");
        });
    });
    test("error status: 400 - invalid data passed in", () => {
      const testNewComment = {
        username: "butter_bridge",
        body: 123456,
      };
      return request(app)
        .post("/api/articles/3/comments")
        .expect(400)
        .send(testNewComment)
        .then(({ body }) => {
          expect(body.msg).toBe("ooops! bad request: invalid data!");
        });
    });
    test("error status: 400 - one of the values is missing", () => {
      const testNewComment = { username: "butter_bridge" };
      return request(app)
        .post("/api/articles/3/comments")
        .send(testNewComment)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("required values missing!");
        });
    });
    test("error status: 400 - all values are missing", () => {
      const testNewComment = {};
      return request(app)
        .post("/api/articles/3/comments")
        .send(testNewComment)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("required values missing!");
        });
    });
    test("error status: 404 - valid but non-existent article id", () => {
      const testNewComment = {
        username: "butter_bridge",
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
      };
      return request(app)
        .post("/api/articles/5999/comments")
        .send(testNewComment)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("article not found!");
        });
    });
    test("error status: 404 - username not found", () => {
      const testNewComment = {
        username: "not_a_username",
        body: "I carry a log — yes. Is it funny to you? It is not to me.",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(testNewComment)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("username not found!");
        });
    });
  });
});

describe("PATCH - /api/articles/:article_id", () => {
  describe("PATCH - status: 200 - update votes count", () => {
    test("should increment the total number of votes on the given endpoint by the number of votes given", () => {
      const testVotes = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/3")
        .send(testVotes)
        .then(({ body }) => {
          const article = body.result;
          expect(article.title).toBe("Eight pug gifs that remind me of mitch");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("icellusedkars");
          expect(article.body).toBe("some gifs");
          expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(article.votes).toBe(5);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("should decrement the total number of votes on the given endpoint by the number of votes given", () => {
      const testVotes = { inc_votes: -2 };
      return request(app)
        .patch("/api/articles/3")
        .send(testVotes)
        .then(({ body }) => {
          const article = body.result;
          expect(article.title).toBe("Eight pug gifs that remind me of mitch");
          expect(article.topic).toBe("mitch");
          expect(article.author).toBe("icellusedkars");
          expect(article.body).toBe("some gifs");
          expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(article.votes).toBe(-2);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
  });
  describe("PATCH - error status", () => {
    test("error status: 400 - invalid endpoint", () => {
      const testVotes = { inc_votes: -2 };
      return request(app)
        .patch("/api/articles/invalid_id")
        .expect(400)
        .send(testVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request: invalid data type!");
        });
    });
    test("error status: 400 - invalid data passed in", () => {
      const testVotes = { inc_votes: "invalid data" };

      return request(app)
        .patch("/api/articles/3")
        .expect(400)
        .send(testVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("ooops! bad request: invalid data!");
        });
    });
    test("error status: 400 - value not provided", () => {
      const testVotes = {};
      return request(app)
        .patch("/api/articles/3")
        .send(testVotes)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("required value missing!");
        });
    });
    test("error status: 404 - valid but non-existent article id", () => {
      const testVotes = { inc_votes: 2 };
      return request(app)
        .patch("/api/articles/5999")
        .send(testVotes)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("article not found!");
        });
    });
  });
});

describe("DELETE - /api/comments/:comment_id", () => {
  describe("DELETE - status 204 - comment deleted", () => {
    test("should delete the comment selected", () => {
      return request(app)
        .delete("/api/comments/3")
        .expect(204)
        .then((res) => {
          expect(res.body).toEqual({});
        });
    });
  });
  describe('DELETE - error status', () => {
    test('status 404 - comment id not found', () => {
      return request(app)
      .delete("/api/comments/100000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("comment not found!")
      })
    });
    test('status 400 - wrong data type inserted', () => {
      return request(app)
      .delete('/api/comments/pikachu')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('bad request: invalid data type!')
      })
    });
  });
});

describe.only('GET /api/users', () => {
  test('should return an array of objects with the following properties: username, name, avatar_url', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then((res) => {
      const {users} = res.body
      expect(users).toHaveLength(4)
      users.forEach((user) => {
        expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
      })
    })
  });
});
