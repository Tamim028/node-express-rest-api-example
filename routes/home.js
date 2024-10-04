const express = require('express');
const router = express.Router();
const debug = require('debug')('app:http');

//GET http://localhost:PORT_NO/
router.get('/', (req, res) => {
    debug('GET home.');
    // return res.send('Home!!!');
    return res.render('index', {title: "Node App", message: "Hello World"});
});

module.exports = router