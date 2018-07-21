require("dotenv").config();

var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var nodeArgs = process.argv;
var userInput = nodeArgs[2];

function takeCommand() {
    if (userInput.toLowerCase() == "my-tweets") {
      myTweets();
    } 
    else if (userInput.toLowerCase() == "spotify-this-song") {
      mySpotify();
    } 
    else if (userInput.toLowerCase() == "movie-this") {
      myMovie();
    } 
    else if (userInput.toLowerCase() == "do-what-it-says") {
      myDoWhat();
    } 
  };

  function myTweets () {

    var params = {
        screen_name: "HAL900057012918",
        count: 20,
        include_rts: 1
    };
    
    client.get("statuses/user_timeline", params, function(error, tweets, response)  {
        console.log("Tweets from @" + params.screen_name + ":\n");
            for (var i = 0; i < tweets.length; i++ )  {
            console.log(tweets[i].text + " | " + tweets[i].created_at + "\n");
            }
          }    
    )};

function mySpotify() {

var defaultSong = "The Sign"; 
var userSong = nodeArgs[3];

for (var i = 4; i < nodeArgs.length; i++) {
  userSong = userSong + " " + nodeArgs[i];
};

if (userSong) {
  spotify.search(
    {
      type: 'track', query: userSong
    }, function(songErr, songData) {
      if (songErr) {
        console.log("Something went wrong!");
      }
      nodeArgs = "\n";
      for (var i = 0; i < songData.tracks.items.length; i++) {
        console.log("-----------------------------------------------------------");
        for (var j = 0; j < songData.tracks.items[i].artists.length; j++) {
          console.log("Artist            : " + songData.tracks.items[i].artists[j].name);
          console.log("Song              : " + songData.tracks.items[i].name);
          console.log("Preview URL       : " + songData.tracks.items[i].preview_url);
          console.log("Album             : " + songData.tracks.items[i].album.name);
      }
      };
    }
  );
} 
else {
  spotify.search(
    {
      type: 'track', query: defaultSong 
    }, function(songErr, songData) {
      nodeArgs = "\n";
      for (var i = 0; i < songData.tracks.items.length; i++) {
        console.log("-----------------------------------------------------------");
        for (var j = 0; j < songData.tracks.items[i].artists.length; j++) {
          if (songData.tracks.items[i].artists[j].name == "Ace of Base") {
            foundArtist = i;
            console.log("Artist       : " + songData.tracks.items[i].artists[j].name);
            console.log("Song         : " + songData.tracks.items[i].name);
            console.log("Preview URL  : " + songData.tracks.items[i].preview_url);
            console.log("Album        : " + songData.tracks.items[i].album.name);
          }
        }
      };
    }
  );
}
};

function myMovie() {

var movieTitle = nodeArgs[3];

for (var i = 4; i < nodeArgs.length; i++) {
  movieTitle = movieTitle + "+" + nodeArgs[i];
};

if (movieTitle) {

  var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(movieError, movieResponse, movieBody) {

    var movieFound = JSON.parse(movieBody).Response.toLowerCase();

    nodeArgs = "\n";
    if (!movieError && movieResponse.statusCode === 200 && movieFound === "true") {
      console.log("Movie Title      : " + JSON.parse(movieBody).Title);
      console.log("Year             : " + JSON.parse(movieBody).Year);
      console.log("IMDB Rating      : " + JSON.parse(movieBody).imdbRating);
      console.log("Rotten Tomatoes  : " + JSON.parse(movieBody).Ratings[1].Value);
      console.log("Country          : " + JSON.parse(movieBody).Country);
      console.log("Language         : " + JSON.parse(movieBody).Language);
      console.log("Plot             : " + JSON.parse(movieBody).Plot);
      console.log("Cast             : " + JSON.parse(movieBody).Actors);

    } else {
      console.log(JSON.parse(movieBody));
      nodeArgs = nodeArgs + JSON.stringify(movieBody, null, 2) + "\n";
    }     
  });
} 
else {

  var movieTitle = "Mr.+Nobody"
  var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(movieError, movieResponse, movieBody) {

    var movieFound = JSON.parse(movieBody).Response.toLowerCase();

    nodeArgs = "\n";
    if (!movieError && movieResponse.statusCode === 200 && movieFound === "true") {
      console.log("Movie Title      : " + JSON.parse(movieBody).Title);
      console.log("Year             : " + JSON.parse(movieBody).Year);
      console.log("IMDB Rating      : " + JSON.parse(movieBody).imdbRating);
      console.log("Rotten Tomatoes  : " + JSON.parse(movieBody).Ratings[1].Value);
      console.log("Country          : " + JSON.parse(movieBody).Country);
      console.log("Language         : " + JSON.parse(movieBody).Language);
      console.log("Plot             : " + JSON.parse(movieBody).Plot);
      console.log("Cast             : " + JSON.parse(movieBody).Actors);
    };
  });
}
};

function myDoWhat() {

fs.readFile("random.txt", "utf8", function(ReadError, ReadData) {
  var arr1 = [];
  var arr2 = [];
  arr1.push(process.argv[0], process.argv[1]);
  arr2 = ReadData.split(",");
  nodeArgs = arr1.concat(arr2);
  userInput.toLowerCase() == "spotify-this-song" 
    mySpotify();
});
};

takeCommand();