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
    })

})

describe('GET /api/topics', () => {
    test('Returns status code 200 when GET request to /api/topics is made', () => {
        return request(app).get('/api/topics').expect(200)
            .then(({body}) => {
                console.log(body);
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