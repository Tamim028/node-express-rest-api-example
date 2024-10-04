const express = require('express');
const router = express.Router() //for allowing multiple routes
const debug = require('debug')('app:http');

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
];


//GET http://localhost:PORT_NO/api/courses
router.get('/', (req, res)=>{
    debug('GET all courses, count = ', courses.length);
    return res.send(courses);
});

//GET http://localhost:PORT_NO/api/courses/ID
router.get('/:id', (req, res)=> {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    
    if(!course) return res.status(404).send('The course with given ID was not found');
    
    debug('GET course: ', course);
    return res.send(course);
});

//POST http://localhost:PORT_NO/api/courses
//In request body, {"name": "new name with more than 3 characters"}
router.post('/', (req, res)=>{

    if(!req.body.name || req.body.name.length < 3) return res.status(400).send('Name required and minimum 3 characters long');
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    debug('POST course: ', course);
    return res.send(course)
});

//PUT http://localhost:PORT_NO/api/courses/ID
//In request body, {"name": "new name with more than 3 characters"}
router.put('/:id', (req, res)=>{

    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course) return res.status(404).send('The course with the give ID was not found.');
    

    if(req.body.name.length < 3) return res.status(400).send('Course name required and minimum 3 characters long');
    
    debug('PUT course: ', course);
    course.name = req.body.name
    return res.send(course);
});

//DELETE http://localhost:PORT_NO/api/courses/ID
router.delete('/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the give ID was not found.');
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    debug('DELETE course: ', course);
    return res.send(course);
});

module.exports = router;