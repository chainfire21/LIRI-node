module.exports = {
    array:[
        {
            type: 'rawlist',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['Find concerts for an artist', 'Check Spotify for a song', 'Get OMDB info on a movie', 'Use the random text file for a demonstration','Exit'],
        },
        {
            type: 'input',
            name: 'concert',
            message: 'Which artist?',
            when: function (answers) {
                return answers.choice === 'Find concerts for an artist';
            }
        },
        {
            type: 'input',
            name: 'song',
            message: 'What song?',
            when: function (answers) {
                return answers.choice === 'Check Spotify for a song';
            }
        },
        {
            type: 'input',
            name: 'movie',
            message: 'What movie?',
            when: function (answers) {
                return answers.choice === 'Get OMDB info on a movie';
            }
        },
    ]
}