const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    bio: String,
    phone: String,
    email: String,
    photo: String,
    isPublic: { type: Boolean, default: true }
});

module.exports = mongoose.model('Profile', profileSchema);
