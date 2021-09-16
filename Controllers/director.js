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
            return res.status(403).send('You don\'t have permission to create new director !');
        }
    } else {
        return res.status(400).send("le userId saisi n'est pas valide !");
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
        return res.status(400).send("le userId saisi n'est pas valide !");
    }
}



const deleteDirector = (req, res) => {
    const id = req.params.id;
    return Director.findByIdAndDelete(id)
    .then((directorToDelete) => {
        return res.send(`Director ${directorToDelete.firstname} ${directorToDelete.lastname} has been deleted !`);
    })
}

module.exports = {
    createDirector: createDirector,
    getDirector:getDirector,
    deleteDirector: deleteDirector
}