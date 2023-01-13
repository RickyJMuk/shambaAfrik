const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000
const saltRounds = 4;
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shambaafrik'
})

db.connect(function(err) {
    if (err) {
        return console.error('error:' + err.message);
    }
    console.log('Connected to MySql server.')
})

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use('/profile', express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: "secretword",
    resave: false,
    saveUninitialized: false
})
)

app.use((req, res, next)=>{
    if(req.session.userId) {
        res.locals.isLoggedIn = true
        res.locals.userId = req.session.userId
    }else{
        res.locals.isLoggedIn = false
    }
    next()
});

app.get('/', (req, res)=>{
    res.render('index')
});

app.get('/products', (req, res)=>{
    res.render('products')
});

app.get('/about', (req, res)=>{
    res.render('about')
});


app.get('/signup', (req, res)=>{
    res.render('signup')
});
app.post('/signup', (req, res)=>{
    let user = req.body
    if(user.password !== user.confirmpassword) {
        res.render('signup', {error: "Password and Confirm Password mismatch", user: user})
        return
    }
    bcrypt.hash(user.password, saltRounds, function(err, hash){
        if(err) {
            res.render('signup', {error: "Something went wrong"})
        }else{
            db.query(`SELECT email FROM users WHERE email = '${user.email}'`, (err, results)=>{
                if(err) {
                    console.log(err)
                    res.render('signup', {error: "Something went wrong. Try again."})
                }
                if(results.length > 0) {
                    res.render('signup', {error: "Email already registered. Check your email or log in.", user: user})
                }else{
                    db.query(`INSERT INTO users(firstName, lastName, email, password) VALUES('${user.firstname}', '${user.lastname}', '${user.email}', '${hash}')`, (err)=> {
                        if(err) {
                            console.log(err)
                            res.render('signup', {error: "Something went wrong. Try again."})
                        }else{
                            res.render('login', {message: "Registration successful. Login."})
                        }
                    })
                }
            })
        }
    });
})

app.get('/login', (req, res)=>{
    res.render('login')
})
app.post('/login', (req, res)=>{
    let user = req.body
    db.query(`SELECT * FROM users WHERE email = '${user.email}'`, (err, result)=>{
        if(err) {
            console.log(err)
            res.render('login', {error: "Internal sever error. Contact Admin."})
            return
        }
        if(result.length > 0) {
            bcrypt.compare(user.password, result[0].password, function(err, matched) {
                if(matched) {
                    req.session.isLoggedIn = true
                    req.session.userId = result[0].userId
                    req.session.user = result[0]
                    res.redirect('/home')
                }else{
                    res.render('login', {error: "Wrong password or email.", user: user})
                    
                }
            });
        }else{
            res.render('login', {error: "Email not registered. Check email or Sign Up."})
        }
    })
});

app.get('/logout', (req, res) => {
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
})

app.get('/home', (req, res)=>{
    res.render('home')
})

app.get("/profile/:userId", (req, res)=>{
    console.log(req.params.userId)
    db.query(`SELECT * FROM users WHERE userId = ${Number(req.params.userId)}`, (err, result)=>{
        if(err) {
            console.log(err)
        }else{
            console.log(result[0])
            res.render('profile', {user: result[0]})
        }
    })
})

app.post('/search', (req, res)=> {
    var searchQuery = req.body.search;
    console.log(searchQuery)
    // Use MySQL to search the database for the search query
    db.query(`SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`, (error, results)=> {
      if (error) throw error;
      // Render the search results page, passing the results as a variable
      console.log(results)
      res.render('search-results', {results: results});
    });
});

app.get('/admlog', (req, res)=>{
    res.render('admlog')
})

app.get("/admin", (req, res) => {
    db.query("SELECT * FROM products", (err, data) => {
        if (err) {
            console.log(err);
            res.send("Error fetching data from the database.");
        } else {
            res.render("admin", { data: data });
        }
    });
    
    // db.query(`SELECT users  FROM users WHERE role = 'admin'`, (result)=> {
    //     if (result) {
    //         res.render('admin')
    //     }
    // })
});

// app.post('/admin', (req, res)=> {
//     db.query(`SELECT role FROM users WHERE role = admin`, (result, error)=>{
//         if(result) {
//             res.render('admin')
//             return
//         }else{
//             console.log(error)
//             res.send("Warning. Only admin is allowed.")
//         }
//     });

// })



app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`))