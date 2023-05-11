const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
// const sort = require('jest-sorted')
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
        expect(res.body).toEqual({ endpoints: endpoints});
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

// describe('/api/articles', () => {
//   describe('GET - status 200 - responds with all articles', () => {
//     test('should return an array with several articles', () => {
//       return request(app)
//       .get('/api/articles')
//       .expect(200)
//       .then(({body}) => {
//         expect(body.result.length).toBeGreaterThan(0)
//         const articles = body.result
//         articles.forEach((article) => {
//             expect(typeof article.article_id).toBe("number");
//             expect(typeof article.title).toBe("string");
//             expect(typeof article.topic).toBe("string");
//             expect(typeof article.author).toBe("string");
//             expect(typeof article.created_at).toBe("string");
//             expect(typeof article.votes).toBe("number");
//             expect(typeof article.article_img_url).toBe("string");
//             expect(typeof article.comment_count).toBe("string");
//         })
//       })
//     });
//   });
// });
