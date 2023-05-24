const { fetchUsers } = require("../models/users.model")

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((result) => {
        console.log(result);
        res.status(200).send({users: result})
    })
}