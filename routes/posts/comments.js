const {Router} = require('express')
const {
    createNewComment,
    findPostComments
} = require('../../controllers/comments')

const route = Router()


route.get('/:id', async (req, res) => {
    const comments = await findPostComments(req.params.id)
    res.status(200).send(comments)
})
route.post('/', async (req, res) => {
    const { post, user, body } = req.body
    
    if ((!post) || (!user) || (!body)) {
      return res.status(400).send({
        error: 'Need postid, title and body to create post'
      })
    }
    const comment = await createNewComment(post, user, body)
    res.status(201).send(comment)
})

module.exports = {
    commnetsRoute: route
}