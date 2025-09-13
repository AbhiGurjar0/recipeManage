const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn')
const Recipe = require('../models/recipe')
const router = express.Router();
const recipe = require('./recipe')
const User = require('../models/User');
const admin = require('./admin')


router.post('/login', loginUser);
router.post('/register', registerUser);

router.use('/recipe', recipe);
router.use('/admin',admin)
router.get('/', (req, res) => {
    res.render('Home');
})

router.get('/profile', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user.Id.id).populate('Recepies');
    const recipe = user.Recepies;

    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render('userProfile', { user, orders: [], transactions: [], addresses: [], recipe });
})

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { name } = req.body;
    let userDetails = await User.findById(req.params.id);
    let user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { name },
        { new: true, runValidators: true }
    );
    res.redirect('/profile');
})

router.get('/user/search', async (req, res) => {
    const value = req.query.query;
    let Recepies = await Recipe.find();
    Recepies = Recepies.filter((rec) => (rec.title == value || rec.category == value))
    res.render("search", { recipe: Recepies });


})

// GET /recipes?category=...&minPrice=...&maxPrice=...&ingredient=...
router.get('/recipes', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, ingredient } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (ingredient) {
            filter.ingredients = { $regex: ingredient, $options: "i" }; // case-insensitive search
        }

        const recipes = await Recipe.find(filter);

        res.json({ success: true, recipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
router.post('/user/addFav', isLoggedIn, async (req, res) => {
    const { Id } = req.body;
    await User.findOneAndUpdate(
        { _id: req.user.Id.id },
        { $push: { favorite: Id } },
        { new: true }
    )

    res.json({ success: true });

})



router.get('/login', (req, res) => {
    res.render('login');
})




module.exports = router;