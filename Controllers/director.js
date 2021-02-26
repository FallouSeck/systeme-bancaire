const Director = require('../Models/Director');

const createDirector = (req, res) => {
    const newDirector = new Director({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        creationDate: Date.now()
    })
    newDirector.save()
    .then((newDirectorCreated) => {
        return res.status(201).send(newDirectorCreated);
    })
    .catch((error) => {
        return res.status(500).send(error);
    })
}

const getDirector = (req, res) => {
    return Director.find()
    .then((directorFound) => {
        return res.send(directorFound);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
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