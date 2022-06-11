const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const patientSchema = new mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    family_name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    birth_date: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    dossier_medicale: {
        type: Array,
        default: []
    },
    address: {
        type: String,
        required: true
    },
    profession: {
        type: String,
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    img: {
        data: Buffer,
        contentType: String
    },
    confirmation_code: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    salt: { type: String },
    hashed_password: {
        type: String,
        required: true
    }
}, { timestamps: true });


// virtual field
patientSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// schema methods
patientSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};
module.exports = mongoose.model("Patient", patientSchema);