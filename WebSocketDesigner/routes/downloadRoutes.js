/**
 * Created by developer on 16-12-15.
 */
module.exports = function(app){
    var fs = require('fs');
    var archiver = require('archiver');
    var rmdir = require('rimraf');
    var session = require("express-session");

    //Puts the generated code and project name in a variable
    app.post('/downloadTest', function(req, res) {
       req.session.clientCode = req.body.clientCode;
        req.session.serverCode = req.body.serverCode;
        req.session.name = req.body.name;
        res.status(200);
        res.send("Succes!");
    });

    //Sends a zipped file of the generated project for download the user
    app.get('/downloadTest', function(req, res) {
        var dir = req.session.name + "_" + req.session.username; //TODO naam genereren, iets van [username]_[projectname]
        var gemaakteBestanden = 0;

        fs.mkdir("downloads/"+dir, function(err) {
            if (err) {
                if (err.code == 'EEXIST') {
                    maakBestand("client", req.session.clientCode);
                    maakBestand("server", req.session.serverCode);
                } else {
                    res.status(500);
                    res.send('Failed to make the folder');
                }
            } else {
                maakBestand("client", req.session.clientCode);
                maakBestand("server", req.session.serverCode);
                //maakBestand("bestand", req.session.code);
            }

            function maakBestand(name, data) {
                fs.writeFile("downloads/"+dir+"/"+name+".js", data, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.send("Error creating file");
                    } else {
                        console.log('It\'s saved!');
                        gemaakteBestanden++;
                        //TODO wrtieZip() alleen uitvoeren als alle bestanden geschreven zijn (kan pas nadat we weten wat er allemaal in moet)
                        if(gemaakteBestanden === 2) {
                            writeZip();
                        }
                    }
                });
            }

            function writeZip() {
                var output = fs.createWriteStream('downloads/'+dir+'.zip');
                var archive = archiver('zip');

                output.on('close', function () {
                    //console.log(archive.pointer() + ' total bytes');
                    console.log('archiver has been finalized and the output file descriptor has closed.');
                    //downloadFile();
                });

                archive.on('error', function(err){
                    console.log(err);
                    res.status(500);
                    res.send("Error creating ZIP");
                });

                archive.pipe(output);
                archive.glob("downloads/"+dir+'/*.js', { nodir: true }, { date: new Date() });
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