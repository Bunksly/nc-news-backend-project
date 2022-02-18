const app = require('../app')
const db = require('../../db/connection')
const request = require('supertest')
const data = require('../../db/data/index')
const seed = require('../../db/seeds/seed')

afterAll(() => db.end());

beforeEach(() => seed(data));

describe('app.js', () => {
    describe('path not found', () => {
        test('when passed path that doesnt exist returns 404 path not found', () => {
            return request(app)
            .get('/api/invalid')
            .expect(404)
            .then(({ text }) => {
                expect(text).toBe('Path not found')
            })
        })
    })
    describe('GET', () => {
        describe('/api', () => {
            test('status 200: returns json object with pathways', () => {
                return request(app)
                .get('/api')
                .expect(200)
                .then(({ body : { pathways }}) => {
                    expect(pathways).toEqual(
                        expect.objectContaining({
                            "GET /api": expect.any(Object),
                            "GET /api/articles": expect.any(Object),
                            "GET /api/topics": expect.any(Object),
                        })
                    )
                })
            })
        })
        describe('/api/topics', () => {
            test('status 200: returns array of objects containing slug and description', () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body : { topics }}) => {
                    expect(topics).toHaveLength(3)
                    topics.forEach(topic => {
                        expect(topic).toEqual(
                            expect.objectContaining({
                                description: expect.any(String),
                                slug: expect.any(String)
                            })
                        )
                    })
                })
            })
        })
        describe('/api/users', () => {
            test('status 200: returns array of objects containing usernames', () => {
                return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body : { users }}) => {
                    expect(users).toHaveLength(4)
                    users.forEach(user => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String)
                            })
                        )
                    })
                })
            })
        })
        describe('/api/users/:username', () => {
            test('status 200: returns user object', () => {
                const expectedUser = {
                    username: 'rogersop',
                    name: 'paul',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                  }
                return request(app)
                .get('/api/users/rogersop')
                .expect(200)
                .then(({ body : { user }}) => {
                    expect(user).toEqual(expectedUser)
                })
            })
            test('status 404: returns user not found', () => {
                return request(app)
                .get('/api/users/invalid')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('User invalid not found')
                })
            })
        })
        describe('/api/articles', () => {
            test('status 200: returns array of article objects', () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body : { articles }}) => {
                    expect(articles).toHaveLength(12)
                    articles.forEach(article => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                article_id: expect.any(Number),
                                author: expect.any(String),
                                title: expect.any(String),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            })
                        )
                    })
                })
            })
            test('status 200: returns array of article objects sroted by created_at descending', () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body : { articles }}) => {
                    expect(articles).toBeSortedBy('created_at', {
                        descending: true
                    })
                })
            })
            describe('/api/articles queries', () => {
                describe('sort_by', () => {
                    test('/api/articles?sort_by=title', () => {
                        return request(app)
                        .get('/api/articles?sort_by=title')
                        .expect(200)
                        .then(({ body : { articles }}) => {
                            expect(articles).toBeSortedBy('title', {
                                descending: true
                            })
                        })
                    })
                    test('/api/articles?sort_by=author', () => {
                        return request(app)
                        .get('/api/articles?sort_by=author')
                        .expect(200)
                        .then(({ body : { articles }}) => {
                            expect(articles).toBeSortedBy('author', {
                                descending: true
                            })
                        })
                    })
                    test('/api/articles?sort_by=comment_count', () => {
                        return request(app)
                        .get('/api/articles?sort_by=comment_count')
                        .expect(200)
                        .then(({ body : { articles }}) => {
                            expect(articles).toBeSortedBy('comment_count', {
                                descending: true
                            })
                        })
                    })
                    test('/api/articles?sort_by=invalid returns 400 bad sort request', () => {
                        return request(app)
                        .get('/api/articles?sort_by=invalid')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Bad Sort Request')
                        })
                    })
                })
                describe('order', () => {
                    test('/api/articles?order=asc returns articles ordered by date ascending', () => {
                        return request(app)
                        .get('/api/articles?order=asc')
                        .expect(200)
                        .then(({ body : { articles }}) => {
                            expect(articles).toBeSortedBy('created_at')
                        })
                    })
                    test('/api/articles?sort_by=author&order=asc returns articles ordered by author ascending', () => {
                        return request(app)
                        .get('/api/articles?sort_by=author&order=asc')
                        .expect(200)
                        .then(({ body : { articles }}) => {
                            expect(articles).toBeSortedBy('author')
                        })
                    })
                    test('/api/articles?order=invalid returns 400 bad order request', () => {
                        return request(app)
                        .get('/api/articles?order=invalid')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Bad Order Request')
                        })
                    })
                    test('/api/articles?sort_by=title&order=invalid returns 400 bad order request', () => {
                        return request(app)
                        .get('/api/articles?sort_by=title&order=invalid')
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Bad Order Request')
                        })
                    })
                })
                describe('topic', () => {
                    test('/api/articles?topic=mitch returns articles with topic mitch', () => {
                        return request(app)
                        .get('/api/articles?topic=mitch')
                        .expect(200)
                        .then(({ body : { articles }}) => {
                            expect(articles).toHaveLength(11)
                            expect(articles).toBeSortedBy('created_at', {
                                descending: true
                            })
                            articles.forEach(article => {
                                expect(article).toEqual(
                                    expect.objectContaining({
                                        article_id: expect.any(Number),
                                        author: expect.any(String),
                                        title: expect.any(String),
                                        topic: expect.any(String),
                                        created_at: expect.any(String),
                                        votes: expect.any(Number)
                                    })
                                )
                                expect(article.topic).toBe('mitch')
                            })
                        })
                    })
                    test('/api/articles?topic=cats returns articles with topic cats', () => {
                        return request(app)
                        .get('/api/articles?topic=cats')
                        .expect(200)
                        .then(({ body : { articles }}) => {
                            expect(articles).toHaveLength(1)
                            articles.forEach(article => {
                                expect(article).toEqual(
                                    expect.objectContaining({
                                        article_id: expect.any(Number),
                                        author: expect.any(String),
                                        title: expect.any(String),
                                        topic: expect.any(String),
                                        created_at: expect.any(String),
                                        votes: expect.any(Number)
                                    })
                                )
                                expect(article.topic).toBe('cats')
                            })
                        })
                    })
                    test('/api/articles?topic=mitch&sort_by=votes&order=asc', () => {
                        return request(app)
                        .get('/api/articles?topic=mitch&sort_by=votes&order=asc')
                        .expect(200)
                        .then(({ body : { articles }}) => {
                            expect(articles).toHaveLength(11)
                            expect(articles).toBeSortedBy('votes', {
                                descending: false
                            })
                            articles.forEach(article => {
                                expect(article).toEqual(
                                    expect.objectContaining({
                                        article_id: expect.any(Number),
                                        author: expect.any(String),
                                        title: expect.any(String),
                                        topic: expect.any(String),
                                        created_at: expect.any(String),
                                        votes: expect.any(Number)
                                    })
                                )
                                expect(article.topic).toBe('mitch')
                            })
                        })
                    })
                    test('api/articles?topic=invalid returns 404 topic not found', () => {
                        return request(app)
                        .get('/api/articles?topic=invalid')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Topic invalid not found')
                        })
                    })
                })
            })
        })
        describe('/api/articles/:article_id', () => {
            test('stats 200: returns article object with amtching article_id', () => {
                const expectOutput = {
                    article_id: 5,
                    title: "UNCOVERED: catspiracy to bring down democracy",
                    topic: "cats",
                    body: "Bastet walks amongst us, and the cats are taking arms!",
                    author: "rogersop",
                    created_at: expect.any(String),
                    votes: 0,
                    comment_count: 2
                  }
                return request(app)
                .get('/api/articles/5')
                .expect(200)
                .then(({ body : { article }}) => {
                    expect(article).toEqual(expectOutput)
                })
            })
            test('stats 404: returns 404 article not found when article_id not found', () => {
                return request(app)
                .get('/api/articles/9999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article 9999 not found')
                })
            })
        })
        describe('/api/articles/:article_id/comments', () => {
            test('status 200: returns comments for given article', () => {
                return request(app)
                .get('/api/articles/5/comments')
                .expect(200)
                .then(({ body : { comments }}) => {
                    expect(comments).toHaveLength(2)
                    comments.forEach(comment => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String)
                            })
                        )
                    })
                })
            })
            test('status 404: if there are no comments return 404', () => {
                return request(app)
                .get('/api/articles/2/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('No comments found')
                })
            })
            test('status 404: if there is no article return 404', () => {
                return request(app)
                .get('/api/articles/999/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article 999 not found')
                })
            })
        })
    })
    describe('PATCH', () => {
        describe('/api/articles/:article_id', () => {
            test('status 200: returns updated article', () => {
                const inc_votes = { inc_votes : 1 }
                const expectOutput = {
                    article_id: 5,
                    title: "UNCOVERED: catspiracy to bring down democracy",
                    topic: "cats",
                    author: "rogersop",
                    created_at: expect.any(String),
                    votes: 1,
                  }
                return request(app)
                .patch('/api/articles/5')
                .send(inc_votes)
                .expect(200)
                .then(({ body : { article }}) => {
                    expect(article).toEqual(expectOutput)
                })
            })
            test('status 200: works with negative numbers', () => {
                const inc_votes = { inc_votes : -3 }
                const expectOutput = {
                    article_id: 5,
                    title: "UNCOVERED: catspiracy to bring down democracy",
                    topic: "cats",
                    author: "rogersop",
                    created_at: expect.any(String),
                    votes: -3,
                  }
                return request(app)
                .patch('/api/articles/5')
                .send(inc_votes)
                .expect(200)
                .then(({ body : { article }}) => {
                    expect(article).toEqual(expectOutput)
                })
            })
            test('status 400: returns input object invalid', () => {
                const inc_votes = { invalid : 1 }
                return request(app)
                .patch('/api/articles/5')
                .send(inc_votes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toEqual('Input object invalid')
                })
            })
            test('status 400: returns inc_votes should be number', () => {
                const inc_votes = { inc_votes : 'cat' }
                return request(app)
                .patch('/api/articles/5')
                .send(inc_votes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('inc_votes value should be number')
                })
            })
            test('status 404: returns article not found when article_id not found', () => {
                const inc_votes = { inc_votes : 1 }
                return request(app)
                .patch('/api/articles/999')
                .send(inc_votes)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article 999 not found')
                })
            })
        })
        describe('/api/comments/:comment_id', () => {
            test('status 200: returns updated comment', () => {
                const inc_votes = { inc_votes : 1 }
                const expectOutput = {
                    body: "This morning, I showered for nine minutes.",
                    votes: 17,
                    author: "butter_bridge",
                    article_id: 1,
                    created_at: 1595294400000,
                    comment_id: 18,
                    created_at: expect.any(String)
                  }
                return request(app)
                .patch('/api/comments/18')
                .send(inc_votes)
                .expect(200)
                .then(({ body : { comment }}) => {
                    expect(comment).toEqual(expectOutput)
                })
            })
            test('status 200: works with negative numbers', () => {
                const inc_votes = { inc_votes : -3 }
                const expectOutput = {
                    body: "This morning, I showered for nine minutes.",
                    votes: 13,
                    author: "butter_bridge",
                    article_id: 1,
                    created_at: 1595294400000,
                    comment_id: 18,
                    created_at: expect.any(String)
                  }
                return request(app)
                .patch('/api/comments/18')
                .send(inc_votes)
                .expect(200)
                .then(({ body : { comment }}) => {
                    expect(comment).toEqual(expectOutput)
                })
            })
            test('status 400: returns input object invalid', () => {
                const inc_votes = { invalid : 1 }
                return request(app)
                .patch('/api/comments/5')
                .send(inc_votes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toEqual('Input object invalid')
                })
            })
            test('status 400: returns inc_votes should be number', () => {
                const inc_votes = { inc_votes : 'cat' }
                return request(app)
                .patch('/api/comments/5')
                .send(inc_votes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('inc_votes value should be number')
                })
            })
            test('status 404: returns article not found when article_id not found', () => {
                const inc_votes = { inc_votes : 1 }
                return request(app)
                .patch('/api/comments/999')
                .send(inc_votes)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Comment 999 not found')
                })
            })
        }) 
    })
    describe('POST', () => {
        describe('/api/articles/:article_id/comments', () => {
            test('status 201: returns comment', () => {
                const input = {
                    username: 'rogersop',
                    body: 'additional coffees required'
                }
                return request(app)
                .post('/api/articles/5/comments')
                .send(input)
                .expect(201)
                .then(({ body : { comment }}) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            author: expect.any(String),
                            body: expect.any(String),
                            votes: expect.any(Number),
                            comment_id: expect.any(Number),
                            article_id: expect.any(Number),
                            created_at: expect.any(String)
                        })
                    )
                    expect(comment.author).toBe('rogersop')
                    expect(comment.body).toBe('additional coffees required')
                })
            })
            test('status 404: when article_id is invalid returns article not found', () => {
                const input = {
                    username: 'rogersop',
                    body: 'additional coffees required'
                }
                return request(app)
                .post('/api/articles/999/comments')
                .send(input)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article 999 not found')
                })
            })
            test('status 404: when user doesnt exists returns user not found', () => {
                const input = {
                    username: 'invalid',
                    body: 'additional coffees required'
                }
                return request(app)
                .post('/api/articles/5/comments')
                .send(input)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('User invalid not found')
                })
            })
            test('status 400: when input does not contain username or body returns invalid intput', () => {
                const input = {
                    redHerring: 'deception'
                }
                return request(app)
                .post('/api/articles/5/comments')
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Input invalid, requires username and body')
                })
            })
        })
        describe('/api/topics', () => {
            test('status 201: returns posted topic', () => {
                const input = {
                    slug: "topic",
                    description: "topic description"
                }
                return request(app)
                .post('/api/topics')
                .send(input)
                .expect(201)
                .then(({ body : { topic }}) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: "topic",
                            description: "topic description"
                        })
                    )
                })
            })
            test('status 400: when request does not contain slug or description returns error', () => {
                const input = {
                    topic: "topic",
                    body: "topic description"
                }
                return request(app)
                .post('/api/topics')
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Input invalid requires slug and description')
                })
            })
        })
        describe('/api/articles', () => {
            test('status 201: returns article', () => {
                const input = {
                    author: "rogersop",
                    title: "test-title",
                    body: "dont rest on your lorems",
                    topic: "paper"
                }
                return request(app)
                .post('/api/articles')
                .send(input)
                .expect(201)
                .then(({ body : { article }}) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            author: "rogersop",
                            title: "test-title",
                            body: "dont rest on your lorems",
                            topic: "paper",
                            article_id: 13,
                            votes: 0,
                            created_at: expect.any(String),
                            comment_count: 0
                        })
                    )
                })
            })
            test('status 404: when request author doesnt exist returns user not found', () => {
                const input = {
                    author: "invalid",
                    title: "test-title",
                    body: "dont rest on your lorems",
                    topic: "paper"
                }
                return request(app)
                .post('/api/articles')
                .send(input)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('User invalid not found')
                })
            })
            test('status 404: when request topic doesnt exist returns topic not found', () => {
                const input = {
                    author: "rogersop",
                    title: "test-title",
                    body: "dont rest on your lorems",
                    topic: "invalid"
                }
                return request(app)
                .post('/api/articles')
                .send(input)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Topic invalid not found')
                })
            })
            test('status 400: when request doesnt have author, title, topic and body returns err', () => {
                const input = {
                    username: "rogersop",
                    heading: "test-title",
                    text: "dont rest on your lorems",
                    context: "invalid"
                }
                return request(app)
                .post('/api/articles')
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Input invalid, requires author, body, title and topic')
                })
            })
        })       
    })
    describe('DELETE', () => {
        describe('/api/comments/:comment_id', () => {
            test('status 204: returns no content', () => {
                return request(app)
                .delete('/api/comments/4')
                .expect(204)
            })
            test('status 404: comment doesnt exist anyway', () => {
                return request(app)
                .delete('/api/comments/9999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Comment 9999 not found')
                })
            })
        })
        describe('/api/articles/:article_id', () => {
            test('status 204: returns no content', () => {
                return request(app)
                .delete('/api/articles/4')
                .expect(204)
            })
            test('status 404: comment doesnt exist anyway', () => {
                return request(app)
                .delete('/api/articles/9999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article 9999 not found')
                })
            })
        })
    })
})