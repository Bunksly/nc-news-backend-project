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
                                votes: expect.any(Number)
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
                    author: "rogersop",
                    created_at: expect.any(String),
                    votes: 0,
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
    })
})