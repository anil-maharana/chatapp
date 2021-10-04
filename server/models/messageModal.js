const mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    messageAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    messageBody: { type: mongoose.Schema.Types.Mixed, required: true },
    // deliveryStatus: { type: String, enum: [succes = 'Success', fail = 'Failed', notSaved = 'Not Saved'], default: 'Not Saved' },
    createdOn: { type: Date, default: Date.now },
});

const Message = mongoose.model('message', messageSchema);
module.exports = Message;