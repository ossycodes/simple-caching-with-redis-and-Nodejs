const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
    },
    { versionKey: false }
);


const User = mongoose.model("User", userSchema);

module.exports = User;