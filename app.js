const express = require("express")
const logger = require("morgan")

const controller = require("./controllers/controller")

const app = express()
const PORT = 8000

// Configure middleware
app.use(logger("dev"))
app.use(express.json())

// Controller configuration
app.use('/', controller)

// Send 404 if no routes match
app.use((req, res, next) => {
  res.status(404).send()
})

// Send 500 if an error happens
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})

// Start server and listen to PORT
app.listen(PORT, error => {
  if (error)
    console.log("Error when starting server")
  else {
    console.log(`Server running on port ${PORT}`)
  }
})