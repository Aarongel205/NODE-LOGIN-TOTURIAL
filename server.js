const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { pool } = require("./dbConfig");

const PORT = process.env.PORT || 4000;

//middleware
app.set('view engine', 'ejs');
//allows to send data from frontend/client to server
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/', (req, res) => {
    res.render("index");
});

app.get('/users/register', (req, res) => {
    res.render("register");
});

app.get('/users/login', (req, res) => {
    res.render("login");
});

app.get('/users/dashboard', (req, res) => {
    res.render("dashboard", {user: "Aaron"})
});

app.post('/users/register', async (req, res) => {
    //get details from register rount/page
    let { name, email, password, confirmPass } = req.body;
    console.log({name, email, password, confirmPass});

    //Store errors and display it in register page
    let errors = [];

    //validator if info is null
    if(!name || !email || !password || !confirmPass){
        errors.push({message: "Please enter all fields"});
    }

    //validator for password length
    if(password.length < 6){
        errors.push({message: "Password should be at least 6"});
    }

    //confirm password validator
    if(password != confirmPass){
        errors.push({message: "Password do not match"})
    }

    //display errors
    if(errors.length > 0){
        res.render("register", { errors });
    }else{
        //form validation has passed

        //convert password into hashed password
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        
        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
                if (err){
                    throw err;
                }
                console.log(results.rows);

                if(results.rows.length > 0){
                    errors.push({message: "Email already registered"});
                    res.render('register', { errors })
                }
            }
        )
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});