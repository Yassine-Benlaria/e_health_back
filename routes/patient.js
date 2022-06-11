const express = require("express");
const router = express.Router();
const { signup, signin, signout, patientById, confirmAccount, getPatients } = require("../controllers/patient");
const { patientSignUpValidator } = require("../validator");
const { requireSignin, isAuth } = require("../controllers/auth");
const cors = require("cors");
router.use(cors());


//get all medecins
router.get("/all", requireSignin, getPatients)

//Signup
router.post("/signup", patientSignUpValidator, signup);

// router.post("/signin", signin);
router.post("/signout", signout);

//confirm account
router.post("/confirm/:id", confirmAccount)



//patient by id
router.get("/:id", requireSignin /*, isAuth, */ , (req, res) => {
    res.json({
        patient: req.profile
    })
})

//patient by id middlware
router.param("id", patientById);



module.exports = router;