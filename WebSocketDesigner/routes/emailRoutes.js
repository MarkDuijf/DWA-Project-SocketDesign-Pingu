/**
 * Created by developer on 8-12-15.
 */
module.exports = function(app){
    var nodemailer  = require('nodemailer');
    var bodyParser  = require('body-parser');

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dwasdeu@gmail.com',
            pass: 'pingusdeu'
        }
    });

    app.post('/contact', function(req, res) {
        var mailOptions = {
            from: 'Contact Form <dwasdeu@gmail.com>',                                                                                       // sender address
            to: 'dwasdeu@gmail.com',                                                                                                        // list of receivers
            subject: 'Bericht van contact formulier',                                                                                       // Subject line
            text: "Contact form message",                                                                                                   // plaintext body
            html: "Bericht van: " + req.body.name + ", email naar: " + req.body.email + "<br><br><b>Bericht:</b><br>" + req.body.message    // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                res.status(500);
                res.send("Error!" + error);
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);

            res.status(200);
            res.send("Succes!");
        });
    });
};