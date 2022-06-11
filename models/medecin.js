const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");
const { truncate } = require("fs");

const medecinSchema = new mongoose.Schema({
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
    n_ordre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    //cv,
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
    speciality: {
        type: Array,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    salt: { type: String },
    hashed_password: {
        type: String,
        required: true
    }
}, { timestamps: true });


// virtual field
medecinSchema
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
medecinSchema.methods = {
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
module.exports = mongoose.model("Medecin", medecinSchema);