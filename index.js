const express = require('express');
const port = 7000;
const db = require('./config/mongoose');
const Task = require('./models/task');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static('./public'));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Route to render the homepage with tasks
app.get('/', function(req, res) {
    Task.find({}, function(err, tasks) {
        if (err) {
            console.log('Error in fetching tasks from db', err);
            return res.status(500).send('Internal Server Error');
        }

        return res.render('home', {
            title: "Home",
            task: tasks
        });
    });
});

// Route to create a new task
app.post('/create-task', function(req, res) {
    Task.create({
        description: req.body.description,
        category: req.body.category,
        date: req.body.date
    }, function(err, newTask) {
        if (err) {
            console.log('Error in creating task', err);
            return res.status(500).send('Internal Server Error');
        }

        return res.redirect('back');
    });
});

// Route to delete tasks
app.get('/delete-task', function(req, res) {
    const ids = Object.keys(req.query);

    ids.forEach(id => {
        Task.findByIdAndDelete(id, function(err) {
            if (err) {
                console.log('Error in deleting task', err);
            }
        });
    });

    return res.redirect('back');
});

// Start the server
app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
