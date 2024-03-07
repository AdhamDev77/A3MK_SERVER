const mongoose = require('mongoose')

const Schema = mongoose.Schema

const usersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    comm_id: {
        type: String,
    },
    approved: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    isMos: {
        type: Boolean,
        required: true
    },
    isMosReq: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Users', usersSchema)