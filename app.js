const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const { psqlErrors, otherErrors } = require("./errors");
const app = express();

app.use(express.json())

// Endpoints

app.get('/api', getApi)

app.get('/api/topics', getTopics)


app.get('api/articles')

// Error handling

app.use(psqlErrors)

app.use(otherErrors)

app.use((err, req, res, next) => {
    console.log('Error log: ', err)
    res.status(500).send({ msg: "Server error! We're very sorry!" })
})

module.exports = app;
