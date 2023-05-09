const { getEndpoints } = require("../models/api.models")

exports.getApi = (req, res) => {
    const endpoints = getEndpoints()
    res.status(200).send({ endpoints: endpoints})
}