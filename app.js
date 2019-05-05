const express = require('express');
const exphbs = require('express-handlebars');
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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});