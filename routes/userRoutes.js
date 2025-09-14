const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn')
const Recipe = require('../models/recipe')
const router = express.Router();
const recipe = require('./recipe')
const User = require('../models/User');
const admin = require('./admin');
const feed = require('../models/feed')


router.post('/login', loginUser);
router.post('/register', registerUser);

router.use('/recipe', recipe);
router.use('/admin', admin)
router.get('/', (req, res) => {
    res.render('Home');
})
router.get('/activity', isLoggedIn, async (req, res) => {
    let videos = await feed.find().populate('userId', 'name').sort({ createdAt: -1 }).limit(20);
    // let username = await User.findById(req.user.Id.id).name;
    res.render('activity', { recipe:videos });
});
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
// GET /user/search?q=lasagna&category=Italian&minPrice=5&maxPrice=20&ingredient=cheese
router.get('/user/search', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, ingredient } = req.query;

        // Build Mongo filter dynamically
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (ingredient) {
            filter.ingredients = { $regex: ingredient, $options: "i" };
        }


        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
                { ingredients: { $regex: q, $options: "i" } }
            ];
        }

        const recipes = await Recipe.find(filter);

        res.render('search', { recipe: recipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET /recipes?category=...&minPrice=...&maxPrice=...&ingredient=...
router.get('/recipes', async (req, res) => {
    console.log("Query Params:", req.query); // Debugging line
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
        console.log("Filter Object:", filter); // Debugging line
        const recipes = await Recipe.find(filter);
        console.log("Found Recipes:", recipes); // Debugging line

        res.json({ success: true, recipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
router.post('/user/addFav', isLoggedIn, async (req, res) => {
    try {
        const { Id } = req.body;
        const userId = req.user.Id.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }


        const isFavorite = user.favorite.includes(Id);

        if (isFavorite) {

            await User.findByIdAndUpdate(userId, { $pull: { favorite: Id } });
            return res.json({ success: false, message: "Removed from favorites" });
        } else {

            await User.findByIdAndUpdate(userId, { $addToSet: { favorite: Id } });
            return res.json({ success: true, message: "Added to favorites" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



router.get('/login', (req, res) => {
    res.render('login');
})




module.exports = router;