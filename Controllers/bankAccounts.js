const BankAccount = require('../Models/BankAccount');
const Customer = require('../Models/Customer');
const Advisor = require('../Models/Advisor');
const Manager = require('../Models/Manager');
const Director = require('../Models/Director');
const mongoose = require('mongoose');


const findInTheDatabase = (customer_id, _type) => {
        return BankAccount.findOne({type: _type, customerId: customer_id})
        .then((account) => {
            if (account !== null) {
                return true;
            } else{
                return false;
            }
        })
}
const checkAdvisorId = (advisor_id, customer_id) => {
    return Customer.findOne({ advisorId: advisor_id, _id: customer_id })
    .then((customer) => {
        if(customer) return true;
        else return false;
    })
}
const checkManagerId = async (manager_id, account) => {
    let result = 0;
    let validate = false;
    let customersFound = [];
    let bankAccountsFound = [];
    let advisorsFound = await Advisor.find({ managerId: manager_id });
  
    for (let i = 0; i < advisorsFound.length; i++) {
        const element = advisorsFound[i];
        let customer = await Customer.find({ advisorId: element._id });
        customersFound.push(customer);
    }

    for (let i = 0; i < customersFound.length; i++) {
        const element = customersFound[i];
        for (let index = 0; index < element.length; index++) {
            const el = element[index];
            let bankAccount = await BankAccount.find({ customerId: el._id });
            bankAccountsFound.push(bankAccount);
        }
    }

    bankAccountsFound.forEach(element => {
        element.forEach(el => {
            if (account._id.toString() === el._id.toString()) {
                result += 1;
                if (result === 1) validate = true;
            }
        })
    })
    return validate;
}
const checkDirectorId = (director_id) => {
    return Director.find({ _id: director_id })
    .then((director) => {
        if(director) return true;
        else return false;
    })
}

async function createBankAccount (req, res) {
    let result;
    try {
        result = await findInTheDatabase(req.body.customerId, req.body.type);
    } catch (error) {
        return res.status(500).send(error);        
    };
    if(result === false){
            const newAccount = new BankAccount({
                type: req.body.type,
                customerId: req.body.customerId,
                amount: req.body.amount,
                creationDate: Date.now()
            })
            return newAccount.save()
            .then((savedAccount) => {
                return res.status(201).send(savedAccount);
            })
            .catch((error) => {
                return res.status(500).send(error);
            });
        } else {
            return res.status(400).send(`Customers can only have 1 ${req.body.type} account.`); 
        }
}

const getBankAccounts = (req, res) => {
    let criteria = {};
    const type = req.query.type;
    const customerId = req.query.customerId;
    const afterDate = req.query.afterDate;
    const beforeDate = req.query.beforeDate;
    if(type) {
        criteria.type = type;
    }
    if (customerId) {
        criteria.customerId = customerId;
    }
    if (afterDate) {
        criteria.creationDate = { $gte: afterDate };
    }
    if (beforeDate) {
        criteria.creationDate = { $lte: beforeDate };
    }
    return BankAccount.find(criteria)
    .then((bankAccounts) => {
        return res.send(bankAccounts);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const getOneBankAccount = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValidAccount = mongoose.isValidObjectId(id);
    const isValidUser = mongoose.isValidObjectId(userId);
    if (!isValidAccount) {
        return res.status(400).send("l'id du compte n'est pas valide");
    }
    const account = await BankAccount.findById(id);
    if (isValidUser) {
        const customer = await Customer.findById(userId);
        const advisor = await Advisor.findById(userId);
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkCustomer;
        let checkAdvisor;
        let checkManager;
        let checkDirector;
        if (customer) {
            if (account.customerId.toString() === customer._id.toString()) {
                checkCustomer = true;
            }
        }
        if (advisor) {
            try {
                checkAdvisor = await checkAdvisorId(advisor._id, account.customerId);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (manager) {
            try{
                checkManager = await checkManagerId(manager._id, account);
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
            return BankAccount.findById(id)
            .populate('customerId', 'firstname lastname')
            .then((bankAccountFound) => {
                return res.status(200).send(bankAccountFound);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this bank account\'s data !');
        }
    } else {
        return res.status(400).send("le userId saisi n'est pas valide !");
    }
}

const putBankAccount = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const amount = req.body.amount;
    // On verifie sur le userId et et l'id sont valide
    const isValid = mongoose.isValidObjectId(userId);
    const isValidAccount = mongoose.isValidObjectId(id);
    if (!isValidAccount) {
        return res.status(400).send("l'id du compte n'est pas valide");
    }
    const account = await BankAccount.findById(id);
    if (isValid) {
        const customer = await Customer.findById(userId);
        const advisor = await Advisor.findById(userId);
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkCustomer;
        let checkAdvisor;
        let checkManager;
        let checkDirector;
        //On verifie si le user est un customer et que c'est le propriétaire du compte
        if (customer) {
            if (account.customerId.toString() === customer._id.toString()) {
                checkCustomer = true;
            }
        }
        //On verifie si le user est un advisor et qu'il s'agit bien de l'advisor du customer de ce compte
        if (advisor) {
            try {
                checkAdvisor = await checkAdvisorId(advisor._id, account.customerId);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        //On verifie si le user est un manager et qu'il s'agit bien du manager de l'advisor du customer de ce compte
        if (manager) {
            try{
                checkManager = await checkManagerId(manager._id, account);
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
        //Si le user est lié à ce compte et que l'Id est valide alors on fait la modif
        if (checkCustomer || checkAdvisor || checkManager || checkDirector && isValid) {
            return BankAccount.findByIdAndUpdate(id, { amount: amount })
            .then((amountUpdated) => {
                return res.status(201).send(amountUpdated);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this bank account\'s data !');
        }
    } else {
        return res.status(400).send("le userId saisi n'est pas valide !");
    }
}

const deleteBankAccount = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const isValidUser = mongoose.isValidObjectId(userId);
    const isValidAccount = mongoose.isValidObjectId(id);
    if (!isValidAccount) {
        return res.status(400).send("l'id du compte n'est pas valide");
    }
    const account = await BankAccount.findById(id);
    if (isValidUser) {
        const advisor = await Advisor.findById(userId);
        const manager = await Manager.findById(userId);
        const director = await Director.findById(userId);
        let checkAdvisor;
        let checkManager;
        let checkDirector;
        if (advisor) {
            try {
                checkAdvisor = await checkAdvisorId(advisor._id, account.customerId);
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        if (manager) {
            try{
                checkManager = await checkManagerId(manager._id, account);
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
            return BankAccount.findByIdAndDelete(id)
            .then(() => {
                return res.send(`Account n°${id} has been deleted !`);
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
        } else {
            return res.status(403).send('You don\'t have access to this bank account\'s data !');
        }
    } else {
        return res.status(400).send("le userId saisi n'est pas valide !");
    }
}

module.exports = {
    createBankAccount: createBankAccount,
    getBankAccounts: getBankAccounts,
    getOneBankAccount: getOneBankAccount,
    putBankAccount: putBankAccount,
    deleteBankAccount: deleteBankAccount
}