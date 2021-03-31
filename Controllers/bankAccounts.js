const BankAccount = require('../Models/BankAccount');
const Customer = require('../Models/Customer');
const Advisor = require('../Models/Advisor');


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
            });
            return newAccount.save()
            .then((savedAccount) => {
                return res.status(201).send(savedAccount);
            })
            .catch((error) => {
                return res.status(500).send(error);
            });
        } else {
            return res.status(400).send(`Customers can only have 1 ${req.body.type} account.`); 
        };
}

const getBankAccounts = (req, res) => {
    let criteria = {};
    const type = req.query.type;
    if (type === undefined) {
        criteria = {};
    } else {
        criteria.type = type;
    }
    return BankAccount.find(criteria)
    .then((bankAccounts) => {
        return res.send(bankAccounts);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const getOneBankAccount = (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    return BankAccount.findById(id)
    .populate('customerId', 'firstname lastname')
    .then((bankAccountFound) => {
        if (userId == bankAccountFound.customerId._id) {
            return res.send(bankAccountFound);
        } else { 
            return res.status(403).send('You don\'t have access to this bank account\'s data !');
        }
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const checkAdvisorId = (advisor_id, customer_id) => {
    return Customer.findOne({advisorId: advisor_id, _id: customer_id})
    .then((advisorId) => {
        console.log(advisorId);
        if(advisorId) return true;
        else return false;
    })
}

const putBankAccount = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const amount = req.body.amount;
    const account = await BankAccount.findById(id);
    const customer = await Customer.findById(userId);
    const advisor = await Advisor.findById(userId);
    let checkCustomer;
    let checkAdvisor;
    //On verifie que le user est un customer et que c'est le propriétaire du compte
    if (customer != null || customer != undefined) {
        if (account.customerId.toString() === customer._id.toString()) {
            checkCustomer = true;
        }
    }

    //On verifie que le user est un advisor et qu'il s'agit bien de l'advisor du customer de ce bankAccount
    if (advisor != null || advisor != undefined) {
        try {
            checkAdvisor = await checkAdvisorId(advisor._id, account.customerId);
        } catch (error) {
            return res.status(500).send(error);
        }
    }
    
    if (checkCustomer === true || checkAdvisor === true) {
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
}


/*
const putBankAccount = async (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const amount = req.body.amount;
    const account = await BankAccount.findById(id);
    const customer = await Customer.findById(userId);
    const advisor = await Advisor.findById(userId);
    let result;
    try {
        result = await checkAdvisorId(advisor._id, account.customerId);
    } catch (error) {
        return error;
    }
    console.log(result);
}
*/

const deleteBankAccount = (req, res) => {
    const id = req.params.id;
    return BankAccount.findByIdAndDelete(id)
    .then(() => {
        return res.send(`Account n°${id} has been deleted !`);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

module.exports = {
    createBankAccount: createBankAccount,
    getBankAccounts: getBankAccounts,
    getOneBankAccount: getOneBankAccount,
    putBankAccount: putBankAccount,
    deleteBankAccount: deleteBankAccount
}