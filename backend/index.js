const express = require('express');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const {searchUrl} = require('./functions');


const app = express();

// Enable CORS to allow the frontend to make requests to your backend
app.use(cors({
    origin: 'https://url-input-frontend-ff226f3bb8c0.herokuapp.com', // Frontend's URL
    credentials: true // Allow credentials to be sent
}));

app.use(express.json());
app.use(cookieParser());

// Enable trust proxy for Heroku
app.set('trust proxy', 1);

// Content Security Policy (CSP) middleware
app.use((req, res, next) => {
    const allowedUrls = [
        "'self'", 
        'https://url-input-backend-5b90ccdc2031.herokuapp.com',  // Correct Heroku backend URL
        "http://localhost:5001"  // Local development URL
    ];
    const connectSrc = allowedUrls.join(' ');

    res.setHeader("Content-Security-Policy", `default-src 'self'; connect-src ${connectSrc}`);
    next();
});

// Set up rate limiting to 5 requests per second
const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Set up Helmet with correct CSP settings
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: [
                    "'self'", 
                    'https://url-input-backend-5b90ccdc2031.herokuapp.com',  // Correct Heroku backend URL
                    "http://localhost:5001"  // Local development URL
                ],
            },
        },
    })
);

const port = process.env.PORT || 5005;

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.post('/urlInputs', async (req, res) => {
    console.log('Entered Url Inputs')
    console.log('data', req.body)
    const data = req.body;
    const results = await searchUrl(data);
    res.json(results); // Send the results as JSON response
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

