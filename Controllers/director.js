const Director = require('../Models/Director');
const mongoose = require('mongoose');


const createDirector = async (req, res) => {
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const newDirector = new Director({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        creationDate: Date.now()
    })
    if (isValidUser) {
    const director = await Director.findById(userId);
        if (director) {
            newDirector.save()
            .then((newDirectorCreated) => {
                return res.status(201).send(newDirectorCreated);
            })
            .catch((error) => {
                return res.status(500).send(error);
            })
        } else {
            return res.status(403).send('You\'re not allowed to create new director !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

const getDirector = async (req, res) => {
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    if (isValidUser) {
        const director = await Director.findById(userId);
        if (director) {
            return Director.find()
            .then((directorFound) => {
                return res.send(directorFound);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to the director data !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

const deleteDirector = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValiDirector = mongoose.isValidObjectId(id);
    const isValidUser = mongoose.isValidObjectId(userId);
    if (!isValiDirector) {
        return res.status(400).send("Director ID is not valid !");
    }
    if (isValidUser) {
        const director = await Director.findById(userId);
        if (director) {
            return Director.findByIdAndDelete(id)
            .then((directorToDelete) => {
                return res.send(`Director ${directorToDelete.firstname} ${directorToDelete.lastname} has been deleted !`);
            })
        } else {
            return res.status(403).send('You don\'t have access to the director data !');
        } 
    }else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

module.exports = {
    createDirector: createDirector,
    getDirector:getDirector,
    deleteDirector: deleteDirector
}