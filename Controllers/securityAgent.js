const SecurityAgent = require('../Models/SecurityAgent');

const createSecurityAgent = (req, res) => {
    const newSecurityAgent = new SecurityAgent({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        creationDate: Date.now()
    })
    return newSecurityAgent.save()
    .then((createdSecurityAgent) => {
        return res.status(201).send(createdSecurityAgent);
    })
    .catch((error) => {
        return res.status(500).send(error);
    })
}

const getSecurityAgent = (req, res) => {
    return SecurityAgent.find()
    .then((securityAgentFound) => {
        return res.send(securityAgentFound);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const deleteSecurityAgent = (req, res) => {
    const id = req.params.id;
    return SecurityAgent.findByIdAndDelete(id)
    .then((securityAgentToDelete) => {
        return res.send(`Security agent ${securityAgentToDelete.firstname} ${securityAgentToDelete.lastname} has been deleted.`);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

module.exports = {
    createSecurityAgent: createSecurityAgent,
    getSecurityAgent: getSecurityAgent,
    deleteSecurityAgent: deleteSecurityAgent
}