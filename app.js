const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const mongoose = require('mongoose');

const app = express();

// map global promise
mongoose.Promise = global.Promise;

//Mongoose connection
mongoose.connect('mongodb://localhost/notes-app-dev-db', {
    useNewUrlParser: true
})
    .then(() => console.log('Mongodb Connected'))
    .catch(err => console.log(err));

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

//method-override middleware
app.use(methodOverride('_method'))

const port = 5000;

//Index route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About route
app.get('/about', (req, res) => {
    res.render('about');
});


//notes index page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//add notes
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//edit note
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                ideas: idea
            });
        });
});

app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({
            text: 'Please add a title'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some details'
        });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas')
            })
    }
});


//edit form process (PUT request)
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                })
        })
});

//delete note
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({
        _id: req.params.id
    })
        .then(() => {
            res.redirect('/ideas');
        })
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});