const express = require('express')
const bodyParser= require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const link = '<a class="link2" href="/auth/logout">Sign Out</a>'
const path = require('path')
const app = express()


require('./helpers/auth')
require('dotenv/config')

//middlewares
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(session({
    secret:'mySecret',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));


function isLoggedIn(req,res,next){
    req.user ? next() : res.status(401)
}



app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'./public','index.html'))
})

app.get('/auth/google',
    passport.authenticate('google',{scope:
        ['email','profile']
    }
));

// app.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//       res.redirect('/success');
//     }
//   );

app.get('/auth/google/callback',
    passport.authenticate('google',{
        successRedirect:'/success',
        failureRedirect:'/failure'
}));

app.get('/success', isLoggedIn, (req,res)=>{
    let name = req.user.displayName
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Link Example</title>
            </head>
            <body>
                Hello ${name}! 
                ${link}
            </body>
        </html>
    `)
});

app.get('/failure', isLoggedIn, (req,res)=>{
    res.send('Something went wrong on our side!')
});

app.get('/auth/logout', (req,res)=>{
    req.session.destroy()
    res.send('See you again!')
})












mongoose.connect('mongodb://127.0.0.1:27017/eshop_database')
.then(() => {
    console.log('Connected to MongoDB...');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});
const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log(`App is running on port ${port}`)
})