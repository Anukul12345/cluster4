const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session & Passport
app.use(session({
    secret: 'secretKey123',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// In-memory storage
const users = [];
let vehicles = [];
let idCounter = 1;

// Passport Strategy
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) return done(null, false, { message: 'User not found' });
    if (user.password !== password) return done(null, false, { message: 'Wrong password' });
    return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// ========== Routes ==========

// Login
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

// Register
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.send('User already exists');
    }
    users.push({ id: Date.now(), username, password });
    res.redirect('/login');
});

// Logout
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

// Home/Vehicle list (protected)
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', { vehicles });
});

// Add new vehicle (form)
app.get('/vehicles/new', isAuthenticated, (req, res) => {
    res.render('new');
});
app.post('/vehicles', isAuthenticated, (req, res) => {
    const { model, brand, year } = req.body;
    vehicles.push({ id: idCounter++, model, brand, year });
    res.redirect('/');
});

// Edit vehicle
app.get('/vehicles/:id/edit', isAuthenticated, (req, res) => {
    const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
    if (!vehicle) return res.send('Vehicle not found');
    res.render('edit', { vehicle });
});
app.post('/vehicles/:id', isAuthenticated, (req, res) => {
    const vehicle = vehicles.find(v => v.id === parseInt(req.params.id));
    if (vehicle) {
        const { model, brand, year } = req.body;
        vehicle.model = model;
        vehicle.brand = brand;
        vehicle.year = year;
    }
    res.redirect('/');
});

// Delete vehicle
app.post('/vehicles/:id/delete', isAuthenticated, (req, res) => {
    vehicles = vehicles.filter(v => v.id !== parseInt(req.params.id));
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
