const puppeteer = require("puppeteer");
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const getBase64Image = (filePath) => {
    const image = fs.readFileSync(filePath);
    return `data:image/png;base64,${Buffer.from(image).toString('base64')}`;
};

const extractMetaData = (html, url) => {
    const $ = require('cheerio').load(html);
    const title = $('head > title').text();
    const description = $('meta[name="description"]').attr('content');
    const keywords = $('meta[name="keywords"]').attr('content');

    // Store metadata
    return {
        url: url,
        title: title || 'No title found',
        description: description || 'No description found',
        keywords: keywords || 'No keywords found'
    };
};

const searchUrl = async (data) => {
    const results = {};
    
    const browser = await puppeteer.launch({
        'args' : [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });
    for (const key in data) {
        const url = data[key];

        try {
            // Fetch HTML and extract metadata
            const response = await axios.get(url);
            const html = response.data;
            results[key] = extractMetaData(html, url);

            // Take a screenshot
            const page = await browser.newPage();
            await page.goto(url);
            const screenshotPath = path.join(__dirname, 'screenshots', `${key}.png`);
            await page.screenshot({ path: screenshotPath });

            // Convert screenshot to Base64
            results[key].screenshot = getBase64Image(screenshotPath);

            await page.close();
        } catch (err) {
            console.log(`Error processing ${url}:`, err);
            results[key] = { error: `Failed to retrieve metadata or screenshot from ${url}` };
        }
    }

    await browser.close();

    return results;
};

module.exports = { searchUrl, extractMetaData };
