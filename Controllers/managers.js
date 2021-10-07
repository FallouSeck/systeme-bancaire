const Manager = require('../Models/Manager');
const Director = require('../Models/Director');
const mongoose = require('mongoose');


const createManager = async (req, res) => {
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const newManager = new Manager({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        creationDate: Date.now()
    })
    if(isValidUser) {
    const director = await Director.findById(userId);
        if(director) {
            newManager.save()
            .then((newManagerCreated) => {
                return res.status(201).send(newManagerCreated);
            })
            .catch((error) => {
                return res.status(500).send(error);
            })
        } else {
            return res.status(403).send('You\'re not allowed to create new manager !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

const getManagers = async (req, res) => {
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    if (isValidUser) {
        const director = await Director.findById(userId);
        if (director) {
            return Manager.find()
            .then((managersFound) => {
                return res.send(managersFound);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this manager\'s data !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

const getOneManager = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const isValiManager = mongoose.isValidObjectId(id);
    if (!isValiManager) {
        return res.status(400).send("Manager ID is not valid !");
    }
    if(isValidUser){ 
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        if(director || manager._id.toString() === id) {
            return Manager.findById(id)
            .then((managerFound) => {
                return res.send(managerFound);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this manager\'s data !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

const deleteManager = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const isValidManager = mongoose.isValidObjectId(id);
    if (!isValidManager) {
        return res.status(400).send("Manager ID is not valid !");
    }
    if(isValidUser){ 
        const director = await Director.findById(userId);
        if(director) {
            return Manager.findByIdAndDelete(id)
            .then((managerToDelete) => {
                return res.send(`Manager ${managerToDelete.firstname} ${managerToDelete.lastname} has been deleted !`);
            })
        } else {
            return res.status(403).send('You don\'t have access to this manager\'s data !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

module.exports = {
    createManager: createManager,
    getManagers: getManagers,
    getOneManager: getOneManager,
    deleteManager: deleteManager
}