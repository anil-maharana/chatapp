const verifyUser = require("../../middleware/verifyUser");
const Message = require("../../models/messageModal");
const Room = require('../../models/roomModal');
const router = require("express").Router();

// @route   [POST] api/messages
// @desc    create a message
// @access  public 
router.post('/', verifyUser, async (req, res) => {
    try {
        console.log("save message called");
        const { roomId, messageBody } = req.body;
        //validation
        if (!roomId || !messageBody)
            return res
                .status(400)
                .json({ field: 'all', errorMessage: "Please enter all the required fields." });

        //save a new user account to the DB
        const newMessage = new Message({
            roomId, messageAuthor: req.user.id, messageBody, createdOn: Date.now()
        });

        const savedMessage = await newMessage.save();
        const _resData = await Message.findById(savedMessage.id).populate('messageAuthor', '-password');
        res.json({
            data: _resData,
            message: 'message saved Sucessfully'
        }).send();

    } catch (error) {
        console.error(error);
        res.status(500).json({
            data: null,
            message: "Something went wrong"
        }).send(); //500 - Internal Server Error
    }
});


// @route   [GET] api/messages/:roomId
// @desc    Get all messages from a room
// @access  public 
router.get('/:roomId', verifyUser, async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!roomId) return res.status(401).json({ message: 'Parameter is missing' });
        // const _rooms = await Room
        //     .findById({ _id: roomId })
        //     .populate('users', '-password')
        //     .populate('messages')
        //     .select('messages')
        // res.send(_rooms);
        const _messages = await Message.find({ roomId })
            .populate('messageAuthor', '-password')
            .sort({ createdOn: 1 });
        res.send(_messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong. Bad Request.' })
    }
});

module.exports = router;