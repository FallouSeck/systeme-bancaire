const Advisor = require("../Models/Advisor");
const Manager = require('../Models/Manager');
const Director = require('../Models/Director');
const mongoose = require('mongoose');


const checkManagerId = async (manager_id, advisor_id) => {
    return Advisor.findOne({ managerId: manager_id, _id: advisor_id })
    .then((advisor) => {
        if(advisor) return true;
        else return false;
    })
}
const checkIfManager = async (manager_id) => {
    return Manager.find({_id: manager_id})
    .then((manager) => {
        if(manager) return true;
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

const createAdvisor = async (req, res) => {
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const newAdvisor = new Advisor({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        managerId: req.body.managerId,
        creationDate: Date.now()
    })
    if (isValidUser) {
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkManager;
        let checkDirector;
        if (manager) {
            try{
                if (manager._id.toString() === newAdvisor.managerId.toString()){
                    checkManager = true;
                } else {
                    checkManager = false;
                    return res.status(403).send('You can only create an advisor that you manage !');
                }
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (director) {
            try {
                checkDirector = await checkDirectorId(director._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (checkManager || checkDirector && isValidUser) {
            newAdvisor.save()
            .then((newAdvisorCreated) => {
                return res.status(201).send(newAdvisorCreated);
            })
            .catch((error) => {
                return res.status(500).send(error);
            })
        } else {
            return res.status(403).send('You\'re not allowed to create new advisor !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

const getAdvisors = async (req, res) => {
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    if (isValidUser) {
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkManager;
        let checkDirector;
        if (manager) {
            try{
                checkManager = await checkIfManager(manager._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (director) {
            try {
                checkDirector = await checkDirectorId(director._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (checkManager || checkDirector && isValidUser) {
            return Advisor.find()
            .then((advisorsFound) => {
                return res.send(advisorsFound);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to the advisor\'s data !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

const getOneAdvisor = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValidAdvisor = mongoose.isValidObjectId(id);
    const isValidUser = mongoose.isValidObjectId(userId);
    if (!isValidAdvisor) {
        return res.status(400).send("Advisor ID is not valid !");
    }
    const advisor = await Advisor.findById(id);
    if (isValidUser) {
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkManager;
        let checkDirector;
        if (manager) {
            try{
                checkManager = await checkManagerId(manager._id, advisor);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (director) {
            try {
                checkDirector = await checkDirectorId(director._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (checkManager || checkDirector && isValidUser) {
            return Advisor.findById(id)
            .populate('managerId', 'firstname lastname')
            .then((advisorFound) => {
                return res.status(200).send(advisorFound);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this advisor\'s data !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

const putAdvisor = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const manager_id = req.body.managerId;
    const isValidUser = mongoose.isValidObjectId(userId);
    const isValidAdvisor = mongoose.isValidObjectId(id);
    if (!isValidAdvisor) {
        return res.status(400).send("Advisor ID is not valid !");
    }
    const advisor = await Advisor.findById(id);
    if (isValidUser) {
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkManager;
        let checkDirector;
        if (manager) {
            try{
                checkManager = await checkManagerId(manager._id, advisor);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (director) {
            try {
                checkDirector = await checkDirectorId(director._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (checkManager || checkDirector && isValidUser) {
            return Advisor.findByIdAndUpdate(id, { managerId: manager_id })
            .then((advisorUpdated) => {
                return res.status(201).send(advisorUpdated);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this advisor\'s data !');
        }
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}

const deleteOneAdvisor = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const isValidAdvisor = mongoose.isValidObjectId(id);
    if (!isValidAdvisor) {
        return res.status(400).send("Advisor ID is not valid !");
    }
    const advisor = await Advisor.findById(id);
    if (isValidUser) {
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkManager;
        let checkDirector;
        if (manager) {
            try{
                checkManager = await checkManagerId(manager._id, advisor);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (director) {
            try {
                checkDirector = await checkDirectorId(director._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (checkManager || checkDirector && isValidUser) {
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
    } else {
        return res.status(400).send("The userID entered is not valid !");
    }
}
module.exports = {
    createAdvisor: createAdvisor,
    getAdvisors: getAdvisors,
    getOneAdvisor: getOneAdvisor,
    putAdvisor: putAdvisor,
    deleteOneAdvisor: deleteOneAdvisor
}