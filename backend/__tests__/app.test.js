const {extractMetaData} = require('../functions');
const request = require('supertest')
const express = require('express')
const rateLimit = require('express-rate-limit')

const testHtml1 = '<html><head><title>Title</title></head></html>'
const testHtml2 = '<html><head><meta name="description" content="meta content"></meta><title>Title</title></head></html>'
const testHtml3 = '<html><head><meta name="description" content="meta content"></meta><meta name="keywords" content="meta keywords"></meta><title>Title</title></head></html>'
describe('extractMetaData', () => {
    it('It properly handles no metadata', () =>{
        const url = 'dummy_url'
        const actualOutput = extractMetaData('',url)
        const expectedOutput = {url:url, title:'No title found', description:'No description found', keywords:'No keywords found'}
        expect(actualOutput).toEqual(expectedOutput)    
    })
    it('It can extract title', () =>{
        const url = 'dummy_url'
        const actualOutput = extractMetaData(testHtml1,url)
        const expectedOutput = {url:url, title:'Title', description:'No description found', keywords:'No keywords found'}
        expect(actualOutput).toEqual(expectedOutput)    
    })
    it('It can extract title and description', () =>{
        const url = 'dummy_url'
        const actualOutput = extractMetaData(testHtml2,url)
        const expectedOutput = {url:url, title:'Title', description:'meta content', keywords:'No keywords found'}
        expect(actualOutput).toEqual(expectedOutput)    
    })
    it('It can extract title, description, and keywords', () =>{
        const url = 'dummy_url'
        const actualOutput = extractMetaData(testHtml3,url)
        const expectedOutput = {url:url, title:'Title', description:'meta content', keywords:'meta keywords'}
        expect(actualOutput).toEqual(expectedOutput)    
    })

})

describe('Rate Limiting', () => {
    let app;
    let server;

    beforeAll((done) => {
        // Create a new Express instance
        app = express();

        // Apply rate limiter to app
        const limiter = rateLimit({
            windowMs: 1000, // 1 second
            max: 5, // Limit each IP to 5 requests per windowMs
            message: 'Too many requests from this IP, please try again later.',
        });
        app.use(limiter);

        // Set up a basic route for testing
        app.get('/', (req, res) => {
            res.status(200).send('Hello from the test server!');
        });

        // Start the server on a specific port
        server = app.listen(5005, () => {
            done();
        });
    });

    afterAll((done) => {
        // Close the server after tests are done
        server.close(done);
    });

    it('should allow 5 requests and block the 6th within a second', async () => {
        const agent = request.agent(app);

        // Send 5 requests, which should all pass
        for (let i = 0; i < 5; i++) {
            const res = await agent.get('/');
            expect(res.statusCode).toBe(200);
        }

        // Send the 6th request, which should be rate-limited
        const res = await agent.get('/');
        expect(res.statusCode).toBe(429);
        expect(res.text).toBe('Too many requests from this IP, please try again later.');
    });
});