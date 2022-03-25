const {Post, User} = require('../db/models')

async function createNewPost(user, title, body, image) {
    const post = await Post.create({
        title,
        body,
        user,
        image
    })
    return post
}

async function findAllPosts() {
    const posts = await Post.find().populate('user')
    return posts
}

async function findUserPosts(query) {
    const posts = await Post.find({user: query}).populate('user')
    return posts
}

module.exports = {
    createNewPost,
    findAllPosts,
    findUserPosts
}