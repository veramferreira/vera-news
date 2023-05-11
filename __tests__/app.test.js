const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
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
    test("should respond with an object (article) containing all 8 properties)", () => {
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
