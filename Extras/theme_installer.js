function elementReady(selector) {
	return new Promise((resolve, reject) => {
		let el = document.querySelector(selector);
		if (el) {
			resolve(el);
		}
		new MutationObserver((mutationRecords, observer) => {
				// Query for elements matching the specified selector
				Array.from(document.querySelectorAll(selector)).forEach((element) => {
					resolve(element);
					//Once we have resolved we don't need the observer anymore.
					observer.disconnect();
				});
			})
			.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
	});
}

var retries = 0;

function themeInstaller(tabName, themeUrl) {
	var frameName = "#frame-" + tabName;
	var styleSheet = '<link rel="stylesheet" href="' + themeUrl + '" type="text/css" />';
	console.log('Searching for ' + frameName + ' to apply stylesheet ' + themeUrl);
	elementReady(frameName).then(
		(loadJS) => {
			if ($(frameName).contents().find("head>title").length && $(frameName).contents().find("html>body").length) {
				console.log(frameName + ' detected. Applying theme.');
				var stylesheet = document.createElement("link");
				stylesheet.rel = "stylesheet";
				stylesheet.href = themeUrl;
				$(frameName).contents().find("body").append(stylesheet);
			} else if (retries < 2000) {
				setTimeout(function() {
					retries++;
					themeInstaller(tabName, themeUrl);
				}, 1);
			}
		});
};