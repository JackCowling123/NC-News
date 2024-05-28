const app = require('../app.js');
const request = require('supertest');
const seed = require ('../db/seeds/seed.js');
const db = require('../db/index');
const testData = require('../db/data/test-data');



beforeEach(()=>{
    return seed(testData)
})
afterAll(() => db.end());

describe('Potential errors', () => {
    test('GET:404 sends an appropriate status when a request with a spelling error is made', () => {
        return request(app).get('/api/topicx').expect(404)
    })

})

describe('GET /api/topics', () => {
    test('Returns status code 200 when GET request to /api/topics is made', () => {
        return request(app).get('/api/topics').expect(200)
    })
    test('Returns an array of topic objects when GET request to /api/topics is made', () => {
        return request(app).get('/api/topics').expect(200)
            .then(({body}) => {
                expect(Array.isArray(body)).toBe(true);
                body.forEach(topic => {
                    expect(topic)
                })
            })
    })
    test('Each topic object has a "slug" and "description" property', () => {
        return request(app).get('/api/topics').expect(200)
            .then(({body}) => {
                body.forEach(topic => {
                    expect(topic).toHaveProperty('slug');
                    expect(topic).toHaveProperty('description');
                })
            })
    })
})

describe('GET /api', () => {
    test('Returns status code 200 when GET request to /api/topics is made', () => {
        return request(app).get('/api/topics').expect(200)
    })
    test('Returns an array of topic objects when GET request to /api/topics is made', () => {
        return request(app).get('/api/topics').expect(200)
            .then(({body}) => {
                expect(Array.isArray(body)).toBe(true);
                body.forEach(topic => {
                    expect(topic)
                })
            })
    })
    test('Each topic object has a "slug" and "description" property', () => {
        return request(app).get('/api/topics').expect(200)
            .then(({body}) => {
                body.forEach(topic => {
                    expect(topic).toHaveProperty('slug');
                    expect(topic).toHaveProperty('description');
                })
            })
    })
})