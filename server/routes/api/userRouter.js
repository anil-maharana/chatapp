const router = require("express").Router();
const User = require('../../models/userModal');
const Room = require('../../models/roomModal');
const verifyUser = require("../../middleware/verifyUser");

const jwt = require('jsonwebtoken');


// @route   [GET] api/users
// @desc    Get all users
// @access  private 
router.get('/', verifyUser, async (req, res) => {
    try {
        const _allUsers = await User.find()
            .select('-password')
            .sort({ firstName: 1 });
        return res.json(_allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json("Something went wrong").send(); //500 - Internal Server Error
    }
});

// @route   [GET] api/users/myRooms
// @desc    Get all Rooms associated to loggedin user
// @access  private 
router.get('/myRooms', verifyUser, async (req, res) => {
    try {
        const _rooms = await Room.find()
            .populate('createdBy', '-password')
            .populate('users', '-password')
            .sort({ lastUpdated: -1 });
        return res.json(_rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            data: false,
            message: "Something went wrong"
        }).send(); //500 - Internal Server Error
    }
});

router.get('/getById/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) return res.json({ errorMessage: "Invalid Parameter" });
        // console.log(userId);
        const { _id, firstName, lastName, email } = await User.findById(userId);
        res.send({ _id, firstName, lastName, email });
    } catch (error) {
        // console.error(error);
        res.json(false).send();
    }
})

router.get('/getAssociatedRooms/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.json({ errorMessage: "Invalid Parameter" });
        const _rooms = await User.findAssociatedRooms(userId)
        res.send(_rooms);
    } catch (error) {
        console.error(error);
        res.json(false).send();
    }
})

module.exports = router;