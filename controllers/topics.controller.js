const { fetchTopics } = require("../models/topics.models")

exports.getTopics = (req, res) => {
fetchTopics().then((result) => {
    res.status(200).send({ topics: result })
})
}