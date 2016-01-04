/**
 * Created by developer on 16-12-15.
 */
module.exports = function(app){
    var fs = require('fs');
    var archiver = require('archiver');
    var rmdir = require('rimraf');
    var session = require("express-session");

    //TODO downloads map maken als die nog niet bestaat

    app.get('/downloadTest', function(req, res) {
        var dir = "testdir123"; //TODO naam genereren, iets van [username]_[projectname]
        fs.mkdir("downloads/"+dir, function(err) {
            if (err) {
                if (err.code == 'EEXIST') {
                    maakBestand("bestand", 'var vari = 5; \n var n = vari * 5;');
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
};