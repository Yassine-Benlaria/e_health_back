const express = require("express");
const router = express.Router();
const cors = require("cors");
const { addAppointment, appointmentsByMedecinId, deleteAppointment, updateAppointment, appointmentById, reserve, cancelReservation, reservedAppointments, reservedAppointmentsByPatientID } = require("../controllers/appointment");
const { requireSignin, isAuth } = require("../controllers/auth");
const { patientById } = require("../controllers/patient")
const { medecinById } = require("../controllers/medecin");
router.use(cors());


//get appointments by medecin id
router.get("/medecin/:medecin_id", requireSignin, appointmentsByMedecinId)

//appointmentByID
router.get("/:id", appointmentById)


//get reserved appointments by medecin_id
router.get("/reserved/:medecin_id", requireSignin, isAuth, reservedAppointments)

//get reserved appointments by patient_id
router.get("/reserved/patient/:patient_id", requireSignin, isAuth, reservedAppointmentsByPatientID)

//add new appointment
router.post("/add", requireSignin, addAppointment);

//update an appointment
router.post("/update/:id", requireSignin, updateAppointment)

//reserve appointment
router.post("/reserve/:patient_id", /*requireSignin,*/ reserve)

//cancel a reservation
router.post("/cancel/:patient_id", requireSignin, isAuth, cancelReservation)

//delete an appointment
router.delete("/:id", /*requireSignin, */ deleteAppointment)

//patient by id middlware
router.param("patient_id", patientById);
//patient by id middlware
router.param("medecin_id", medecinById);

module.exports = router;