const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyUser = require("../../middleware/verifyUser");
const { check, validationResult } = require('express-validator');
const User = require('../../models/userModal');

// @route   [GET] api/auth
// @desc    Get User from the token
// @access  public
router.get('/', verifyUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   [POST] api/auth
// @desc    register user and send the token
// @access  public
router.post('/', [
    check('firstName', 'firstname is required.').not().isEmpty(),
    check('lastName', 'lastname is required.').not().isEmpty(),
    check('email', 'please include a valid email').isEmail(),
    check('password', 'please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { firstName, lastName, email, password } = req.body;
    // See if the user exists
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ errors: [{ message: 'User already exists' }] });
        const avatar = gravatar.url(email, {
            s: '200', r: 'pg', d: 'mm'
        });
        const salt = await bcrypt.genSalt(10);
        user = new User({
            firstName, lastName, email, avatar, password
        });
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

// @route   [POST] api/auth/login
// @desc    login user and send the token
// @access  public
router.post('/login',
    [
        check('email', 'please include a valid email').not().isEmpty().isEmail(),
        check('password', 'please enter a password with 6 or more characters').not().isEmpty()
    ], async (req, res) => {
        try {
            const { email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (!existingUser)
                return res
                    .status(401)
                    .json({ errors: [{ message: 'Invalid credentials' }] });
            const passwordCorrect = await bcrypt.compare(password, existingUser.password);
            if (!passwordCorrect) {
                return res
                    .status(401)
                    .json({ errors: [{ message: 'Invalid credentials' }] });
            }

            const payload = {
                user: {
                    id: existingUser.id
                }
            }
            jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });

        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Server Error');
        }
    })

module.exports = router;