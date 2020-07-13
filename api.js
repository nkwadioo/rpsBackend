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
const cors = require('cors');
const io = require('socket.io')(http);

// to read and write to file
const  fs = require('fs');
var path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);

/*
    // scores.json
    [
        { id(uniqe): int, userId: string, win: int, losse: int, tie: int, points: int},
    ]

    // users.json
    {   
        live: int
        totalCount: int,
        lastLogin: int
        people: [userId(uniqe): string, username(uniqe): string, password: string],
        logedIn: [userId(uniqe): string, token]
    }
*/

let JsonScores = require('./src/files/scores.json');
let JsonUsers = require('./src/files/users.json');

JsonScores.live = 0;
/* 


    USE FUNCTIONS


*/ 

app.use(cors()); 
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

function makeid(length) {
    var result           = '';
    var characters       = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


app.get('/', (req, res) => {
    res.send('<h1>Your Wellcome to Play!</h1>');
});

// app.get('/registor', (req, res) => {
//     return res.sendStatus(200);
// });

app.post('/registor', (req, res) => {
    let users = JsonUsers.people;
    // check if username is there
    let x = users.find(user => {
        if (user.username === req.body.username) {
            return true;
        }
    })

    if (x) {
        return res.status(200).json({status: 501, httpMean: 'Not Implemented', message: 'user exist'});
    }

    users.push({userId: makeid(6), username: req.body.username, password: req.body.newPassword});
    // JsonUsers.people = users;

    fs.writeFile('./src/files/users.json', JSON.stringify(JsonUsers), 'utf8', (err, data) => {
        if (err) {
            JsonUsers.people.pop();
            return res.status(200).json({status: 500, httpMean: 'Internal Server Error', message: 'Write error'});
        }

        return res.status(201).json({status: 201, mes: 'Created'});
    })
    
});

io.on('connection', (socket) => {
    // count++;
    JsonUsers.live++;
    console.log('a user connected. no #' + JsonUsers.live);
    // JsonUsers.totalCount++;
    // JsonUsers.lastLogin = new Date();
    fs.writeFile('./src/files/users.json', JSON.stringify(JsonUsers), 'utf8', (err, data) => {
        if (err) {
            return console.error(err);
        }
    });
    io.emit('gameInfo', JsonUsers.live);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        JsonUsers.live--;
        fs.writeFile('./src/files/users.json', JSON.stringify(JsonUsers), 'utf8', (err, data) => {
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