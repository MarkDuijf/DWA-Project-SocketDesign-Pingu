/**
 * Created by vince on 24-11-2015.
 */
var path        = require('path');
//var mongoose    = require('mongoose');
var express     = require('express');
var app         = express();
var server      = require('http').Server(app);
//var io          = require('socket.io')(server);
var nodemailer = require('nodemailer');

// Express
app.use(express.static(path.join(__dirname, 'clientside')));

server.listen(13000, function() {
    console.log('Server is running on port 13000')
});

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'dwasdeu@gmail.com',
        pass: 'pingusdeu'
    }
});

var mailOptions = {
    from: 'Socket Designer <dwasdeu@gmail.com>', // sender address
    to: 'pluisam@gmail.com', // list of receivers
    subject: 'Hello', // Subject line
    text: "Is it me you're looking for?", // plaintext body
    html: "<b>Is it me you're looking for?</b>" // html body
};

/* Code hieronder is voor het verzenden van de mail weg gecomment anders wordt Sam gespamt
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});
*/