const request = require('supertest');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const csurf = require('csurf');
const searchUrl = require('../functions'); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again later.',
}));
app.use(helmet());
// app.use(csurf({ cookie: true })); // Commented out for testing

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.post('/urlInputs', async (req, res) => {
  const data = req.body;
  const results = await searchUrl(data);
  res.json(results);
});

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: 'mocked-token' }); // Mocked response for testing
});

describe('GET /', () => {
  it('should return status 200 and a welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello from the backend!');
  });
});

describe('POST /urlInputs', () => {
  it('should return status 200 and results from searchUrl', async () => {
    const mockData = { url: 'http://example.com' };
    const mockResults = { data: 'mocked results' };

    // Mock searchUrl function
    jest.mock('../functions', () => ({
      searchUrl: jest.fn(() => Promise.resolve(mockResults))
    }));

    const response = await request(app)
      .post('/urlInputs')
      .send(mockData);
      
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResults);
  });
});

describe('GET /csrf-token', () => {
  it('should return a mocked CSRF token', async () => {
    const response = await request(app).get('/csrf-token');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('csrfToken', 'mocked-token');
  });
});
