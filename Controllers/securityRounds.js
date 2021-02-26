const SecurityRound = require("../Models/SecurityRound");

const createSecurityRound = (req, res) => {
    const newSecurityRound = new SecurityRound({
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        comments: req.body.comments,
        creationDate: Date.now()
    })
    newSecurityRound.save()
    .then((newSecurityRoundCreated) => {
        return res.status(201).send(newSecurityRoundCreated);
    })
    .catch((error) => {
        return res.status(500).send(error);
    })
}

const getSecurityRounds = (req, res) => {
    return SecurityRound.find()
    .then((securityRoundsFound) => {
        return res.send(securityRoundsFound);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

const getOneSecurityRound = (req, res) => {
    const id = req.params.id;
    return SecurityRound.findById(id)
    .then((securityRoundFound) => {
        return res.send(securityRoundFound);
    })
    .catch((error) => {
        return res.status(400).send(error);
    })
}

module.exports = {
    createSecurityRound: createSecurityRound,
    getSecurityRounds: getSecurityRounds,
    getOneSecurityRound: getOneSecurityRound
}