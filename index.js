//getting Easy Writing phrases from a NAVER blog
const fs = require('fs');
const puppeteer = require('puppeteer');
const axios = require('axios');
const stringify = require('csv-stringify/lib/sync');

fs.readdir('events', (err) => {
	if (err) {
		console.log('events 폴더가 없어 생성합니다')
		fs.mkdirSync('events');
	}
});

const reservation = async () => {
	try{
		const browser = await puppeteer.launch({ 
			headless: false,
		});	//브라우저 띄우기
		const page = await browser.newPage();	//페이지 띄우기
		await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
		await page.goto('https://reservation.42network.org/', {
			waitUntil: 'networkidle0'
		});	//페이지 접속

		await page.waitForSelector('.button');
		await page.click('.button');

		await page.waitForSelector('.is-grouped');

		const page_reservation = await browser.newPage();	//페이지 띄우기
		await page_reservation.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36');
		await page_reservation.goto('https://reservation.42network.org/api/me/events', {
			waitUntil: 'networkidle0'
		});	//페이지 접속

		const text = await page_reservation.$eval(`pre`, element => element.innerText);
		console.log(text)
		fs.writeFileSync('events/reservation.md', text);
		await page.close();		//페이지 닫기
		await browser.close();	//브라우저 닫기
	} catch (e) {
		console.error(e);
	}
}

reservation();