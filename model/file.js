const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: String,
  url: String,
  type: String,
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
