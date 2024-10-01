const express = require('express');
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

app.use(express.json()); 
app.use(logger);
app.use(express.urlencoded( {extended: true} )); //To understand JSON in body
app.use(express.static('public')); //Static resources folder, e.g. in browser http://localhost:PORT_NO/readme.txt to get the readme file 
app.use(helmet()); //Helps secure Express apps with various HTTP headers
app.use(morgan('tiny'))

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
];

app.use(function(req,res,next){
    console.log('Authenticating...');
    next();
});


//GET http://localhost:PORT_NO/
app.get('/', (req, res) => {
    console.log('Event: index.js -> GET home.');
    return res.send('Home!!!');
});

//GET http://localhost:PORT_NO/api/courses
app.get('/api/courses', (req, res)=>{
    console.log('Event: index.js -> GET all courses, count = ', courses.length);
    return res.send(courses);
});

//GET http://localhost:PORT_NO/api/courses/ID
app.get('/api/courses/:id', (req, res)=> {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    
    if(!course) return res.status(404).send('The course with given ID was not found');
    
    console.log('Event: index.js -> GET course: ', course);
    return res.send(course);
});

//POST http://localhost:PORT_NO/api/courses
//In request body, {"name": "new name with more than 3 characters"}
app.post('/api/courses', (req, res)=>{

    if(!req.body.name || req.body.name.length < 3) return res.status(400).send('Name required and minimum 3 characters long');
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    console.log('Event: index.js -> POST course: ', course);
    return res.send(course)
});

//PUT http://localhost:PORT_NO/api/courses/ID
//In request body, {"name": "new name with more than 3 characters"}
app.put('/api/courses/:id', (req, res)=>{

    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course) return res.status(404).send('The course with the give ID was not found.');
    

    if(req.body.name.length < 3) return res.status(400).send('Course name required and minimum 3 characters long');
    
    console.log('Event: index.js -> PUT course: ', course);
    course.name = req.body.name
    return res.send(course);
});

//DELETE http://localhost:PORT_NO/api/courses/ID
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the give ID was not found.');
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    console.log('Event: index.js -> DELETE course: ', course);
    return res.send(course);
});

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});