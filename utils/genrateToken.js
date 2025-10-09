const jwt = require('jsonwebtoken');

const generateToken = (Id,email) => {
    let token = jwt.sign({ Id, email }, process.env.JWT_KEY, { expiresIn: '7d' });
    return token;
}


module.exports = generateToken;