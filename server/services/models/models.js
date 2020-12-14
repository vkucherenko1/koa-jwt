const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: String,
    password: String,
    created: Date
});

const tokenSchema = new Schema({
    userId: String,
    refreshToken: String
})

module.exports = {
    User: mongoose.model("User", userSchema),
    Token: mongoose.model("Token", tokenSchema)
}
