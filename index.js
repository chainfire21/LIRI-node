require("dotenv").config();
const Spotify = require("node-spotify-api");
const request = require("request");
const keys = require("./keys");
const spotify = new Spotify(keys.spotify);
const inquirer = require('inquirer');
const questions = require("./questions");
let reset = {
    type: 'confirm',
    name: 'resetLiri',
    message: 'Would you like to start over?',
    default: false
};
function liriAppPrompts() {
    inquirer.prompt(questions.array).then(answers => {
        console.log(answers);
        switch (answers.choice) {
            case questions.array[0].choices[0]:
                console.log("first pick");
                checkReset();
                break;
            case questions.array[0].choices[1]:
                searchSpotify(answers.song);
                break;
            case questions.array[0].choices[2]:
                searchOMBD(answers.movie);
                break;
            case questions.array[0].choices[3]:
                console.log("fourth pick");
                checkReset();
                break;
            default:
                console.log("Goodbye!");
                break;
        }
    });
}

function checkReset() {
    inquirer.prompt(reset).then(ans => {
        if (ans.resetLiri) liriAppPrompts();
    });
}

function searchSpotify(song) {
    if (song ===''){
        console.log("No song selected, using default.");
        song = "Ace of Base";
    }
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`Artist(s): ${data.tracks.items[0].artists[0].name}`);
        console.log(`Song Title: ${data.tracks.items[0].name}`);
        console.log(`Listen Here: ${data.tracks.items[0].album.external_urls.spotify}`);
        console.log(`Name of Album: ${data.tracks.items[0].album.name}`);
        checkReset();
    });
}

function searchOMBD(movie) {
    console.log(movie);
    if (movie === '') {
        console.log("No movie selected, using default.");
        movie = "Mr. Nobody";
    }
    request(`http://www.omdbapi.com/?t=${movie}&apikey=${keys.OMDB.id}`, function (err, response, body) {
        if (err) throw err;
        console.log(`\nTitle: ${JSON.parse(body).Title}`);
        console.log(`Release Year: ${JSON.parse(body).Year}`);
        console.log(`IMDB Rating: ${JSON.parse(body).imdbRating}`);
        console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`);
        console.log(`Country: ${JSON.parse(body).Country}`);
        console.log(`Plot: ${JSON.parse(body).Plot}`);
        console.log(`Actors: ${JSON.parse(body).Actors}\n`);
        checkReset();
    })
}

liriAppPrompts();
