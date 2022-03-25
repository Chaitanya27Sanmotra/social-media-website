const {User, Post, Comment} = require('../db/models')

async function createNewComment(post, user, body) {
    const comment = await Comment.create({
        user,
        body,
        post,
    })
    return comment
}

async function findPostComments(query) {
    const comments = await Comment.find({
        post: query,
        // include: [User, Post]
    }).populate('user')
    return comments
}

module.exports = {
    createNewComment,
    findPostComments,
}