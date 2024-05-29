const app = require('../app.js');
const request = require('supertest');
const seed = require ('../db/seeds/seed.js');
const db = require('../db/index');
const testData = require('../db/data/test-data');
const endpointsJson = require('../endpoints.json');




beforeEach(()=>{
    return seed(testData)
})
afterAll(() => db.end());

describe('Potential errors', () => {
    test('GET:404 sends an appropriate status when a request with a spelling error is made', () => {
        return request(app).get('/api/topicx').expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid input');
            });
    });
});

describe('GET /api/topics', () => {
    test('Returns status code 200 when GET request to /api/topics is made', () => {
        return request(app).get('/api/topics').expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.topics)).toBe(true);
                expect(body.topics.length).toBe(testData.topicData.length);
                body.topics.forEach(topic => {
                    expect(topic).toHaveProperty('slug');
                    expect(topic).toHaveProperty('description');
                })
            })
    })
})

describe('GET /api', () => {
    test('Responds with the endpoints.json content', () => {
        return request(app).get('/api').expect(200)
            .then(({body}) => {
                expect(typeof body).toBe('object');
                expect(body).toEqual(endpointsJson);
            })
    })

})

describe('GET /api/articles/:article_id', () => {
    test('Responds with a status 200 containing the correct article object, with the correct properties', () => {
        return request(app).get('/api/articles/6').expect(200)
            .then(({body}) => {

                expect(typeof body).toBe('object');
                const articleBody = body.article;
                //hard code all to be from the data

                expect(articleBody.title).toBe("A");
                expect(articleBody.topic).toBe("mitch");
                expect(articleBody.author).toBe("icellusedkars");
                expect(articleBody.body).toBe("Delicious tin of cat food");
                expect(articleBody.author).toBe("icellusedkars");
                expect(articleBody.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");

                expect(articleBody.article_id).toBe(6);
            })
    })
    test('Responds with a status 400 when passed an article which is not a number', () => {
        return request(app).get('/api/articles/simon').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    })
    test('Responds with a 404 status containing an appropriate response', () => {
        return request(app).get('/api/articles/999999999').expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No user found for user_id: 999999999');
            });
    })

})

describe.only('GET /api/articles', () => {
    test('Responds with a status 200 containing all articles, sorted by date in descending order', () => {
        return request(app).get('/api/articles').expect(200)
            .then(({body}) => {

                expect(typeof body).toBe('object');
                const allArticlesBody = body.allArticles;
                //hard code all to be from the data
                expect(allArticlesBody.length).toBe(13);
                allArticlesBody.forEach(article => {
                    expect(article).toHaveProperty('author');
                    expect(article).toHaveProperty('title');
                    expect(article).toHaveProperty('article_id');
                    expect(article).toHaveProperty('topic');
                    expect(article).toHaveProperty('created_at');
                    expect(article).toHaveProperty('votes');
                    expect(article).toHaveProperty('article_img_url');
                    expect(article).toHaveProperty('comment_count');
                    expect(article).not.toHaveProperty('body');
                })
            })
    })
    // unsure of what errors to test for here specifically

})

