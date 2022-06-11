const { response } = require("express");
const { query } = require("express");
const appointment = require("../models/appointment");
const Appointment = require("../models/appointment")
const Medecin = require("../models/medecin");
const Patient = require("../models/patient")
const { requireSignin } = require("./auth");
var nodemailer = require('nodemailer');




//appointmentById
exports.appointmentById = (req, res) => {
    Appointment.findById(req.params.id, (err, appointment) => {
        if (err || !appointment)
            return res.status(400).json({ err: "appointment not found!!!" })
        return res.json(appointment)
    })
}

//create new appointment
exports.addAppointment = (req, res) => {
    Medecin.findById(req.body.medecin_id, (err, result) => {
        //check if medecin's id exists
        if (err || !result) {
            return res.status(400).json({
                err: "No medecin found with this ID"
            });
        }


        let start = new Date(req.body.start_date),
            end = new Date(req.body.end_date)

        //if dates are valid
        let check = checkDates(req.body.start_date, req.body.end_date)
        console.log("check " + check)
        if (check !== true)
            return res.status(400).json({
                err: check
            });

        ///intersections
        let query = {
            $or: [
                //// 
                { $and: [{ start_date: { $lt: start } }, { end_date: { $gt: start } }] },
                { $and: [{ start_date: { $lt: end } }, { end_date: { $gt: end } }] },

                ////
                { $and: [{ start_date: { $gt: start } }, { start_date: { $lt: end } }] },
                { $and: [{ end_date: { $gt: start } }, { end_date: { $lt: end } }] }
            ]
        }

        Appointment.exists(query, (err, result) => {
            if (err || !result) {

                //Save to DB
                let json = req.body





                const appoint = new Appointment(
                    req.body
                );
                appoint.save((err, createdAppointment) => {
                    if (err) {
                        console.log(err)
                        return res.status(400).json({
                            err
                        });
                    }
                    res.json({ createdAppointment });
                })

            } else {
                return res.status(400).json({
                    err: "Time period already occupied!"
                })
            }

        })
    })
}

//get appointments by medecin id
exports.appointmentsByMedecinId = (req, res) => {
    Appointment.find({ medecin_id: req.params.medecin_id }, (err, result) => {
        console.log(req.params.medecin_id)
        if (err || !result) {
            return res.status(400).json({
                err: "No reservations found"
            });
        }


        return res.json({
            reservations: result
        })
    })
}

///delete an appointment
exports.deleteAppointment = (req, res) => {

    if (req.params.id) {
        Appointment.findById(req.params.id, (err, result) => {

            let patient_id = result.patient_id || null
            Appointment.findByIdAndDelete(req.params.id).then((response, err) => {
                if (err) return res.status(400).json({ err: err });

                //sending email
                if (patient_id) {
                    Patient.findById(patient_id, (err, patient) => {
                        senMail(patient.email, "Rendez-vous annulé !!", "Votre rendez-vous a été annulé par votre medecin!!")
                    })
                }
                res.json({ deleted_appointment: response });
            });
        })

    } else return res.status(400).json({ err: "appointment not found" })
}

var checkDates = (start_date, end_date) => {

    if (!isDate(start_date)) {
        return "Start_date is not valid"
    }
    if (!isDate(end_date)) {
        return "End_date is not valid"
    }

    let start = new Date(start_date),
        end = new Date(end_date)
    if (start.getTime() >= end.getTime())
        return "Start_date should be before End_date"
    if (start.getTime() < new Date().getTime() || end.getTime() < new Date().toLocaleDateString())
        return "Cannot insert a past date!!!"

    return true
}

////update an appointment
exports.updateAppointment = (req, res) => {
    console.log(req.body)
    Appointment.updateOne({ _id: req.params.id }, { $set: req.body }, (err, response) => {
        if (err || !response) return res.status(401).json({ err: "appointment not found" })
        return res.json({ updated_appointment: response })
    })

}

//reserve appointment
exports.reserve = (req, res) => {
    console.log(req.body)
    Patient.findById(req.params.patient_id, (err, result) => {
        if (err || !result)
            return res.status(400).json({ err: "Patient not found!" })
        if (req.body.appointment_id) {
            let query = { $and: [{ _id: req.body.appointment_id }, { reserved: false }] }
            Appointment.findById(req.body.appointment_id, (err, result) => {
                if (err || !response) return res.status(401).json({ err: "appointment not found !" })

                if (result.reserved == false) {
                    Appointment.updateOne({ _id: req.body.appointment_id }, { $set: { patient_id: req.params.patient_id, reserved: true } },
                        (err, response) => {
                            if (err || !response) return res.status(401).json({ err: "error while reserving!!!" })
                            return res.json({ updated_appointment: "Appointment reserved successfully!!" })
                        })
                } else {
                    return res.status(401).json({ err: "appointment is already reserved!" })
                }
            })

        }
    })
}


//////cancel reservation
exports.cancelReservation = (req, res) => {
    if (req.body.appointment_id)
        Appointment.updateOne({ _id: req.body.appointment_id }, { $set: { patient_id: "", reserved: false } },
            (err, response) => {
                if (err || !response) return res.status(401).json({ err: "error while canceling appointment!" })
                return res.json({ response: "appointment canceled!!" })
            })
}

var isDate = function(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}


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


const senMail = (receiver, subject, content) => {


    var mailOptions = {
        from: 'ehealth.company@yahoo.com',
        to: receiver,
        subject: subject,
        text: content
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


//reserved appointments by medecin id
exports.reservedAppointments = (req, res) => {
    let projection = {
        createdAt: false,
        updatedAt: false
    };

    Appointment.find({
            medecin_id: req.params.medecin_id,
            reserved: true
        },
        projection,
        (err, result) => {
            let patient_ids = []
            result.map((appointment) => patient_ids.push(appointment.patient_id))
            let patientProjection = {
                salt: false,
                hashed_password: false,
                createdAt: false,
                updatedAt: false
            };
            Patient.find({ _id: { $in: patient_ids } }, patientProjection, (err, patients) => {
                if (err || !patients) return res.status(400).json({ err: "error finding patients!!" })

                let finalResult = result.map(appointment => {


                    return {
                        _id: appointment._id,
                        medecin_id: appointment.medecin_id,
                        start_date: appointment.start_date,
                        duration: getDifferenceInMinutes(new Date(appointment.end_date), new Date(appointment.start_date)) + " min",
                        //   title: appointment.title,
                        patient: patients.filter(p => p._id == appointment.patient_id)[0]
                    }
                })
                return res.json({ appointments: finalResult })
            })
        }
    )
}



//reserved appointments by patient_id
exports.reservedAppointmentsByPatientID = (req, res) => {
    let projection = {
        createdAt: false,
        updatedAt: false
    };

    Appointment.find({
            patient_id: req.params.patient_id,
            reserved: true
        },
        projection,
        (err, result) => {
            let medecin_ids = []
            result.map((appointment) => medecin_ids.push(appointment.medecin_id))
            let medecinProjection = {
                salt: false,
                hashed_password: false,
                createdAt: false,
                updatedAt: false
            };
            Medecin.find({ _id: { $in: medecin_ids } }, medecinProjection, (err, medecins) => {
                if (err || !medecins) return res.status(400).json({ err: "error finding medecins!!" })

                let finalResult = result.map(appointment => {


                    return {
                        _id: appointment._id,
                        medecin_id: appointment.medecin_id,
                        start_date: appointment.start_date,
                        duration: getDifferenceInMinutes(new Date(appointment.end_date), new Date(appointment.start_date)) + " min",
                        //    title: appointment.title,
                        medecin: medecins.filter(m => m._id == appointment.medecin_id)[0]
                    }
                })
                return res.json({ appointments: finalResult })
            })
        }
    )
}


//get difference between two dates
function getDifferenceInMinutes(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60);
}







///send confirmation email
var transporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service: 'yahoo',
    secure: false,
    auth: {
        user: 'ehealth.company@yahoo.com',
        pass: 'xuffgztyealbmeri'
    }
});