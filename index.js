require("dotenv").config();
const chalk = require("chalk");
const request = require("request");
const inquirer = require('inquirer');
const questions = require("./questions");
const moment = require("moment");
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const fs = require("fs");

let reset = {
    type: 'confirm',
    name: 'resetLiri',
    message: chalk`{blueBright Would you like to do something else?}`,
    default: false
};
function liriAppPrompts() {
    inquirer.prompt(questions.array).then(answers => {
        switch (answers.choice) {
            case questions.array[0].choices[0]:
                searchConcerts(answers.concert, true);
                break;
            case questions.array[0].choices[1]:
                searchSpotify(answers.song, true);
                break;
            case questions.array[0].choices[2]:
                searchOMBD(answers.movie, true);
                break;
            case questions.array[0].choices[3]:
                randomDemo();
                break;
            default:
                console.log("Goodbye!");
                break;
        }
    });
}

function checkReset(check) {
    if (check) {
        inquirer.prompt(reset).then(ans => {
            if (ans.resetLiri) liriAppPrompts();
        });
    }
}

function searchConcerts(artist, check) {
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function (err, response, body) {
        if (err || body === "{warn=Not found}\n") {
            console.log(chalk`{red That is not a valid artist}`);
            return checkReset(check);
        }
        if (Array.isArray(JSON.parse(body)) && JSON.parse(body).length === 0) {
            console.log("There are no upcoming events for this artist, sorry!");
        }
        else {
            console.log(chalk`{greenBright.bold \nHere is the next event for ${artist}}`);
            console.log(chalk`{greenBright.bold Name: ${JSON.parse(body)[0].venue.name}}`);
            console.log(chalk`{greenBright.bold Location: ${JSON.parse(body)[0].venue.city}, ${JSON.parse(body)[0].venue.country}}`);
            console.log(chalk`{greenBright.bold Date: ${moment(JSON.parse(body)[0].datetime).format("MM/DD/YYYY")}\n}`);
        }
        checkReset(check);
    });
}

function searchSpotify(song, check) {
    if (song === '') {
        console.log(chalk`{red No song selected, using default.}`);
        song = "Ace of Base";
    }
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            console.log(chalk`{red That is not a valid song}`);
            return checkReset(check);
        }
        console.log(chalk`{magentaBright.bold \nArtist(s): ${data.tracks.items[0].artists[0].name}}`);
        console.log(chalk`{magentaBright.bold Song Title: ${data.tracks.items[0].name}}`);
        console.log(chalk`{magentaBright.bold Listen Here: ${data.tracks.items[0].album.external_urls.spotify}}`);
        console.log(chalk`{magentaBright.bold Name of Album: ${data.tracks.items[0].album.name}\n}`);
        checkReset(check);
    });
}

function searchOMBD(movie, check) {

    request(`http://www.omdbapi.com/?t=${movie}&apikey=${keys.OMDB.id}`, function (err, response, body) {
        if (err||JSON.parse(body).Response === "False") {
            console.log(chalk`{red That is not a valid movie}`);
            return checkReset(check);
        }
        console.log(chalk`{cyanBright.bold \nTitle: ${JSON.parse(body).Title}}`);
        console.log(chalk`{cyanBright.bold Release Year: ${JSON.parse(body).Year}}`);
        console.log(chalk`{cyanBright.bold IMDB Rating: ${JSON.parse(body).imdbRating}}`);
        console.log(chalk`{cyanBright.bold Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}}`);
        console.log(chalk`{cyanBright.bold Country: ${JSON.parse(body).Country}}`);
        console.log(chalk`{cyanBright.bold Plot: ${JSON.parse(body).Plot}}`);
        console.log(chalk`{cyanBright.bold Actors: ${JSON.parse(body).Actors}\n}`);
        checkReset(check);
    })
}

function randomDemo() {
    fs.readFile("random.txt", "utf8", function (err, response) {
        if (err) throw err;
        const textArr = response.split(",");
        searchConcerts(textArr[0], false)
        searchSpotify(textArr[1], true);
        searchOMBD(textArr[2], false);
    });
}
liriAppPrompts();
