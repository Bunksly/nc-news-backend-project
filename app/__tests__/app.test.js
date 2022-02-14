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
    })
})