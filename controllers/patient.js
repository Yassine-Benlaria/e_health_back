const jwt = require("jsonwebtoken"); // to generate a signin token
//const express_jwt = require("express-jwt"); // to check authorizations

const { errorHandler } = require("../helpers/dbErrorHandler");
const Patient = require("../models/patient"),
    Appointment = require("../models/appointment")
var nodemailer = require('nodemailer');
//signup
exports.signup = (req, res) => {

    const code = generateConfirmationCode()
    let json = req.body
    json.confirmation_code = code
    const patient = new Patient(req.body);
    patient.save((err, createdPatient) => {
        if (err) {
            return res.status(400).json({
                err: "Email already exists!"
            });
        }
        sendConfirmationMail(json.email, code)
        res.json({ createdPatient });

    })
}


//signout
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Signed out" });
};



//patient by ID
exports.patientById = (req, res, next, id) => {
    let projection = {
        salt: false,
        hashed_password: false,
        createdAt: false,
        updatedAt: false
    };
    Patient.findById(id, projection).exec((err, patient) => {
        if (err || !patient) {
            return res.status(400).json({
                error: "Patient not found"
            })
        }

        req.profile = patient;
        next();
    })
}

exports.confirmAccount = (req, res) => {
    let id = req.params.id
    let code = req.body.code
    Patient.findById(id, (err, patient) => {
        if (err || !patient)
            return res.status(400).json({ err: "patient not found!!" })
        if (patient.confirmation_code != code)
            return res.status(400).json({ err: "votre code n'est pas correcte!!" })
        Patient.updateOne({ _id: id }, { $set: { verified: true } },
            (err, result) => {
                if (err || !result)
                    return res.status(400).json({ err: "undefined error!!" })
                return res.json({ response: "Votre compte est vérifié!!" })
            })
    })
}

const generateConfirmationCode = () => {
    let code = ""
    for (var ii = 0; ii < 6; ii++) {
        code += Math.floor(Math.random() * 10);
    }
    return code
}


///send confirmation email
var transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service: 'yahoo',
    secure: false,
    auth: {
        user: '',
        pass: ''
    }
});

const sendConfirmationMail = (receiver, code) => {


    var mailOptions = {
        from: 'ehealth.company@yahoo.com',
        to: receiver,
        subject: "Code de confirmation",
        html: `
        <!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>

<body style="background-color: #1ABAB9; margin: 0 !important; padding: 0 !important;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#1ABAB9" align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#1ABAB9" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Bienvenue!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <h1 style="margin: 0;">${code}</h1>
                        </td>
                    </tr>
                     <tr>
                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Vous devez entrer ce code de vérification pour avoir accès</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>

                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr> <!-- COPY -->


                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;"><br>e-health</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>

                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
        `
    };

    let response = false
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log("error:---------" + error);
        } else {
            response = true
            console.log('Email sent: ' + info.response);
        }
    });
    return response
}

//get all patients
exports.getPatients = (req, res) => {
    var patientProjection = {
        salt: false,
        hashed_password: false,
        createdAt: false,
        updatedAt: false,
        confirmation_code: false
    };
    Patient.find({}, patientProjection, (err, result) => {
        if (err || !result) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        return res.json(result);
    })
}