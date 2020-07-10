'use strict';

/* 


    DECLARATIONS


*/
const express =  require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const io = require('socket.io')(app);

// to read and write to file
const  fs = require('fs');
var path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);

/* 


    USE FUNCTIONS


*/ 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use('/.netlify/functions/api', router)// bound the router into the app, and define where the router is tied to
// app.use('/.netlify/functions/server', router);  // path must route to lambda functions


/*


Route functions


*/


app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    // console.log(__dirname);
    const directoryPath = path.join(__dirname, 'Documents');
    // var files = fs.readdirSync(__dirname, function (err, files) {
    fs.readdir("./", function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file); 
        });
    });
    
    res.write('<h1>Hello from Express.js!</h1>');
    res.end();
});
// app.use('/', (req, res) => res.send(""));
// app.listen(process.env.PORT, () => {
//     console.log(' Server is ready on localhost:' + process.env.PORT);
//     // to set user roles as a global variabl?e
//     // this.userRoles = getUserRoles();
// });

// module.exports = app;

// sockets

io.on('connection', socket => {
    console.log('a user connected');
})
app.listen(9000, () {
    console.log('sever 9000');
})

// module.exports.handler = serverless(app);