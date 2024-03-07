const mongoose = require('mongoose')

const Schema = mongoose.Schema

const consSchema = new Schema({
    cons_name: {
        type: String,
        required: true
    },
    cons_subject: {
        type: String,
        required: true,
        unique: true
    },
    cons_mos: {
        type: String,
        required: true,
    },
    cons_phone: {
        type: String,
        required: true
    },
    cons_message: {
        type: String,
        required: true
    },
    cons_comment: {
        type: String,
        required: true
    },
    cons_time: {
        type: String,
        required: true
    },
    cons_seen: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Cons', consSchema)