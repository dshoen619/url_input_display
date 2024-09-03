const chromium = require('chrome-aws-lambda');

(async () => {
  console.log('Chromium executable path:', await chromium.executablePath);
})();
