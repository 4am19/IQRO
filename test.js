import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
        page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

        console.log('Navigating to http://192.168.1.107:8000/ ...');
        await page.goto('http://192.168.1.107:8000/', { waitUntil: 'networkidle0', timeout: 30000 });
        
        const content = await page.content();
        console.log('HTML Length:', content.length);
        console.log('App Content:', await page.$eval('#app', el => el.innerHTML).catch(() => 'no #app'));

        await browser.close();
    } catch (e) {
        console.error('SCRIPT ERROR:', e);
    }
})();
