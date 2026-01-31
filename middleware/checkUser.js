// Check User Middleware (for public pages)
// Tutorial: https://www.youtube.com/watch?v=SnoAwLP1a-0 (Node.js Auth Logic)
// Source: https://jwt.io/introduction
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check current user (for public pages)
exports.checkUser = async (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user) {
                // Check if token was issued before the last logout
                if (user.lastLogout) {
                    const lastLogoutTime = new Date(user.lastLogout).getTime() / 1000;
                    if (decoded.iat < lastLogoutTime) {
                        res.locals.user = null;
                        return next();
                    }
                }

                req.user = user;
                res.locals.user = user;
            } else {
                res.locals.user = null;
            }
        } catch (err) {

            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
};
