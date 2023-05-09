const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({topicData, userData, articleData, commentData});
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  test("GET - status 200 - responds with a status message", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ msg: "all good here!" });
      });
  });
});

describe("/api/topics", () => {
  describe("GET - status: 200 - responds with topics data", () => {
    test('should return an array of objects', () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true)
          });
    });
    test('should return an array with all the topics', () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics.length).toBe(3)
          })
    });
    test('all objects should have a slug and description properties', () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({body})=> {
            body.topics.forEach(topic => {
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            })
          })
    });
  });
});
