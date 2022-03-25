const {Router} = require('express')
const  {
    getUserById,
    getUserByUsername
} = require('../../controllers/users')

const route = Router()

route.get('/:id', async (req, res) => {
    let user;    
    if(isNaN(parseInt(req.params.id))) {
        user  = await getUserByUsername(req.params.id)
    } else {
        user = await getUserById(req.params.id)
    }   
    if(user) {
        res.status(200).send(user)
    } else {
        res.status(404).send({
            error: 'No such users id or username'
        })
    }
})

module.exports = {
    usersRoute: route
}