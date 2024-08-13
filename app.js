const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
require('dotenv').config(); // Load environment variables

const upload = multer({ dest: './public/uploads/' });
const app = express();
const PORT = process.env.PORT || 5000;
const saltRounds = 4;
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shambaafrik'
});

db.connect(function(err) {
    if (err) {
        return console.error('error:' + err.message);
    }
    console.log('Connected to MySql server.');
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/profile', express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secretword",
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.isLoggedIn = true;
        res.locals.userId = req.session.userId;
    } else {
        res.locals.isLoggedIn = false;
    }
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/products', (req, res) => {
    res.render('products');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    let user = req.body;
    if (user.password !== user.confirmpassword) {
        res.render('signup', { error: "Password and Confirm Password mismatch", user: user });
        return;
    }
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) {
            res.render('signup', { error: "Something went wrong" });
        } else {
            db.query(`SELECT email FROM users WHERE email = ?`, [user.email], (err, results) => {
                if (err) {
                    console.log(err);
                    res.render('signup', { error: "Something went wrong. Try again." });
                } else if (results.length > 0) {
                    res.render('signup', { error: "Email already registered. Check your email or log in.", user: user });
                } else {
                    db.query(`INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`,
                        [user.firstname, user.lastname, user.email, hash], (err) => {
                            if (err) {
                                console.log(err);
                                res.render('signup', { error: "Something went wrong. Try again." });
                            } else {
                                res.render('login', { message: "Registration successful. Login." });
                            }
                        });
                }
            });
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    let user = req.body;
    db.query(`SELECT * FROM users WHERE email = ?`, [user.email], (err, result) => {
        if (err) {
            console.log(err);
            res.render('login', { error: "Internal server error. Contact Admin." });
            return;
        }
        if (result.length > 0) {
            bcrypt.compare(user.password, result[0].password, function(err, matched) {
                if (matched) {
                    req.session.isLoggedIn = true;
                    req.session.role = result[0].role;
                    req.session.userId = result[0].userId;
                    req.session.user = result[0];
                    res.redirect('/home');
                } else {
                    res.render('login', { error: "Wrong password or email.", user: user });
                }
            });
        } else {
            res.render('login', { error: "Email not registered. Check email or Sign Up." });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/profile/:userId', (req, res) => {
    console.log(req.params.userId);
    db.query(`SELECT * FROM users WHERE userId = ?`, [Number(req.params.userId)], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result[0]);
            res.render('profile', { user: result[0] });
        }
    });
});

app.post('/search', (req, res) => {
    var searchQuery = req.body.search;
    console.log(searchQuery);
    db.query(`SELECT * FROM products WHERE name LIKE ?`, [`%${searchQuery}%`], (error, results) => {
        if (error) throw error;
        console.log(results);
        res.render('search-results', { results: results });
    });
});

app.get('/admin-dashboard', (req, res) => {
    if (req.session.role === 'admin') {
        res.render('admin-dashboard');
    } else {
        res.send("Warning. Only admin is allowed.");
    }
});

app.get("/inventory", (req, res) => {
    if (req.session.role === 'admin') {
        db.query("SELECT * FROM products", (err, data) => {
            if (err) {
                console.log(err);
                res.send("Error fetching data from the database.");
            } else {
                res.render("inventory", { data: data });
            }
        });
    } else {
        res.send("Warning. Only admin is allowed.");
    }
});

app.get("/users", (req, res) => {
    if (req.session.role === 'admin') {
        db.query("SELECT userId, firstName, lastName, email, dateOfRegistration FROM users", (err, data) => {
            if (err) {
                console.log(err);
                res.send("Error fetching data from the database.");
            } else {
                res.render("users", { data: data });
            }
        });
    } else {
        res.send("Warning. Only admin is allowed.");
    }
});

// Admin login route
app.get('/admin-login', (req, res) => {
    res.render('admin-login');
});

app.post('/admin-login', (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        req.session.isLoggedIn = true;
        req.session.role = 'admin';
        res.redirect('/admin-dashboard');
    } else {
        res.render('admin-login', { error: "Invalid admin credentials." });
    }
});

app.post('/delete', (req, res) => {
    const userId = req.body.id;
  
    const query = 'DELETE FROM users WHERE userId = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/users'); // Redirect to the page where you list users
    });
});
  
  app.get('/thank-you', (req, res) => {
    res.render('thank-you');
  });

app.get('/soko', (req, res) => {
    res.render('soko');
});

app.post('/soko', upload.single('imageUrl'), (req, res) => {
    // req.file now contains the uploaded file
    // req.body contains the entire request body
    const { name, description, price, quantity, category } = req.body;
    const imageUrl = req.file;
  
    if (imageUrl) {
      const uploadPath = __dirname + '/public/uploads/' + imageUrl.filename;
      // Since imageUrl is already uploaded to the destination, you don't need to call mv
      // You can directly use the uploaded file
      const query = 'INSERT INTO Listings (name, description, price, quantity, category, imageUrl) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(query, [name, description, price, quantity, category, '/uploads/' + imageUrl.filename], (err, result) => {
        if (err) {
          console.error('Failed to insert listing:', err);
          return res.status(500).send('Failed to list product');
        }
        // res.redirect('/soko');
        res.status(201).send('Product listed successfully!');
      });
    } else {
      res.status(400).send('No file uploaded');
    }
  });

  app.get('/listings', (req, res) => {
    const query = 'SELECT * FROM Listings';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching listings:', err);
        return res.status(500).send('Error fetching listings');
      }
      res.render('listings', { listings: results });
    });
  });

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
