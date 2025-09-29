const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn')
const Recipe = require('../models/recipe')
const router = express.Router();
const recipe = require('./recipe')
const User = require('../models/User');

router.get('/', async (req, res) => {
    let user = await User.find();
    let recipe = await Recipe.find();
    res.render('admin', { user, recipe });
})
router.get('/userDetails/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('viewUser', { user });

});

//ban User
router.post('/banUser/:Id', async (req, res) => {

    await User.findByIdAndUpdate(req.params.Id, {
        status: "Banned",
    }, {
        new: true,
    });
    res.redirect('/admin');

})

//delete User


router.post('/deleteUser/:Id', async (req, res) => {

    await User.findByIdAndDelete(req.params.Id, {
        new: true,
    });
    res.redirect('/admin');

})
//Approve user
router.post('/approveUser/:Id',async (req,res)=>{
    await User.findByIdAndUpdate(req.params.Id,{
        status:"Approved",
    },{
        new:true,
    })
    res.redirect('/admin');
})

//delete Recipe

router.delete('/deleteRecipe/:Id',async (req,res)=>{
    await Recipe.findByIdAndDelete(req.params.Id);
    return res.redirect('/admin');
})










module.exports = router;