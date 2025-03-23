const User = require('../models/user');

const bcrypt = require('bcrypt');
const {setUser} = require('../service/auth');

async function handleUserSignup(req, res) {
    const {name, email, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
        name,
        email,
        password: hashedPassword,
    });
    return res.render('login');
}

async function handleUserLogin(req, res) {
    console.log("Login Request Received");
    const {email, password} = req.body;
    const user = await User.findOne({
        email,
    });
  

    if(!user) return res.render('login', {error: "Invalid username or password"});
    
    const isPasswordValid = await bcrypt.compare(password, user.password);


    if(!isPasswordValid) return res.render('login', {error: "Invalid username or password"});

    const token = setUser(user);
    // console.log("setuser")
    res.cookie('token', token);
    return res.redirect('/home');  
}


module.exports = {
    handleUserSignup,
    handleUserLogin,
}
 