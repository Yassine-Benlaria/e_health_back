const { errorHandler } = require("../helpers/dbErrorHandler");
const Medecin = require("../models/medecin");

//signup
exports.signup = (req, res) => {

    console.log("body--------------:" + req.body)
    const medecin = new Medecin(req.body);
    medecin.save((err, createdMedecin) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        res.json({ createdMedecin });
    })
}

//get all medecins
exports.getMedecins = (req, res) => {
    var medecinProjection = {
        salt: false,
        hashed_password: false,
        createdAt: false,
        updatedAt: false
    };
    Medecin.find({}, medecinProjection, (err, result) => {
        if (err || !result) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        return res.json(result);
    })
}


//get medecins by speciality
exports.medecinBySpeciality = (req, res) => {

    var medecinProjection = {
        salt: false,
        hashed_password: false,
        createdAt: false,
        updatedAt: false
    };
    const speciality = req.body.speciality

    Medecin.find({}, medecinProjection, (err, result) => {
        if (err || !result) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        var filtered = result.filter(x => { return x.speciality.includes(speciality) });
        return res.json(filtered)
    })
}


//search medecins by first_name, family_name, speciality, phone
exports.serachMedecins = (req, res) => {


    var medecinProjection = {
        salt: false,
        hashed_password: false,
        createdAt: false,
        updatedAt: false
    };
    var query = {}
        //adding  to query
    if (req.params.keyword && req.params.keyword != "empty") {
        var regex = RegExp(".*" + req.params.keyword + ".*", "i")
        query = {
            $or: [{ first_name: regex },
                { family_name: regex },
                { phone: regex },
                { speciality: { $elemMatch: { $regex: regex } } }
            ]
        }
    }



    Medecin.find(query, medecinProjection, (err, result) => {
        if (err || !result) {

            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        return res.json(result)
    })
}

//search medecins price range
exports.serachMedecinByPrice = (req, res) => {
    //values from params
    const min = req.params.min,
        max = req.params.max;

    //result projection
    var medecinProjection = {
        salt: false,
        hashed_password: false,
        createdAt: false,
        updatedAt: false
    };
    //query
    const query = {
        price: {
            $gte: Number(min),
            $lte: Number(max),
        }
    }

    //find result
    Medecin.find(query, medecinProjection, (err, result) => {
        if (err || !result) {

            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        return res.json(result)
    })

}

//signout
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Signed out" });
}


//medecin by ID
exports.medecinById = (req, res, next, id) => {
    Medecin.findById(id).exec((err, medecin) => {
        if (err || !medecin) {
            return res.status(400).json({
                error: "Medecin not found"
            })
        }
        req.profile = medecin;
        next();
    })
}

//get unverified medecins
exports.getUnverfiedMedecins = (req, res) => {
    var medecinProjection = {
        salt: false,
        hashed_password: false,
        createdAt: false,
        updatedAt: false
    };
    Medecin.find({ verified: false }, medecinProjection, (err, result) => {
        if (err || !result) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        return res.json(result);
    })
}