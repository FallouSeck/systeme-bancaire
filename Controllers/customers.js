const Customer = require('../Models/Customer');

const createCustomer = (req, res) => {
    const newCustomer = new Customer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        adress: req.body.adress,
        status: req.body.status,
        advisorId: req.body.advisorId,
        creationDate: Date.now()
    })
    return newCustomer.save()
    .then((savedCustomer) => {
        return res.status(201).send(savedCustomer);
    })
    .catch((error) => {
        return res.status(500).send(error);
    })
}

const getCustomers = (req, res) => {
    /*let criteria = {};
    const city = req.query.adress.city;
    if (city === undefined) {
        criteria = {};
        console.log(criteria.city+"-----");
    } else {
        console.log(criteria.city+"+++");
        criteria.city = city ;
    }*/
    return Customer.find()
    .then((customers) => {
        return res.send(customers);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const getOneCustomer = (req, res) => {
    const id = req.params.id;
    const userId = req.headers.userid;
    return Customer.findById(id)
    .populate('advisorId', 'firstname lastname')
    .then((customerFound) => {
        console.log(customerFound);
        if (userId == customerFound.advisorId._id) {
            return res.send(customerFound);
        } else {
            return res.status(403).send('You don\'t have access to this customer\'s data !')
        }
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const putCustomer = (req, res) => {
    const id = req.params.id;
    const adress = req.body.adress;
    const advisorId = req.body.advisorId;
    let criteria = {};
    if(adress) criteria.adress = adress;
    if(advisorId) criteria.advisorId = advisorId;
    return Customer.findByIdAndUpdate(id, criteria)
    .then((customerUpdated) => {
        return res.status(201).send(customerUpdated);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const deleteCustomer = (req, res) => {
    const id = req.params.id;
    return Customer.findByIdAndDelete(id)
    .then((customer) => {
        return res.send(`Customer ${customer.firstname} ${customer.lastname} has been deleted.`);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

module.exports = {
    createCustomer: createCustomer,
    getCustomers: getCustomers,
    getOneCustomer: getOneCustomer,
    putCustomer: putCustomer,    
    deleteCustomer: deleteCustomer
}