chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// request notification permission on page load
		document.addEventListener('DOMContentLoaded', function () {
		    if (Notification.permission !== "granted")
		        Notification.requestPermission();
		});

		processLinks();

		window.addEventListener('neverEndingLoad', function (e) {
			processLinks();
		});

	}
	}, 10);
});
