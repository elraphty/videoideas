let router = require('express').Router();
let User = require('../models/Users');
let passport = require('passport');
let localStrategy = require('passport-local').Strategy;

// LOGIN ROUTE
router.get('/login', (req, res, next) => {
    res.render('users/login');
});

// REGISTER ROUTE
router.get('/register', (req, res, next) => {
    res.render('users/register', {
        errors: null
    });
});

// REGISTER POST ROUTE
router.post('/register', (req, res, next) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Passwords do not match' });
    }

    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        newUser.save()
            .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
            });
        res.redirect('/users/login');
    }
});

router.post('/login', passport.authenticate('local', {
    //successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true,
}),
    (req, res, next) => {
        req.flash('success_msg', 'You are now logged in');
        res.redirect('/ideas');
    }
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});

passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.getUserByUsername(email)
        .then(res => {
            if (!res) {
                return done(null, false, { message: 'Unknown User' });
            }
            else {
                User.comparePassword(password, res.password)
                    .then(isMatch => {
                        console.log('isMatch', isMatch);
                        if (isMatch) {
                            return done(null, res)
                        } else {
                            return done(null, false, { message: 'Invalid Password' })
                        }
                    })
                    .catch(err => {
                        return done(err);
                    });
            }
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
}));

router.get('/logout', (req, res, next) => {
    req.logOut();
    req.flash('success_msg', 'You have logout successfully');
    res.redirect('/users/login');
});

module.exports = router;