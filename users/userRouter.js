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

router.post('/:id/posts', validateUserId, async (req, res) => {
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

router.get('/:id', validateUserId, async (req, res) => {
    try {
        const user = await Users.getById(req.params.id);
        if (user) {
            res.status(200).json(req.user);
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    } catch (error) {
        res.status(500).json({ error: "The user information could not be retrieved." });
    }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    try {
        const posts = await Users.getUserPosts(req.params.id);
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({
          message: 'Error getting the posts for the user',
        });
      }
});

router.delete('/:id', validateUserId, async (req, res) => {
    try {
        const count = await Users.remove(req.params.id);
        if (count > 0) {
          res.status(200).json({ message: 'The user has been deleted' });
        } else {
          res.status(404).json({ message: 'The user could not be found' });
        }
      } catch (error) {
        res.status(500).json({
          message: 'Error removing the user',
        });
      }
});

router.put('/:id', validateUserId, async (req, res) => {
    try {
        const user = await Users.update(req.params.id, req.body);
        if (user) {
          res.status(200).json({id: req.params.id, ...req.body});
        } else {
          res.status(404).json({ message: 'The user could not be found' });
        }
      } catch (error) {
        res.status(500).json({
          message: 'Error updating the user',
        });
      }
});

//custom middleware

async function validateUserId(req, res, next) {
    try {
        const user = await Users.getById(req.params.id);
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to process request" });
    }
};

// function validateUser(req, res, next) {

// };

// function validatePost(req, res, next) {

// };

module.exports = router;