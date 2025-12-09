const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['ok', 'warning', 'critical'], default: 'ok' },
  sector: { type: String, required: true },
});

module.exports = mongoose.model('Machine', machineSchema);