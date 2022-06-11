const express = require("express");
const router = express.Router();


const cors = require("cors");
const { signup, signout, adminById } = require("../controllers/admin");
const { adminSignUpValidator } = require("../validator");
const { requireSignin } = require("../controllers/auth");
router.use(cors());


router.post("/signup", adminSignUpValidator, signup);

router.post("/signout", signout);


//patient by id
router.get("/:id", requireSignin /*, isAuth, */ , (req, res) => {
    res.json({
        admin: req.profile
    })
})

//patient by id middlware
router.param("id", adminById);



module.exports = router;