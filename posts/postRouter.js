const express = require('express');

const Posts = require('./postDb.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.get();
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({
          message: 'Error retrieving the posts',
        });
      }
});

router.get('/:id', validatePostId, async (req, res) => {
    res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, async (req, res) => {
    try {
        const count = await Posts.remove(req.params.id);
        if (count > 0) {
          res.status(200).json({ message: 'The post has been deleted' });
        } else {
          res.status(404).json({ message: 'The post could not be found' });
        }
      } catch (error) {
        res.status(500).json({
          message: 'Error removing the post',
        });
      }
});

router.put('/:id', validatePostId, async (req, res) => {
    try {
        const post = await Posts.update(req.params.id, req.body);
        if (post) {
          res.status(200).json({id: req.params.id, ...req.body});
        } else {
          res.status(404).json({ message: 'The post could not be found' });
        }
      } catch (error) {
        res.status(500).json({
          message: 'Error updating the post',
        });
      }
});

// custom middleware

async function validatePostId(req, res, next) {
    try {
        const post = await Posts.getById(req.params.id);
        if (post) {
            req.post = post;
            next();
        } else {
            res.status(404).json({ message: "Invalid post id" })
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to process request" });
    }
};

module.exports = router;