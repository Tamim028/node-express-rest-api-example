const debug = require('debug')('app:startup'); //'app:startup' means - namespace for debugging configure "export DEBUG=app:startup" in terminal to see debug logs.

const config = require('config');
const express = require('express');
const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

//dynamic html to send as response, using pug
app.set('view engine', 'pug'); //npm install pug
app.set('views', './views'); //default path for views, optional

app.use(express.json()); 
app.use(logger);
app.use(express.urlencoded( {extended: true} )); //To understand JSON in body
app.use(express.static('public')); //Static resources folder, e.g. in browser http://localhost:PORT_NO/readme.txt to get the readme file 
app.use(helmet()); //Helps secure Express apps with various HTTP headers

const appEnv = app.get('env');

debug(`app env: ${appEnv}`); //In terminal, use "export NODE_ENV=ENV_NAME" where ENV_NAME = production / development

//configuration using npm config
debug('Application Name: ', config.get('name'));
debug('Mail  Server: ', config.get('mail.host'));
debug('Mail  Password: ', config.get('mail.password')); //it will come from config/custom-environment-variables after matching with the KEY we exported as export "currentApp_password=1234" in terminal

if( appEnv === 'development'){ 
    app.use(morgan('tiny'))
    debug('MORGAN logger enabled for - DEVELOPMENT...');
} 


const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
];

//GET http://localhost:PORT_NO/
app.get('/', (req, res) => {
    debug('Event: index.js -> GET home.');
    // return res.send('Home!!!');
    return res.render('index', {title: "Node App", message: "Hello World"});
});

//GET http://localhost:PORT_NO/api/courses
app.get('/api/courses', (req, res)=>{
    debug('Event: index.js -> GET all courses, count = ', courses.length);
    return res.send(courses);
});

//GET http://localhost:PORT_NO/api/courses/ID
app.get('/api/courses/:id', (req, res)=> {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    
    if(!course) return res.status(404).send('The course with given ID was not found');
    
    debug('Event: index.js -> GET course: ', course);
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
    debug('Event: index.js -> POST course: ', course);
    return res.send(course)
});

//PUT http://localhost:PORT_NO/api/courses/ID
//In request body, {"name": "new name with more than 3 characters"}
app.put('/api/courses/:id', (req, res)=>{

    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course) return res.status(404).send('The course with the give ID was not found.');
    

    if(req.body.name.length < 3) return res.status(400).send('Course name required and minimum 3 characters long');
    
    debug('Event: index.js -> PUT course: ', course);
    course.name = req.body.name
    return res.send(course);
});

//DELETE http://localhost:PORT_NO/api/courses/ID
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the give ID was not found.');
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    debug('Event: index.js -> DELETE course: ', course);
    return res.send(course);
});

const port = process.env.PORT || 3000

app.listen(port, () => {
    debug(`Listening on port ${port}...`);
});