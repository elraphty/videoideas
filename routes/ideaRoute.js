let router = require('express').Router();
let Idea = require('../models/Idea');

// REQUIRE AUTHETICATION
let isAuthenticated = require('../controllers/auth');

// INDEX ROUTE
router.get('/', isAuthenticated, (req, res, next) => {
    Idea.find({ user: req.user._id })
        .sort({ date: -1 })
        .then(ideas => {
            res.render('ideas/view', {
                ideas
            });
        })
        .catch(err => {
            console.log(err);
        });
});

// ADD GET ROUTE
router.get('/add', isAuthenticated, (req, res, next) => {
    res.render('ideas/add', {
        errors: null,
        title: null,
        details: null
    });
});

// ADD IDEA POST ROUTE
router.post('/add', (req, res, next) => {
    /*
    Simple form validation
    */
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user._id
        }

        new Idea(newIdea)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
            .catch(err => {
                console.log(err);
            });
    }

});

// EDIT IDEA GET ROUTE
router.get('/edit/:id', isAuthenticated, (req, res, next) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea,
                    errors: null
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

// EDIT IDEA UPDATE ROUTE
router.put('/edit/:id', (req, res, next) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            // new values
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.user = req.user._id;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                });
        });
});

// DELETE IDEA ROUTE
router.delete('/delete/:id', (req, res, next) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        });
});

module.exports = router;