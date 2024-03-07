const mongoose = require('mongoose');

const Schema = mongoose.Schema

const asarSchema = new Schema({
    project_info: {
        type: Object,
        required: true
    },
    project_goals: {
        type: Object,
        required: true
    },
    project_tahlils: {
        type: Object,
        required: true
    },
    m3neen: {
        type: Object,
        required: true
    },
    project_natiga: {
        type: Object,
        required: true
    },
    mod5alat: {
        type: Number,
        required: true
    },
    kema_mogtama3ya: {
        type: Number,
        required: true
    },
    safy_kema_mogtama3ya: {
        type: Number,
        required: true
    },
    aed: {
        type: Number,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Asar', asarSchema)
