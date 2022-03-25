const {User} = require('../db/models')

async function getUserById(id) {
    return await User.find({_id: id})
}

async function getUserByUsername(name) {
    
    return await User.find({ username: name})
}

module.exports = {
    getUserById,
    getUserByUsername
}