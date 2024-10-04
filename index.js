const debug = require('debug')('app:startup'); //'app:startup' means - namespace for debugging configure "export DEBUG=app:startup" in terminal to see debug logs.

const config = require('config');
const express = require('express');
const logger = require('./middleware/logger');
const helmet = require('helmet');
const morgan = require('morgan');
const courses = require('./routes/courses');
const home = require('./routes/home');
const app = express();

//dynamic html to send as response, using pug
app.set('view engine', 'pug'); //npm install pug
app.set('views', './views'); //default path for views, optional

app.use(express.json()); 
app.use(logger);
app.use(express.urlencoded( {extended: true} )); //To understand JSON in body
app.use(express.static('public')); //Static resources folder, e.g. in browser http://localhost:PORT_NO/readme.txt to get the readme file 
app.use(helmet()); //Helps secure Express apps with various HTTP headers
app.use('/api/courses', courses); //for any route with /api/courses use courses Router.
app.use('/', home);

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

const port = process.env.PORT || 3000

app.listen(port, () => {
    debug(`Listening on port ${port}...`);
});