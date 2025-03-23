const { json } = require('express');
const jwt = require('jsonwebtoken');
const secret = "E-com";

function setUser(user){
    return jwt.sign(
        {
        _id: user._id,
        email: user.email,
    }, 
    secret,
);
}
function getUser(id){
    return jwt.verify(id, secret);
}
module.exports = {
    setUser,
    getUser,
}




