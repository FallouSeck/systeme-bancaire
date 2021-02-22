const Manager = require('../Models/Manager');

const createManager = (req, res) => {
    const newManager = new Manager({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        creationDate: Date.now()
    })
    newManager.save()
    .then((newManagerCreated) => {
        return res.send(newManagerCreated);
    })
    .catch((error) => {
        return res.status(500).send(error);
    })
}

const getManagers = (req, res) => {
    return Manager.find()
    .then((managersFound) => {
        return res.send(managersFound);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const getOneManager = (req, res) => {
    const id = req.params.id;
    return Manager.findById(id)
    .then((managerFound) => {
        return res.send(managerFound);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const deleteManager = (req, res) => {
    const id = req.params.id;
    return Manager.findByIdAndDelete(id)
    .then((managerToDelete) => {
        return res.send(`Manager ${managerToDelete.firstname} ${managerToDelete.lastname} has been deleted !`);
    })
}

module.exports = {
    createManager: createManager,
    getManagers: getManagers,
    getOneManager: getOneManager,
    deleteManager: deleteManager
}