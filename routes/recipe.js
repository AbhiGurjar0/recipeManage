const express = require('express');
const upload = require('../config/multer');
const router = express.Router();
const Recipe = require('../models/recipe');
const isLoggedIn = require('../middlewares/isLoggedIn')
const User = require('../models/User');
const recipe = require('../models/recipe');

router.get('/', (req, res) => {
    res.render('recipe')
})

router.get('/create', (req, res) => {
    res.render('createRecipe')
})

router.post('/addrecipe', isLoggedIn, upload.single('file-upload'), async (req, res) => {
    const { title, price, ingre, description, category } = req.body;
    let recipe = await Recipe.create({
        images: req.file.buffer,
        title,
        price,
        description,
        ingredients: ingre,
        category,

    })
    let user = await User.findOneAndUpdate(
        { _id: req.user.Id.id },
        { $push: { Recepies: recipe._id } },
        { new: true }
    )
    res.redirect('/recipe/create');



})

router.post('/delete', isLoggedIn, async (req, res) => {
    try {

        const { recipeId } = req.body;
        let user = await User.findById(req.user.Id.id).populate('Recepies');
        await Recipe.findByIdAndDelete(recipeId);
        let Recepies = user.Recepies;
        user.Recepies = user.Recepies.filter(
            (rec) => rec._id.toString() !== recipeId.toString()
        );

        await user.save();
        return res.json({ success: true, message: "Recipe deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }

})


router.post('/edit-product/:Id', upload.single('file-upload'), async (req, res) => {

    const { title, price, description, category } = req.body;
    await Recipe.findOneAndUpdate(
        {
            _id: req.params.Id,

        },
        {
            // images: req.file.buffer,
            title,
            price,
            description,
            category,

        }, {
        new: true
    })
    res.redirect('/profile');

})
router.get('/details/:id', async  (req, res) => {
    const product = await Recipe.findById(req.params.id)
    res.render('recepieDetails',{product});

})
router.get('/edit-product/:Id', async (req, res) => {
    let product = await Recipe.findById(req.params.Id);
    let products = await Recipe.find();
    res.render('editRecipe', { product ,products });

})

module.exports = router;