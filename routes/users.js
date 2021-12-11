const express = require('express');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const ExpressError = require('../expressError');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const User = require('../models/user');



/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const results = await User.all();
        return res.json({ users: results.rows });
    } catch (err) {
        return next(err);
    }
});


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async (req, res, next) => {
    try {
        const result = await User.get(req.query.username);
        return res.json({ user: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
    try {
        const results = await User.messagesTo(req.query.username);
        return res.json({ messages: results.rows });
    } catch (err) {
        return next(err);
    }
});


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async (req, res, next) => {
    try {
        const results = await User.messagesFrom(req.query.username);
        return res.json({ messages: results.rows });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;