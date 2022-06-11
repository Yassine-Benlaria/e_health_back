const Admin = require("../models/admin")

//signup
exports.signup = (req, res) => {

    const admin = new Admin(req.body);
    admin.save((err, createdAdmin) => {
        if (err) {
            return res.status(400).json({
                err: "Email already exists!"
            });
        }
        res.json({ createdAdmin });
    })
}

//signout
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Signed out" });
};

//admin by ID
exports.adminById = (req, res, next, id) => {
    let projection = {
        salt: false,
        hashed_password: false,
        createdAt: false,
        updatedAt: false
    };
    Admin.findById(id, projection).exec((err, admin) => {
        if (err || !admin) {
            return res.status(400).json({
                error: "Admin not found"
            })
        }

        req.profile = admin;
        next();
    })
}