'use strict';

/* 


    DECLARATIONS


*/
const express =  require('express');
const app = express();
const http = require('http').createServer(app);
// const serverless = require('serverless-http');
// const router = express.Router();
const bodyParser = require('body-parser');
const io = require('socket.io')(http);

// to read and write to file
const  fs = require('fs');
var path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);

/*
    // scores.json
    [
        { id: int, userId: string, win: int, losse: int, tie: int, points: int},
    ]

    // users.json
    {   
        live: int
        totalCount: int,
        lastLogin: int
        people: [userId: string, username: string, password: string, token: string]
    }
*/

let JsonScores = require('./src/files/scores.json');
let JsonUsers = require('./src/files/users.json');
/* 


    USE FUNCTIONS


*/ 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
// app.use('/.netlify/functions/api', router)// bound the router into the app, and define where the router is tied to
// app.use('/.netlify/functions/server', router);  // path must route to lambda functions



// fs.readFile('./src/files/score.json', (err, data) => {
//     if (err) {
//         return console.log(err);
//     }

//     console.log(data);
// }); // is slow to read json file


// fs.writeFile('test.txt', 'Hello', 'utf8', (err, data) => {
//     if (err) {
//         return console.error(err);
//     }
// })
/*


Route functions


*/


app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    // count++;
    JsonUsers.live++;
    console.log('a user connected. no #' + JsonUsers.live);
    // JsonUsers.totalCount++;
    // JsonUsers.lastLogin = new Date();
    fs.writeFile('./src/files/scores.json', JSON.stringify(JsonUsers), 'utf8', (err, data) => {
        if (err) {
            return console.error(err);
        }
    });
    io.emit('gameInfo', JsonUsers.live);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        JsonUsers.live--;
        fs.writeFile('./src/files/scores.json', JSON.stringify(JsonUsers), 'utf8', (err, data) => {
            if (err) {
                return console.error(err);
            }
        })

        io.emit('gameInfo', JsonUsers.live);
        
    });
    // JsonUsers.push({count});
});

http.listen(9000, () => {
    console.log('listening on *:9000');
});
// module.exports.handler = serverless(app);