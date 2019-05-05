const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// map global promise
mongoose.Promise = global.Promise;

//Mongoose connection
mongoose.connect('mongodb://localhost/notes-app-dev-db', {
    useNewUrlParser: true
})
.then( () => console.log('Mongodb Connected') )
.catch( err => console.log(err) );

//Load model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//handlebar middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 5000;
 
//Index route
app.get('/', (req,res) => {
    const title = 'Welcome';
    res.render('index', {
        title : title
    });
});

//About route
app.get('/about', (req,res) => {
    res.render('about');
});

app.get('/ideas/add', (req,res) => {
    res.render('ideas/add');
});

app.post('/ideas', (req,res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({
            text:'Please add a title'
        });
    }
    if(!req.body.details){
        errors.push({
            text:'Please add some details'
        });
    }

    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title : req.body.title,
            details : req.body.details
        });
    }else {
        res.send('passed');
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});