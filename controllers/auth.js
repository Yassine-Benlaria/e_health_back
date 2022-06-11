const jwt = require("jsonwebtoken")
const Patient = require("../models/patient")
const Medecin = require("../models/medecin")
const Admin = require("../models/admin")
const { expressjwt: express_jwt } = require("express-jwt");
//signin
exports.signin = (req, res) => {

    const { email, password } = req.body;


    ////////client login

    Admin.findOne({ email }, (err, admin) => {
        if (err || !admin) {
            const { email, password } = req.body;
            Patient.findOne({ email }, (err, patient) => {
                //if patient does not exist then search in medecin
                if (err || !patient) {
                    const { email, password } = req.body;
                    Medecin.findOne({ email }, (err, medecin) => {
                        //if medecin does not exist return an error
                        if (err || !medecin) {
                            return res.status(400).json({ err: "can't find any account with this email!" });
                        }

                        //if an account is found, then check if email and password match
                        if (!medecin.authenticate(password)) {
                            return res.status(401).json({
                                err: "email and password does not match"
                            })
                        }

                        //generate signin token
                        const token = jwt.sign({ _id: medecin._id }, process.env.JWT_SECRET);

                        //token in cookie with expiry date
                        res.cookie("token", token, { expire: new Date() + 9999 });

                        //return response with user and token
                        const { _id, first_name, family_name, email, verified } = medecin;
                        return res.json({ token, user: { _id, first_name, family_name, email, verified, type: "medecin" } });
                    });
                    return;
                }
                //if an account is found, then check if email and password match
                if (!patient.authenticate(password)) {
                    return res.status(401).json({
                        err: "email and password does not match"
                    })
                }
                //generate signin token
                const token = jwt.sign({ _id: patient._id }, process.env.JWT_SECRET);

                //token in cookie with expiry date
                res.cookie("token", token, { expire: new Date() + 9999 });

                //return response with user and token
                const { _id, first_name, family_name, email, verified } = patient;
                return res.json({ token, user: { _id, first_name, family_name, email, verified, type: "patient" } });
            });
            return;

        }

        if (!admin.authenticate(password)) {
            return res.status(401).json({
                err: "email and password does not match"
            })
        }
        //generate signin token
        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);

        //token in cookie with expiry date
        res.cookie("token", token, { expire: new Date() + 9999 });

        //return response with user and token
        const { _id, first_name, family_name, email } = admin;
        return res.json({ token, user: { _id, first_name, family_name, email, type: "admin" } });
    })
}

//signout
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Signed out" });
}


//requireSignin
exports.requireSignin = express_jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
})


//Authentication check
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && (req.auth._id == req.auth._id)

    if (!user) {
        return res.status(403).json({
            error: "Access denied!!"
        })
    }

    next();
}

//Admin check
exports.isAdmin = (req, res) => {
    if (req.profile.type != "admin") {
        return res.status(403).json({
            error: "Access denied!! you are not an admin!!"
        })
    }
}