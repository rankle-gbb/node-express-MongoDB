const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
  goodsName: {
    type: String,
    // required: true,
  },
  originalPrice: {
    type: Number,
  },
  presentPrice: {
    type: Number,
    // required: true,
  },
  introduce: {
    type: String,
    // required: true,
  },
  color: {
    type: Array
  },
  size: {
    type: Array
  },
  createDate: {
    type: Date,
    default: Date.now()
  }
});

const Goods = mongoose.model('goods', goodsSchema);
module.exports = Goods;