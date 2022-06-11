const express = require("express");
const { requireSignin } = require("../controllers/auth");
const router = express.Router();
const { signup, signin, signout, getMedecins, medecinBySpeciality, serachMedecins, serachMedecinByPrice, getUnverfiedMedecins } = require("../controllers/medecin");
const { medecinSignUpValidator } = require("../validator");
const cors = require("cors");
router.use(cors());

//get all medecins
router.get("/all", requireSignin, getMedecins)

//get unverfied medecins
router.get("/unverfied", requireSignin, getUnverfiedMedecins)
    //get medecins by speciality
router.get("/speciality", requireSignin, medecinBySpeciality)

//search medecins
router.get("/search/:keyword", requireSignin, serachMedecins)

//search medecins by price range
router.get("/search/:min/:max", requireSignin, serachMedecinByPrice)

//signup
router.post("/signup", medecinSignUpValidator, signup);
//router.post("/signin", signin);

router.post("/signout", requireSignin, signout);
module.exports = router;