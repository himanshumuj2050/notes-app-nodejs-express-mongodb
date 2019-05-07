if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb+srv://dbname:dbpass@notesappcluster-kjhrv.mongodb.net/test?retryWrites=true'
    }
}else{
    module.exports = {
        mongoURI: 'mongodb://localhost/notes-app-dev-db'
    }
}