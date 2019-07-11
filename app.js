const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const socket = require('socket.io')

const PORT = process.env.PORT || 3000;
const app = express();

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(function(){console.log('MongoDB Connected...')})
    .catch(function(err){console.log(err)});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({extended: false}));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use(function(req, res, next) {
    res.locals.successMsg = req.flash('successMsg');
    res.locals.errorMsg = req.flash('errorMsg');
    res.locals.error = req.flash('error');
    next();
});

// Routes - (req, res) = request, response!
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use(express.static('public'))

const server = app.listen(PORT, function() {
    console.log(`Server on started on port ${PORT}`);
});

const io = socket(server)

io.on('connection', socket => {
    // connected

    socket.on('disconnect', () => {
        // disconnected
    })
})