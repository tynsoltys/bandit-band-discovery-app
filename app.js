// Creating our app object

var app = {};

app.youTubeKey = "AIzaSyDF_0fRvTDYMxb7h1_4F3Lk62AmdSe52bM";
app.lastFmKey = "fd2c816ff3411310a756ee92f331dd95";


// // // // // 
// THE BAND //
// // // // //

// getBand captures the searchQuery from the user and submits it as an argument to getAlbum and getTracks

app.getBand = function() {
	$('.search').on('submit', function(e){
		e.preventDefault();
		$('ul.tracks').empty();
		// $('.albumContainer').empty();
		var artistQuery = $(this).find('input[type=search]').val();
		// console.log(artistQuery);
		app.getAlbum(artistQuery);
		app.getTracks(artistQuery);
		app.getBandInfo(artistQuery);
		return $(this).find('input[type=search]').val('');
	});

}

app.getBandInfo = function(bandName) {
	$.ajax({
		url: "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo",
		type: "GET",
		dataType: "jsonp",
		data: {
			api_key: app.lastFmKey,
			artist: bandName,
			limit: 1,
			format: 'json',
			autocorrect: 0
		},
		success: function(info) {
			if (info.hasOwnProperty("error")) {
				$(".infoFlex").append($('<p>').text('Sorry dude, try adding "the" or checking your spelling.'));
				console.log("FWHY ISNT THIS WORKING");
				$('.infoFlex').empty();
				$('.lowerFlex').empty();
			} else {
			app.displayBandInfo(info);
			}
		}

	});
}

// // // // // 
// SIMILAR  //
// // // // //

$('.similarArray li').on("click", function(e) {
	console.log("cool");
	var similarArtist = $('similarArray li').val('');
	console.log(similarArtist);
	app.getBand(similarArtist);
});

// // // // // 
// / ALBUMS //
// // // // //

// getAlbum retrieves the top album of the band, and passes it to youTube
app.getAlbum = function(searchResult) {
	// console.log("getAlbum firing");
	$.ajax({
		url: "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums",
		type: "GET",
		dataType: "jsonp",
		data: {
			api_key: app.lastFmKey,
			artist: searchResult,
			limit: 1,
			format: 'json',
			autocorrect: 1 
		},
		success: function(album) {
			
			var albumInfo = album.topalbums.album;
				// console.log(albumInfo);
			var albumArtist = album.topalbums.album.artist.name;
				// console.log(albumArtist);
			var albumName = album.topalbums.album.name;
				// console.log(albumName);
			var albumSearch = albumArtist + " " + albumName + " full album";
				// console.log("Album query string: " + albumSearch);
			// console.log(albumArtist);
			app.getAlbumVideo(albumSearch);
			// app.displayAlbum(albumInfo);

		}
	});
};

//this function searches YouTube for the album video
app.getAlbumVideo = function(query) {
	$.ajax({
	        url: 'https://www.googleapis.com/youtube/v3/search',
	        type: 'GET',
	        dataType: 'json',
	        data: {
	            v : 3,
	            q: query,
	            part: 'snippet',
	            type: 'video',
	            maxResults: 1,
	            key: app.youTubeKey
	        },
	       	success: function(res) {
	       		var albumVideoId = res.items[0].id.videoId;
	       		// console.log(res);
	       		//if is a video, return the video id
	       		//display in the iframe and upload to modal
	       			// console.log("this is a video!");
	       			// console.log("Album Video Id: " + albumVideoId);
	       			app.displayAlbum(albumVideoId);
	       	}
	}); 
}

// // // // // 
// / TRACKS //
// // // // //

// getTracks retrieves the top 5 tracks of the band
app.getTracks = function(searchResult) {
	// console.log("getTracks firing");
	$.ajax({
		url: "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks",
		type: "GET",
		dataType: "jsonp",
		data: {
			api_key: "fd2c816ff3411310a756ee92f331dd95",
			artist: searchResult,
			limit: 4,
			format: 'json',
			autocorrect: 0
		},
		success: function(tracks) {
			//We only want to see the array of stuff we actually want
			// $.each(coolArt, function(i, piece) {

				//YOU ARE HERE
			$.each(tracks.toptracks.track, function(i, thing) {
			var trackInfo = thing;
			// console.log(trackInfo);
			var trackArtist = thing.name;
			var trackName = thing.artist.name;
			var trackResult = trackArtist + " " + trackName;
			// console.log(trackResult);
			app.getTrackVideos(trackResult);
			// app.displayTrackInfo(thing);
			});
		}
	});
};

app.getTrackVideos = function(query) {
	$.ajax({
	        url: 'https://www.googleapis.com/youtube/v3/search',
	        type: 'GET',
	        dataType: 'jsonp',
	        data: {
	            v : 3,
	            q: query,
	            part: 'snippet',
	            type: 'video',
	            maxResults: 1,
	            license: 'cc',
	            format: 5,
	            key: app.youTubeKey
	        },
	       	success: function(res) {
	       		var trackVideoId = res.items[0].id.videoId;
	       		// console.log(trackVideoId);
	       		app.displayTrack(trackVideoId);
	       }
	}); 
}

// // // // // // // //
// DISPLAY FUNCTIONS //
// // // // // // // //


app.displayAlbum = function(albumVideoId) {
	// This part is displaying the top Album video
	$('.albumContainer').empty();
	$('.albumContainer').append('<iframe width="90%" height="360px" src="https://www.youtube.com/embed/' + albumVideoId + '" frameborder="0" allowfullscreen></iframe>');
	console.log("CHECKING IF WE GET SOME VALID SHIT: " + albumVideoId)


	//This part is calling up the album information

};

app.displayTrack = function(trackVideoId) {
	// var bandName = app.getBand();
	$('ul.tracks').append('<li><iframe width="90%" height="170px" src="https://www.youtube.com/embed/' + trackVideoId + '" frameborder="0" allowfullscreen></iframe></li>');
};

// app.displayTrackInfo = function() {

// };

app.displayBandInfo = function(info) {

	$('.bandInfo').empty();
	$('.bandTitle').empty();
	$('.bandImage').empty();
	$('ul.similarArray').empty();
	$('ul.genreArray').empty();
	// $('h3.discoverMore').removeClass("visible");

	$('h3.videoTitle').text("Top Album & Tracks");
	$('h3.discoverMore').addClass("visible");

	var bandName = info.artist.name;
		// console.log(bandName);
	$("title").text(bandName + "Results");
	// $('.bandTitle').append("<h3>" + bandName + "</h3>")

	var bandImage = info.artist.image[4]["#text"];
		// console.log("YOUYOYOYO" , bandImage);
		$('.bandImage').append($("<div>").addClass("imageContainer").append($("<img>").attr("src", bandImage)));

	var bandBio = info.artist.bio.summary;
		// console.log(bandBio);

	// Band similar stuff
	var bandSimilar = info.artist.similar.artist;
		// console.log(bandSimilar);

		$('ul.similarArray').append("<h4>Similar Artists</h4>")

	$.each(bandSimilar, function(i, similarBand){
		var similarBandName = similarBand.name;
		// console.log(similarBandName);
		$("ul.similarArray").append("<li>" + similarBandName + "</li>");
	});

	//Band Genre Stuff
	var bandGenre = info.artist.tags.tag;
		// console.log(bandGenre);

	$('ul.genreArray').append("<h4>Genre</h4>")


	$.each(bandGenre, function(i, bandGenre){
		var bandGenreName = bandGenre.name;
		// console.log(bandGenreName);
		$("ul.genreArray").append("<li>" + bandGenreName + "</li>");
	});


	$('.bandTitle').append("<h2>" + bandName + "</h2>");
	$('.bandImage').append("<img class='bandImageImage'>").attr('src', bandImage);
	$('.bandInfo').append("<p>" + bandBio + "</p>");
	// $('.bandInfo').append("<p>" + bandBio + "</p>");
	// console.log("The band name is:" + bandName);
}


// // // // // // //
// INIT TO WIN IT //
// // // // // // //

app.init = function() {
	// console.log("initworks");
	app.getBand();

};

// // // // // // //
// DOCUMENT READY //
// // // // // // //

$(function() {
	app.init();
});