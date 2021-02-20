const Customer = require('../Models/Customer');

const createCustomer = (req, res) => {
    const newCustomer = new Customer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        adress: req.body.adress,
        advisorId: req.body.advisorId,
        creationDate: Date.now()
    })
    return newCustomer.save()
    .then((savedCustomer) => {
        return res.send(savedCustomer);
    })
    .catch((error) => {
        return res.status(500).send(error);
    })
}

const getAllCustomers = (req, res) => {
    /*const city = req.query.adress[0].city;
    let criteria = {};
    if (city == undefined) {
        criteria = { };
    } else {
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
    return Customer.findById(id)
    .populate('advisorId', 'firstname lastname -_id')
    .then((customer) => {
        return res.send(customer);
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
    getAllCustomers: getAllCustomers,
    getOneCustomer: getOneCustomer,
    deleteCustomer: deleteCustomer
}