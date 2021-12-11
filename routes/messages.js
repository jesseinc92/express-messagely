const express = require('express');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const ExpressError = require('../expressError');
const Message = require('../models/message');
const { ensureCorrectUser, ensureLoggedIn, authenticateJWT } = require('../middleware/auth');

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', authenticateJWT, ensureCorrectUser, async (req, res, next) => {
    try {
        const result = await Message.get(req.query.id);
        return res.json({ message: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const { to_username, body } = req.body;
        const result = await Message.create({ from_username: req.user.username, to_username, body });
        return res.json({ message: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureCorrectUser, async (req, res, next) => {
    try {
        const result = await Message.markRead(req.query.id);
        return res.json({ message: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;