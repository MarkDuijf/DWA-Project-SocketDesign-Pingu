/**
 * Created by developer on 16-12-15.
 */
module.exports = function(app){
    var fs = require('fs');
    var archiver = require('archiver');
    var rmdir = require('rimraf');
    var session = require("express-session");

    //Puts the generated code and project name in a session variable
    app.post('/download', function(req, res) {
       req.session.clientCode = req.body.clientCode;
        req.session.serverCode = req.body.serverCode;
        req.session.name = req.body.name;
        res.status(200);
        res.send("Succes!");
    });

    //Sends a zipped file of the generated project for download the user
    app.get('/download', function(req, res) {
        var dir = req.session.name + "_" + req.session.username;
        var gemaakteBestanden = 0;

        fs.mkdir("downloads/"+dir, function(err) {
            if (err) {
                if (err.code == 'EEXIST') {
                    maakBestand("client.js", req.session.clientCode);
                    maakBestand("server.js", req.session.serverCode);
                    maakBestand("package.json", '{ \n "name": "'+ req.session.name + '", \n "main": "server.js", \n "author": "' + req.session.firstName + '", \n "dependencies": { \n   "socket.io": "^1.3.7", \n   "express": "^4.13.3" \n } \n}');
                } else {
                    res.status(500);
                    res.send('Failed to make the folder');
                }
            } else {
                maakBestand("client.js", req.session.clientCode);
                maakBestand("server.js", req.session.serverCode);
                maakBestand("package.json", '{ \n "name": "'+ req.session.name + '", \n "main": "server.js", \n "author": "' + req.session.firstName + '", \n "dependencies": { \n   "socket.io": "^1.3.7", \n   "express": "^4.13.3" \n } \n}');
            }

            function maakBestand(name, data) {
                fs.writeFile("downloads/"+dir+"/"+name, data, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.send("Error creating file");
                    } else {
                        gemaakteBestanden++;

                        if(gemaakteBestanden === 3) {
                            writeZip();
                        }
                    }
                });
            }

            function writeZip() {
                var output = fs.createWriteStream('downloads/'+dir+'.zip');
                var archive = archiver('zip');

                output.on('close', function () {
                    downloadFile();
                });

                archive.on('error', function(err){
                    console.log(err);
                    res.status(500);
                    res.send("Error creating ZIP");
                });

                archive.pipe(output);
                archive.glob("downloads/"+dir+'/**', { date: new Date() });
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

    //Route for downloading the demo files
    app.get('/downloadDemo', function(req, res) {
        res.download('downloads/demo.zip', 'demo.zip', function(err){
            if (err) {
                console.log(err);
            } else {
                //Niks
            }
        });
    });
};