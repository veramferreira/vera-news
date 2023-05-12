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
            console.log(body.comments);
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













describe("PATCH - /api/articles/:article_id", () => {
  describe("PATCH - status: 200 - update votes count", () => {
    test("should increment the total number of votes on the given endpoint", () => {
      const testVotes = { inc_votes: 2 };
      const testArticle = {
        title: "title",
        topic: "topic",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2023-05-12T20:11:00.000Z",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        votes: 105,
      };
      return request(app).patch('/api/articles/3').send(testArticle).then(({body}) => {
        
      })
    });
  });
});
