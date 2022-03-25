require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const findOrCreate = require('mongoose-findorcreate')
const {User} = require('./db/models')
const {usersRoute} = require('./routes/users')
const {postsRoute} = require('./routes/posts')
const {commnetsRoute} = require('./routes/posts/comments')

const app = express()

app.set('view engine', 'hbs')
app.use('/', express.static(__dirname + '/public'))
app.use('/images', express.static(__dirname + '/images'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/users', usersRoute)
app.use('/api/posts', postsRoute)
app.use('/api/comments', commnetsRoute)

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));
  
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
            googleId: profile.id,
            username:profile.displayName,
            email: profile._json.email,
            profilePic: profile._json.picture
        }, 
            function (err, user) {
                return cb(err, user);
        });
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID_FB,
    clientSecret: process.env.CLIENT_SECRET_FB,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ facebookId: profile.id}, function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }
));

app.get("/", function(req, res){
    res.render("start");
});

app.get("/auth/google",
    passport.authenticate('google', { scope: ["profile", "email"] })
);

app.get("/auth/google/secrets",
    passport.authenticate('google', { failureRedirect: "/login" }),
    function(req, res) {
        // Successful authentication, redirect to secrets.
        res.redirect("/secrets");
    }
);

app.get('/auth/facebook', 
    passport.authenticate('facebook')
);

app.get('/auth/facebook/secrets',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/secrets')
    }
);

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/secrets", function(req, res){
    User.findById(req.user.id, function(err,foundUser){
        if (err) {
            res.redirect('/')
            console.log(err);
        } else {
            if (foundUser) {
                // console.log(foundUser)
                res.render("home", {name: foundUser.username, image: foundUser.profilePic, _id: req.user.id})
            }
        }
    })
});

app.get("/submit", function(req, res){
    if (req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.post("/submit", function(req, res){
    const submittedSecret = req.body.secret;
    //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
    // console.log(req.user.id);
    User.findById(req.user.id, function(err, foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(function(){
                res.redirect("/secrets");
                });
            }
        }
    });
});

app.post("/register", function(req, res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if (err) {
        console.log(err);
        } else {
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secrets");
        });
        }
    });
});

let db = mongoose.connection;

    
if(db) {
    app.listen(3000, () => {
        console.log("server started on port http://localhost:3000")
    })
}
else {
    console.log("error connecting db");
}


