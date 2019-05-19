const express = require('express');
const User = require('../models/User');

// Middleware
const userAuth = require('../middleware/UserAuth');

const router = new express.Router();

// Create User
router.post('/register', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  };
});

router.post('/login', async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/logout', userAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    });

    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:username/profile', async (req, res) => {
  let username = req.params.username;

  try {
    const user = await User.find({ username })
      
    if (!user) {
      return res.status(404).send()
    };

    res.send(user)
  } catch(err) {
    res.status(500).send(err)
  }
});

router.get('/:username/profile/my-orders', userAuth, async (req, res) => {
  let username = req.params.username;

  try {
    const user = await User.find({ username })
      
    if (!user) {
      return res.status(404).send()
    };

    res.send(user.orderHistory)
  } catch(err) {
    res.status(500).send(err)
  }
});

module.exports = router;