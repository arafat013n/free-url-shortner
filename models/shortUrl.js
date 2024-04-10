const mongoose = require('mongoose');
const generateShortId = require("ssid");


const FUS = new mongoose.Schema({
full: {
type: String,
required: true
},
ssid: {
type: String,
default: generateShortId()
  },
  createdAt: {
  type: Date,
default: Date.now
  }
  });


  const fus = mongoose.model('fus', FUS);
  module.exports = fus;