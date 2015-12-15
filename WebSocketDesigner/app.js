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
var inserlData = require('./models/dummyData/insertData');

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

app.get('/downloadTest/:id', function(req, res) {
    console.log('downloads/'+req.params.id+'.zip');
    res.download('downloads/'+req.params.id+'.zip', 'file.zip', function(err){
        if(err) {
            console.log("niet oke");
        } else {
            console.log("oke");
        }
    });
});

app.get('/downloadTest', function(req, res) {
    console.log("Maak het");
    var dir = "testdir123"; //TODO naam genereren, iets van [username]_[projectname]
    fs.mkdir("downloads/"+dir, function(err) {
        if (err) {
            if (err.code == 'EEXIST') {
                maakBestand();
            } else {
                res.status(500);
                res.send('Failed to make the folder');
            }
        } else {
            maakBestand("bestand", 'var vari = 5; \n var n = vari * 5;'); //TODO bestand voor clientside en serverside en evt andere bestanden
        }

        function maakBestand(name, data) {
            fs.writeFile("downloads/"+dir+"/"+name+".js", data, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.send("Error creating file");
                } else {
                    console.log('It\'s saved!');
                    //TODO wrtieZip() alleen uitvoeren als alle bestanden geschreven zijn (kan pas nadat we weten wat er allemaal in moet)
                    writeZip();
                }
            });
        }

        function writeZip() {
            var output = fs.createWriteStream('downloads/'+dir+'.zip');
            var archive = archiver('zip');

            output.on('close', function () {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
                downloadFile();
            });

            archive.on('error', function(err){
                console.log(err);
                res.status(500);
                res.send("Error creating ZIP");
            });

            archive.pipe(output);
            archive.glob("downloads/"+dir+'/**', { nodir: true }, { date: new Date() });
            archive.finalize();
        }

        function downloadFile() {
            res.download('downloads/'+dir+'.zip', 'file.zip', function(err){
                if (err) {
                    console.log(err);
                } else {
                    fs.unlink('downloads/'+dir+'.zip');
                    rmdir('downloads/'+dir, function(error){
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