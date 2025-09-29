const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        let user = await User.findById(decoded.Id._id);
        if (user.status == "Banned") {
            console.log("User is Banned");
            return res.redirect('/login');
        }
        else {
            next();
        }

    } catch (err) {
        return res.redirect('/login');
    }
};

module.exports = auth;