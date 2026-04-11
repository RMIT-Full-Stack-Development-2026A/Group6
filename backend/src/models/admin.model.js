const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    // Add fields based on finalized data model UML
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // TODO: Add more fields as per UML specification
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminSchema);
