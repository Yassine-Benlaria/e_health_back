const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

    medecin_id: {
        type: String,
        required: true
    },
    patient_id: {
        type: String,
        default: ""
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    /*
        title: {
            type: String,
            default: ""
        },
        notes: {
            type: String,
            default: ""
        },*/
    reserved: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });


// // virtual field
// medecinSchema
//     .virtual('password')
//     .set(function(password) {
//         this._password = password;
//         this.salt = uuidv1();
//         this.hashed_password = this.encryptPassword(password);
//     })
//     .get(function() {
//         return this._password;
//     });

// // schema methods
// medecinSchema.methods = {
//     authenticate: function(plainText) {
//         return this.encryptPassword(plainText) === this.hashed_password;
//     },

//     encryptPassword: function(password) {
//         if (!password) return '';
//         try {
//             return crypto
//                 .createHmac('sha1', this.salt)
//                 .update(password)
//                 .digest('hex');
//         } catch (err) {
//             return '';
//         }
//     }
// };
module.exports = mongoose.model("Appointment", appointmentSchema);