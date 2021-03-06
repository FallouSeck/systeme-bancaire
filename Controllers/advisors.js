const Advisor = require("../Models/Advisor");

const createAdvisor = (req, res) => {
    const newAdvisor = new Advisor({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        managerId: req.body.managerId,
        creationDate: Date.now()
    })
    newAdvisor.save()
    .then((newAdvisorCreated) => {
        return res.status(201).send(newAdvisorCreated);
    })
    .catch((error) => {
        return res.status(500).send(error);
    })
}

const getAdvisors = (req, res) => {
    return Advisor.find()
    .then((advisorsFound) => {
        return res.send(advisorsFound);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const getOneAdvisor = (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    return Advisor.findById(id)
    .populate('managerId', 'firstname lastname')
    .then((advisorFound) => {
        if (userId == advisorFound.managerId._id) {
            return res.send(advisorFound);
        } else {
            return res.status(403).send('You don\'t have access to this advisor\'s data !')
        }
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const putAdvisor = (req, res) => {
    const id = req.params.id;
    const managerId = req.body.managerId;
    return Advisor.findByIdAndUpdate(id, { managerId: managerId })
    .then((advisorUpdated) => {
        return res.status(201).send(advisorUpdated);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const deleteOneAdvisor = (req, res) => {
    const id = req.params.id;
    return Advisor.findByIdAndDelete(id)
    .then((advisorToDelete) => {
        return res.send(`Advisor ${advisorToDelete.firstname} ${advisorToDelete.lastname} has been deleted !`);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}
module.exports = {
    createAdvisor: createAdvisor,
    getAdvisors: getAdvisors,
    getOneAdvisor: getOneAdvisor,
    putAdvisor: putAdvisor,
    deleteOneAdvisor: deleteOneAdvisor
}