const Customer = require('../Models/Customer');
const Advisor = require('../Models/Advisor');
const Manager = require('../Models/Manager');
const Director = require('../Models/Director');
const mongoose = require('mongoose');

const checkAdvisorId = (advisor_id, customer_id) => {
    return Customer.findOne({ advisorId: advisor_id, _id: customer_id })
    .then((customer) => {
        if(customer) return true;
        else return false;
    })
}
const checkManagerId = async (manager_id, customer) => {
    let result = 0;
    let validate = false;
    let customersFound = [];
    let advisorsFound = await Advisor.find({ managerId: manager_id });
  
    for (let i = 0; i < advisorsFound.length; i++) {
        const element = advisorsFound[i];
        let customer_found = await Customer.find({ advisorId: element._id });
        customersFound.push(customer_found);
    }
    customersFound.forEach(element => {
        element.forEach(el => {
            console.log(customer);
            console.log(el._id);
            if (customer._id.toString() === el._id.toString()) {
                result +=1;
                if (result === 1) validate = true;
            }
        })
    })
    return validate;
}

const checkManagerToCreate = async (manager_id, advisor_id) => {
    return Advisor.findOne({ managerId: manager_id, _id: advisor_id })
    .then((advisor) => {
        if(advisor) return true;
        else return false;
    })
}
const checkIfAdvisor = async (advisor_id) => {
    return Advisor.find({_id: advisor_id})
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

const createCustomer = async (req, res) => {
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const newCustomer = new Customer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        adress: req.body.adress,
        bankAuthorisation: req.body.bankAuthorisation,
        advisorId: req.body.advisorId,
        creationDate: Date.now()
    })
    if (isValidUser) {
        const advisor = await Advisor.findById(userId);
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkAdvisor;
        let checkManager;
        let checkDirector;
        if (advisor) {
            try{
                if (advisor._id.toString() === newCustomer.advisorId.toString()){
                    checkAdvisor = true;
                } else {
                    checkAdvisor = false;
                    return res.status(403).send('You only can create a subordinate customer !');
                }
            } catch (error) {
                return res.status(500).send(error + '');
            }
        }
        if (manager) {
            try{
                    checkManager = await checkManagerToCreate(manager._id, newCustomer.advisorId);
                }
            catch (error) {
                return res.status(500).send(error + '');
            }
        }
        if (director) {
            try {
                checkDirector = await checkDirectorId(director._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (checkAdvisor || checkManager || checkDirector && isValidUser) {
            return newCustomer.save()
            .then((savedCustomer) => {
                console.log('Successful !');
                return res.status(201).send(savedCustomer);
            })
            .catch((error) => {
                return res.status(500).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have permission to create new customer !');
        }
    } else {
        return res.status(400).send("Le userId saisi n'est pas valide !");
    }
}

const getCustomers = async (req, res) => {
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    let criteria = {};
    // const city = req.query.adress;
    /*if (city === undefined) {
        criteria = {};
        console.log(criteria.city+"-----");
    } else {
        console.log(criteria.city+"+++");
        criteria.city = city ;
    }*/
    if (isValidUser) {
        const advisor = await Advisor.findById(userId);
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkAdvisor;
        let checkManager;
        let checkDirector;
        if (advisor) {
            try {
                checkAdvisor = await checkIfAdvisor(advisor._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
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
        if (checkAdvisor || checkManager || checkDirector && isValidUser) {
            return Customer.find(criteria)
            .then((customers) => {
                // console.log(customers[3].adress.city);
                return res.send(customers);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to the customers data !');
        }
    } else {
        return res.status(400).send("le userId saisi n'est pas valide !");
    }
}

const getOneCustomer = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValidCustomer = mongoose.isValidObjectId(id);
    const isValidUser = mongoose.isValidObjectId(userId);
    if (!isValidCustomer) {
        return res.status(400).send("l'id du customer n'est pas valide");
    }
    const customer = await Customer.findById(id);
    if (isValidUser) {
        const customerToFind = await Customer.findById(userId);
        const advisor = await Advisor.findById(userId);
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkCustomer;
        let checkAdvisor;
        let checkManager;
        let checkDirector;
        if (customerToFind) {
            try {
                if (customer._id.toString() === customerToFind._id.toString()) {
                    checkCustomer = true;
                }
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (advisor) {
            try {
                checkAdvisor = await checkAdvisorId(advisor._id, customer._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (manager) {
            try{
                checkManager = await checkManagerId(manager._id, customer);
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
        if (checkCustomer || checkAdvisor || checkManager || checkDirector && isValidUser) {
            return Customer.findById(id)
            .populate('advisorId', 'firstname lastname')
            .then((customerFound) => {
                return res.status(200).send(customerFound);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this customer\'s data !');
        }
    } else {
        return res.status(400).send("le userId saisi n'est pas valide !");
    }
}

const putCustomer = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const adress = req.body.adress;
    const advisorId = req.body.advisorId;
    let criteria = {};
    if(adress) criteria.adress = adress;
    if(advisorId) criteria.advisorId = advisorId;
    const isValidUser = mongoose.isValidObjectId(userId);
    const isValidCustomer = mongoose.isValidObjectId(id);
    if (!isValidCustomer) {
        return res.status(400).send("l'id du customer n'est pas valide !");
    }
    const customer = await Customer.findById(id);
    if (isValidUser) {
        const advisor = await Advisor.findById(userId);
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkAdvisor;
        let checkManager;
        let checkDirector;
        if (advisor) {
            try {
                checkAdvisor = await checkAdvisorId(advisor._id, customer._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (manager) {
            try{
                checkManager = await checkManagerId(manager._id, customer);
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
        if (checkAdvisor || checkManager || checkDirector && isValidUser) {
            return Customer.findByIdAndUpdate(id, criteria)
            .then((customerUpdated) => {
                return res.status(201).send(customerUpdated);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this customer\'s data !');
        }
    } else {
        return res.status(400).send("le userId saisi n'est pas valide !");
    }
}

const deleteOneCustomer = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const isValidCustomer = mongoose.isValidObjectId(id);
    if (!isValidCustomer) {
        return res.status(400).send("l'id du customer n'est pas valide");
    }
    const customer = await Customer.findById(id);
    if (isValidUser) {
        const advisor = await Advisor.findById(userId);
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkAdvisor;
        let checkManager;
        let checkDirector;
        if (advisor) {
            try {
                checkAdvisor = await checkAdvisorId(advisor._id, customer._id);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (manager) {
            try{
                checkManager = await checkManagerId(manager._id, customer);
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
        if (checkAdvisor || checkManager || checkDirector && isValidUser) {
            return Customer.findByIdAndDelete(id)
            .then(() => {
                return res.send(`Customer ${customer.firstname} ${customer.lastname} has been deleted.`);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this customer\'s data !');
        }
    } else {
        return res.status(400).send("le userId saisi n'est pas valide !");
    }
}
module.exports = {
    createCustomer: createCustomer,
    getCustomers: getCustomers,
    getOneCustomer: getOneCustomer,
    putCustomer: putCustomer,    
    deleteOneCustomer: deleteOneCustomer
}