$(document).ready(function() {
	updateBackground()
	refreshQuote();

	$('#btn-quote-refresh a').on('click', function(e) {
		e.preventDefault();
		refreshQuote();
		updateBackground();
	});

	infoTipTitle = "Designed and coded by <i>Tom Moore</i>";
	$('[data-toggle="tooltip"]').tooltip({
		title: infoTipTitle,
		html: true
	});

	$('[data-toggle="tooltip"]').on('click', function() {
		$(this).tooltip('hide');
	});

});

function updateBackground() {
	// dummy query to cache-bust the identical url
	var url = "https://unsplash.it/1024/683/?random&t=" + Date.now();
	$("html").css("background-image", "url('" + url + "')");
}

function refreshQuote() {
	refreshStart();
	var endpoint = "http://quotesondesign.com/wp-json/posts";
	var query = "?filter[orderby]=rand&filter[posts_per_page]=1&callback=";
	$.ajaxSetup({
		cache: false
	});
	$.getJSON(endpoint + query, function(data) {
		var quote = data.shift();
		refreshFinish(quote.content, quote.title, quote.link);
	});
}

function refreshStart() {
	$("#quote-refresh-icon").fadeIn("slow");
	$("#quote-content").fadeOut();
	$("#quote-content p").remove();
	$("#quote-title footer").empty();
}

function refreshFinish(content, title, link) {
	$("#quote-content").append(content);
	$("#quote-title footer").html(title);
	$("#quote-refresh-icon").hide();
	$("#quote-content").fadeIn("slow");
	updateTweetHref(title, link);
}

function updateTweetHref(title, link) {
	var content = $("#quote-content").text().trim();
	// standard tweet text
	var tweet = '"' + content + '" – ' + title;

	// tweet char limit (140), minus title length, minus count of chars added to standard tweet text (5, i.e. '" – "')
	var contentCharLimit = (140 - title.length) - 5;
	if (content.length > contentCharLimit) {
		// not enough tweet space for the content and the title
		// content will be truncated and a url to the complete quote included
		// a truncated tweet will have 4 additional characters ('"…" '), one more than a standard tweet
		var sliceLength = contentCharLimit - link.length + 1;
		contentArr = content.slice(0, sliceLength).split(/\s/);
		contentArr.pop();
		content = contentArr.join(" ");
		tweet = '"' + content + '…" ' + link;
	}

	var href = 'https://twitter.com/intent/tweet?text=' + tweet;
	$("#btn-quote-tweet a").attr("href", encodeURI(href));
}