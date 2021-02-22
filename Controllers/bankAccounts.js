const BankAccount = require('../Models/BankAccount');

const findInTheDatabase = (customer_id, _type) => {
        return BankAccount.findOne({type: _type, customerId: customer_id})
        .then((account) => {
            if (account !== null) {
                return true;
            } else{
                return false;
            };
        });
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
    return BankAccount.findById(id)
    .populate('customerId')
    .then((bankAccountFound) => {
        console.log(bankAccountFound.customerId);
        return res.send(bankAccountFound);
    })
    .catch((error) => {
        return res.status(400).send(error);
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
    deleteBankAccount: deleteBankAccount
}