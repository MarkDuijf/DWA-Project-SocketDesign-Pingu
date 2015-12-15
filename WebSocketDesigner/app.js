var path = require('path');
var express = require('express');
var app = express();
module.exports = app;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var session = require("express-session");

var fs = require('fs');
var archiver = require('archiver');
var rmdir = require('rimraf');

//This inserts the testdata
var inserData = require('./models/dummyData/insertData');

// Express
app.use(express.static(path.join(__dirname, 'clientside')));
app.use(bodyParser.json());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "sassas"
}));

//Alle code die iets te maken hebben met het versturen van een email, zoals het contactformulier
require('./routes/emailRoutes')(app);

//Alle code van routes die mongo nodig hebben om te werken, zoals inloggen, registreren en confirmeren
require('./routes/mongoRoutes')(app);

app.get('/downloadTest', function(req, res) {
    console.log("Maak het");
    var dir = "testdir123";
    fs.mkdir("downloads/"+dir, function(err) {
        if (err) {
            if (err.code == 'EEXIST') {
                maakBestand();
            } else {
                res.status(500);
                res.send('Failed to make the folder');
            }
        } else {
            maakBestand();
        }

        function maakBestand() {
            fs.writeFile("downloads/"+dir+"/bestand.js", 'var vari = 5; \n var n = vari * 5;', function (err) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send("Error creating file");
                } else {
                    console.log('It\'s saved!');
                    writeZip("downloads/"+dir, "bestand");
                }
            });
        }

        function writeZip(dir,name) {
            var output = fs.createWriteStream('downloads/'+name+'.zip');
            var archive = archiver('zip');

            output.on('close', function () {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
                downloadFile();
                //res.status(200);
                //res.send("Zip made");
            });

            archive.on('error', function(err){
                console.log(err);
                res.status(500);
                res.send("Error creating ZIP");
            });

            archive.pipe(output);
            archive.glob(dir+'/**', { nodir: true }, { date: new Date() });
            archive.finalize();
        }

        function downloadFile() {
            var stream = fs.createReadStream('downloads/bestand.zip');
            res.setHeader('content-type', 'application/x-zip');
            stream.pipe(res);

            var had_error = false;
            stream.on('error', function (err) {
                had_error = true;
            });
            stream.on('close', function () {
                if (!had_error) {
                    fs.unlink('downloads/bestand.zip');
                    rmdir('downloads/testdir123', function(error){
                        if(error) {
                            console.log("Error deleting folder");
                        }
                    });
                }
            });
        }
    });
});

//All socket.io code
io.on('connection', function (socket) {
    "use strict";
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        console.log('Ik heb een message binnen gekregen: ' + msg);
    });
});

server.listen(13000, function () {
    "use strict";
    console.log('Server is running on port 13000');
});