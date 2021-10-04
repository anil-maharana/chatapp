const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomName: { type: String, required: true, unique: true },
    roomType: { type: String, enum: [private = 'Private', public = 'Public'], default: 'Private' },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    users: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        required: true
    },
    // messages: {
    //     type: [{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'message'
    //     }],
    // },
    createdOn: { type: Date, required: true, default: Date.now() },
    lastUpdated: { type: Date, default: Date.now() }
})
const Room = mongoose.model('room', roomSchema);
module.exports = Room;