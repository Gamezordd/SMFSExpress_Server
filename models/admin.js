const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const AdminModel = new Schema({
  username: {
    type: String,
    required: true,
  },
});

AdminModel.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", AdminModel);
