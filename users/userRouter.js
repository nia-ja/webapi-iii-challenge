const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const user = await Users.insert(req.body);
        res.status(201).json(user);
      } catch (error) {
        res.status(500).json({
          message: 'Error adding the user',
        });
      }
});

router.post('/:id/posts', async (req, res) => {
    const postInfo = { ...req.body, user_id: req.params.id };
  try {
    const post = await Posts.insert(postInfo);
    res.status(210).json(post);
  } catch (error) {
    res.status(500).json({
      message: 'Error saving the post for the user',
    });
  }
});

router.get('/', async (req, res) => {
    try {
        const users = await Users.get();
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({
          message: 'Error retrieving the users',
        });
      }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await Users.getById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    } catch (error) {
        res.status(500).json({ error: "The user information could not be retrieved." });
    }
});

router.get('/:id/posts', async (req, res) => {
    try {
        const posts = await Users.getUserPosts(req.params.id);
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({
          message: 'Error getting the posts for the user',
        });
      }
});

// router.delete('/:id', (req, res) => {

// });

// router.put('/:id', (req, res) => {

// });

//custom middleware

// function validateUserId(req, res, next) {

// };

// function validateUser(req, res, next) {

// };

// function validatePost(req, res, next) {

// };

module.exports = router;