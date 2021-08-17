const Advisor = require("../Models/Advisor");
const Manager = require('../Models/Manager');
const Director = require('../Models/Director');
const mongoose = require('mongoose');


const checkManagerId = (manager_id, advisor_id) => {
    return Advisor.findOne({ managerId: manager_id, _id: advisor_id })
    .then((advisor) => {
        if(advisor) return true;
        else return false;
    })
}
const checkDirectorId = async (director_id) => {
    return Director.find({ _id: director_id })
    .then((director) => {
        if(director) return true;
        else return false;
    })
}

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

const deleteOneAdvisor = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const isValidAdvisor = mongoose.isValidObjectId(id);
    if (isValidAdvisor === false) {
        return res.status(400).send("l'id de l'advisor n'est pas valide");
    }
    const advisor = await Advisor.findById(id);
    if (isValidUser === true) {
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkManager;
        let checkDirector;
        if (manager != null || manager != undefined) {
            try{
                checkManager = await checkManagerId(manager._id, advisor);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (director != null || director != undefined) {
            try {
                checkDirector = await checkDirectorId(director._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (checkManager === true || checkDirector === true && isValidUser === true) {
            return Advisor.findByIdAndDelete(id)
            .then(() => {
                return res.send(`Advisor ${advisor.firstname} ${advisor.lastname} has been deleted !`);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this advisor\'s data !');
        }
    }
}
module.exports = {
    createAdvisor: createAdvisor,
    getAdvisors: getAdvisors,
    getOneAdvisor: getOneAdvisor,
    putAdvisor: putAdvisor,
    deleteOneAdvisor: deleteOneAdvisor
}