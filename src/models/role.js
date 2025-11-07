const mongoose = require('mongoose');
const Permission = require('./permission');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);