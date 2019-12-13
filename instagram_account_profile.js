const puppeteer = require('puppeteer');

(async () => {
	// set some options (set headless to false so we can see 
	// this automated browsing experience)
	let launchOptions = { headless: false, args: ['--start-maximized'] };
	
	const browser = await puppeteer.launch(launchOptions);
	const page = await browser.newPage();

	// set viewport and user agent (just in case for nice viewing)
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

	// go to Instagram web profile (this example use Cristiano Ronaldo profile)
	await page.goto('https://instagram.com/cristiano');

	// check username exists or not exists
	let isUsernameNotFound = await page.evaluate(() => {
		// check selector exists
		if(document.getElementsByTagName('h2')[0]) {
			// check selector text content
			if(document.getElementsByTagName('h2')[0].textContent == "Sorry, this page isn't available.") {
				return true;
			}
		}
	});

	if(isUsernameNotFound) {
		console.log('Account not exists!');
		
		// close browser
		await browser.close();
		return;
	}

	// get username
	let username = await page.evaluate(() => {
		return document.querySelectorAll('header > section h1')[0].textContent;
	});

	// check the account is verified or not
	let isVerifiedAccount = await page.evaluate(() => {
		// check selector exists
		if(document.getElementsByClassName('coreSpriteVerifiedBadge')[0]) {
			return true;
		} else {
			return false;
		}
	});

	// get username picture URL
	let usernamePictureUrl = await page.evaluate(() => {
		return document.querySelectorAll('header img')[0].getAttribute('src');
	});

	// get number of total posts
	let postsCount = await page.evaluate(() => {
		return document.querySelectorAll('header > section > ul > li span')[0].textContent.replace(/\,/g, '');
	});

	// get number of total followers
	let followersCount = await page.evaluate(() => {
		return document.querySelectorAll('header > section > ul > li span')[1].getAttribute('title').replace(/\,/g, '');
	});

	// get number of total followings
	let followingsCount = await page.evaluate(() => {
		return document.querySelectorAll('header > section > ul > li span')[2].textContent.replace(/\,/g, '');
	});

	// get bio name
	let name = await page.evaluate(() => {
		// check selector exists
		if(document.querySelectorAll('header > section h1')[1]) {
			return document.querySelectorAll('header > section h1')[1].textContent;
		} else {
			return '';
		}
	});

	// get bio description
	let bio = await page.evaluate(() => {
		if(document.querySelectorAll('header h1')[1].parentNode.querySelectorAll('span')[0]) {
			return document.querySelectorAll('header h1')[1].parentNode.querySelectorAll('span')[0].textContent;
		} else {
			return '';
		}
	});

	// get bio URL
	let bioUrl = await page.evaluate(() => {
		// check selector exists
		if(document.querySelectorAll('header > section div > a')[1]) {
			return document.querySelectorAll('header > section div > a')[1].getAttribute('href');
		} else {
			return '';
		}
	});

	// get bio display
	let bioUrlDisplay = await page.evaluate(() => {
		// check selector exists
		if(document.querySelectorAll('header > section div > a')[1]) {
			return document.querySelectorAll('header > section div > a')[1].textContent;
		} else {
			return '';
		}
	});

	// check if account is private or not
	let isPrivateAccount = await page.evaluate(() => {
		// check selector exists
		if(document.getElementsByTagName('h2')[0]) {
			// check selector text content
			if(document.getElementsByTagName('h2')[0].textContent == 'This Account is Private') {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});

	// get recent posts (array of url and photo)
	let recentPosts = await page.evaluate(() => {
		let results = [];

		// loop on recent posts selector
		document.querySelectorAll('div[style*="flex-direction"] div > a').forEach((el) => {
			// init the post object (for recent posts)
			let post = {};

			// fill the post object with URL and photo data
			post.url = 'https://www.instagram.com' + el.getAttribute('href');
			post.photo = el.querySelector('img').getAttribute('src');
			
			// add the object to results array (by push operation)
			results.push(post);
		});

		// recentPosts will contains data from results
		return results;
	});

	// display the result to console
	console.log({'username': username,
                 'is_verified_account': isVerifiedAccount,
                 'username_picture_url': usernamePictureUrl,
                 'posts_count': postsCount,
                 'followers_count': followersCount,
                 'followings_count': followingsCount,
                 'name': name,
                 'bio': bio,
                 'bio_url': bioUrl,
                 'bio_url_display': bioUrlDisplay,
                 'is_private_account': isPrivateAccount,
             	 'recent_posts': recentPosts,});

	// close the browser
	await browser.close();
})();
