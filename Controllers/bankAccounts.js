const BankAccount = require('../Models/BankAccount');

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
/*
const getOneBankAccount = (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    const customerId = req.query.customerId;
    // console.log("%j" + JSON.stringify(req.headers) +  " coucou");
    console.log(customerId);
    return BankAccount.findById(id)
    .populate('customerId', 'firstname lastname -_id')
    .then((bankAccountFound) => {
        return res.send(bankAccountFound);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}
*/

const getOneBankAccount = (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    return BankAccount.findById(id)
    .populate('customerId', 'firstname lastname')
    .then((bankAccountFound) => {
        if (userId == bankAccountFound.customerId._id) {
            return res.send(bankAccountFound);
        } else { 
            return res.status(403).send('You don\'t have access to this customer\'s data !');
        }
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const putBankAccount = (req, res) => {
    const id = req.params.id;
    const amount = req.body.amount;
    return BankAccount.findByIdAndUpdate(id, { amount })
    .then((amountUpdated) => {
        res.status(201).send(amountUpdated);
    })
    .catch((error) => {
        res.status(400).send(error);
    })
}

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