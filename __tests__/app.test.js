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

describe('GET /api/articles', () => {
    test('Responds with a status 200 containing all articles, sorted by date in descending order', () => {
        return request(app).get('/api/articles').expect(200)
            .then(({body}) => {

                expect(typeof body).toBe('object');
                const allArticlesBody = body.allArticles;

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

                let descendingOrder = true;
                for (let i = 1; i < allArticlesBody.length; i++){
                    if (allArticlesBody[i-1].created_at < allArticlesBody[i].created_at){
                        descendingOrder = false;
                        break;
                    }
                }
                expect(descendingOrder).toBe(true);
            })

    })
    // unsure of what errors to test for here specifically

})

describe('GET /api/articles/:article_id/comments', () => {
    test('Responds with a status 200 an array of comments for the given article_id of which each comment should be sorted in date order', () => {
        return request(app).get('/api/articles/9/comments').expect(200)
            .then(({body}) => {
                expect(Array.isArray(body)).toBe(true);
                body.forEach(comment => {
                    expect(comment).toHaveProperty('comment_id');
                    expect(comment).toHaveProperty('votes');
                    expect(comment).toHaveProperty('created_at');
                    expect(comment).toHaveProperty('author');
                    expect(comment).toHaveProperty('body');
                    expect(comment).toHaveProperty('article_id');
                })
                let descendingOrder = true;
                for (let i = 1; i < body.length; i++){
                    if (body[i-1].created_at < body[i].created_at){
                        descendingOrder = false;
                        break;
                    }
                }
                // Am I getting these dates correct?
                expect(descendingOrder).toBe(true);
            })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('Responds with a status 201 containing the posted comment', () => {
        const testPostComment = {username: 'butter_bridge' , body: "Asked him how his weekend was, on Thursday"};
        let postResult = 0
        return request(app).post('/api/articles/9/comments').send(testPostComment).expect(201)
            .then(({body}) => {
                postResult = body;
                expect(body.comment_id).toBe( 19);
                expect(body.body).toBe( 'Asked him how his weekend was, on Thursday');
                expect(body.article_id).toBe( 9);
                expect(body.author).toBe( 'butter_bridge');
                expect(body.votes).toBe( 0);
                expect(body.created_at).not.toBe(null);
            })
    })
    test('Responds with a status 400 Bad Request when given an object with malformed body / missing required fields', () => {
        const testPostComment = {};
        return request(app).post('/api/articles/9/comments').send(testPostComment).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            })
    })
    test('Responds with a status 400 Bad Request when given an object fails schema validation', () => {
        const testPostComment = {username: 'Jowlingg' , body: "Asked him how his Christmas was, in November"};
        return request(app).post('/api/articles/9/comments').send(testPostComment).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            })
    })
})

describe('Patch /api/articles/:article_id', () => {
    test('Responds with a status 200 containing the posted comment, with votes incremented by 5', () => {
        const testPatchArticle = { inc_votes: 5};

        return request(app).patch('/api/articles/9').send(testPatchArticle).expect(200)
            .then(({body}) => {
                expect(body.votes).toBe(5);
            })
    })
    test('Responds with a status 200 containing the posted comment, with votes decremented by 5', () => {
        const testPatchArticle = { inc_votes: -5};

        return request(app).patch('/api/articles/9').send(testPatchArticle).expect(200)
            .then(({body}) => {
                expect(body.votes).toBe(- 5);
            })
    })
    test('Responds with a status 400 Bad Request when given an object with malformed body / missing required fields', () => {
        const testPatchArticle = {};

        return request(app).patch('/api/articles/9').send(testPatchArticle).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            })
    })
    test('Responds with a status 400 Bad Request when given an object fails schema validation', () => {
        const testPatchArticle = {};

        return request(app).patch('/api/articles/9').send(testPatchArticle).expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            })
    })

})

describe('DELETE /api/comments/:comment_id', () => {
    test('Responds with a status 204 and no content', () => {
        return request(app).delete('/api/comments/9').expect(204)
            .then(() => {
                return request(app).get('/api/comments/9').expect(404);
            })
    })
    test('Responds with a status 404 when given a resource that does not exist', () => {
        return request(app).delete('/api/comments/9999').expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid input');
            })
    })
    test('Responds with a status 400 Bad Request when given an invalid ID', () => {
        return request(app).delete('/api/comments/notAnId').expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            })
    })

})

describe.only('GET /api/users', () => {
    test('Responds with a status 200 containing an array of objects, each containing the desire properties', () => {
        return request(app).get('/api/users').expect(200)
            .then(({body}) => {
                expect(Array.isArray(body)).toBe(true);
                body.forEach((user) => {
                    expect(typeof user).toBe('object');
                    expect(user).toHaveProperty('username');
                    expect(user).toHaveProperty('name');
                    expect(user).toHaveProperty('avatar_url');
                })
            })
    })
    test('Responds with a status 404 when requested route does not exist', () => {
        return request(app).get('/api/notARoute').expect(404)
            .then(({ body }) => {
                    expect(body.msg).toBe('Invalid input');
                })
            })
})

