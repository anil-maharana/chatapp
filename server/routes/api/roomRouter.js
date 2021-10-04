const verifyUser = require("../../middleware/verifyUser");
const Room = require("../../models/roomModal");
const User = require("../../models/userModal");
const Message = require("../../models/messageModal");

const { check, validationResult } = require('express-validator');

const router = require("express").Router();

// @route   [POST] api/rooms/
// @desc    Add a new Room
// @access  private 
router.post('/', [
    check('roomName', 'Room Name is required.').not().isEmpty(),
    check('roomType', 'Room Type is required.').not().isEmpty(),
    check('users', 'Users are required.').not().isEmpty(),
], verifyUser, async (req, res) => {
    try {
        const { roomName, roomType, users } = req.body;
        //validation
        const existingRoom = await Room.findOne({ roomName });
        if (existingRoom)
            return res
                .status(400)
                .json({ field: 'roomName', errorMessage: "Room is already exists." })
                .send();
        //get all the userDetails
        const _users = await User.find({
            '_id': {
                $in: users
            },
        }).select('-password');
        const _createdBy = await User.findById({ _id: req.user.id }).select('-password');
        //save a new user account to the DB
        const newRoom = new Room({
            roomName, roomType, createdBy: _createdBy, users: _users, isActive: true
        });

        const savedRoom = await newRoom.save();
        res.json({
            data: savedRoom,
            message: 'New Room Created Sucessfully'
        })
            .send();

    } catch (error) {
        console.error(error);
        res.status(500).json({
            data: false,
            message: "Server Error. Something went wrong"
        }).send(); //500 - Internal Server Error
    }
});

// @route   [PUT] api/rooms/roomId
// @desc    update the Room details
// @access  private 
router.put('/:roomId', verifyUser, async (req, res) => {
    try {
        const { roomName,
            roomType,
            users
        } = req.body;
        const { roomId } = req.params;
        //validation
        if (!roomId) return res.status(400).json({ field: 'all', errorMessage: "Invalid Parameter." })
        if (!roomName || !roomType || !users)
            return res
                .status(400)
                .json({ field: 'all', errorMessage: "Please enter all the required fields." });
        const existingRoom = await Room.findOne({ _id: roomId });
        if (!existingRoom)
            return res
                .status(400)
                .json({ field: 'roomName', errorMessage: "unable to find the Room Details" })
                .send();
        //save a new user account to the DB
        Room.findByIdAndUpdate(existingRoom._id, {
            roomName, roomType, users, lastUpdated: Date.now()
        }, { new: true }, function (err, result) {
            if (err) {
                res.status(500).json({
                    data: err,
                    message: "Something went wrong"
                }).send();
            } else {
                // console.log(result);
                res.json({
                    data: result,
                    message: 'Room details updated Sucessfully'
                })
            }
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            data: false,
            message: "Something went wrong"
        }).send(); //500 - Internal Server Error
    }
})

// @route   [GET] api/rooms/id
// @desc    Get Room Details by ID
// @access  private 
router.get('/:id', verifyUser, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(401).json({ message: 'Parameter is missing' });
        const _rooms = await Room.findById({ _id: id })
            .populate('createdBy', '-password')
            .populate('users', '-password');
        res.send({ _rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Bad Request.' })
    }
})

// @route   [DELETE] api/rooms/roomId
// @desc    Delete a Room
// @access  private 
router.delete('/:roomId', verifyUser, async (req, res) => {
    try {
        const { roomId } = req.params;
        //validation
        if (!roomId) return res.status(400).json({ field: 'all', errorMessage: "Invalid Parameter." })
        Room.findByIdAndDelete(roomId, function (err, result) {
            if (err) {
                res.status(500).json({
                    data: err,
                    message: "Something went wrong"
                }).send();
            } else {
                return res.json(result)
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            data: false,
            message: "Something went wrong"
        }).send(); //500 - Internal Server Error
    }
})

// @route   [GET] api/rooms
// @desc    Get all Rooms
// @access  private 
router.get('/', verifyUser, async (req, res) => {
    try {
        // Room.aggregate([
        //     { $sort: { lastUpdated: -1 } }
        // ], function (err, result) {
        //     if (err) {
        //         res.status(500).json({
        //             data: err,
        //             message: "Something went wrong"
        //         }).send();
        //     } else {
        //         // console.log(result)
        //         res.json(result)
        //     }
        // })
        const _rooms = await Room.find()
            .populate('createdBy', '-password')
            .populate('users', '-password')
            // .populate('messages')
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


module.exports = router;