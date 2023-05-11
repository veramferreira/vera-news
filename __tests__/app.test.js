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
          body.result.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
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
    test('should return the article that matches the given endpoint', () => {
      return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({body}) => {
        const testArticle = [ {
          article_id: 2,
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
          created_at: '2020-10-16T05:03:00.000Z',
          votes: 0,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }]
        expect(body.result[0].article_id).toBe(2)
        expect(body.result).toEqual(testArticle)
      })
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
          const message = res.body.msg
          expect(message).toBe("article not found!");
        });
    });
  });
});
