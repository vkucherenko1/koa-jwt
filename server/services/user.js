const { User } = require("./models/models");

async function find(login) {
    return await User.find({ login }, (err, docs) => {
        return docs;
    });
}

module.exports = {
    find
}