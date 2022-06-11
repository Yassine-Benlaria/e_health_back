const express = require("express");
const { signInValidator } = require("../validator");
const router = express.Router()
const cors = require("cors");
const { signin, signout } = require("../controllers/auth");
router.use(cors());

router.post("/signin", signInValidator, signin);

router.post("/signout", signout)
module.exports = router;