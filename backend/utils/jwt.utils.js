// Imports
var jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = 'CLESECRETAMODIF';

// Exports functions
module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id,

        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    }
}