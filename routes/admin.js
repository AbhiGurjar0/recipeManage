const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn')
const Recipe = require('../models/recipe')
const router = express.Router();
const recipe = require('./recipe')
const User = require('../models/User');

router.get('/', async (req, res) => {
    let user = await User.find();
    res.render('admin' ,{user});
})
router.get('/userDetails/:id', async (req,res)=>{
    const user = await User.findById(req.params.id);
    res.render('viewUser',{user});

});


module.exports = router;