// Notification Middleware
// Source: https://expressjs.com/en/guide/writing-middleware.html
const Message = require('../models/Message');

module.exports = async (req, res, next) => {
    if (req.user) {
        try {
            const unreadCount = await Message.countDocuments({
                receiver: req.user._id,
                read: false
            });
            res.locals.unreadCount = unreadCount;
        } catch (err) {
            console.error(err);
            res.locals.unreadCount = 0;
        }
    } else {
        res.locals.unreadCount = 0;
    }
    next();
};
