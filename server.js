const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const expressValidator = require("express-validator")

require("dotenv").config();

//import routes
const patientRoutes = require("./routes/patient")
const medecinRoutes = require("./routes/medecin")
const authRoutes = require("./routes/auth")
const appointmentRoutes = require("./routes/appointment")
const adminRoutes = require("./routes/admin")



//app
const app = express();


//db connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
}).then(() => console.log("DataBase Connected!!"));

//middlwares
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

//routes middlware
app.use("/api/patient", patientRoutes);
app.use("/api/medecin", medecinRoutes);
app.use("/api", authRoutes)
app.use("/api/appointment", appointmentRoutes)
app.use("/api/admin", adminRoutes)


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});