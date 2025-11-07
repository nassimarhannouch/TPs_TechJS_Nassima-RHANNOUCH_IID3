// app.js - Application Express.js avec authentification
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Configuration MongoDB
mongoose.connect('mongodb://localhost:27017/tp2_auth')
  .then(() => console.log(' MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));
  
// Schéma utilisateur
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Configuration Express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Configuration session
app.use(session({
  secret: 'votre_secret_key_ici',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 heures
}));

// Configuration Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Nom d\'utilisateur incorrect' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Mot de passe incorrect' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware pour vérifier l'authentification
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Données des livres (stockées localement)
const books = [
  { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', year: 1943 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 3, title: 'L\'Étranger', author: 'Albert Camus', year: 1942 },
  { id: 4, title: 'Harry Potter à l\'école des sorciers', author: 'J.K. Rowling', year: 1997 },
  { id: 5, title: 'Le Seigneur des Anneaux', author: 'J.R.R. Tolkien', year: 1954 }
];

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Page d'inscription
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.render('register', { error: 'Tous les champs sont requis' });
    }

    if (password !== confirmPassword) {
      return res.render('register', { error: 'Les mots de passe ne correspondent pas' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render('register', { error: 'Nom d\'utilisateur ou email déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: 'Erreur lors de l\'inscription' });
  }
});

// Page de connexion
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login'
}));

// Page des livres (protégée)
app.get('/books', isAuthenticated, (req, res) => {
  res.render('books', { 
    user: req.user,
    books: books
  });
});

// Déconnexion
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});