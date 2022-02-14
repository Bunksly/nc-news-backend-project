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
        })
    })
})