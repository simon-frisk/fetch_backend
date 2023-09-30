const express = require("express")
const logger = require("morgan")
const router = require("./routes/router")

const app = express()
const PORT = 8000

// Configure middleware
app.use(logger("dev"))

// Router configuration
app.use('/', router)

// Start server and listen to PORT
app.listen(PORT, error => {
  if (error)
    console.log("Error when starting server")
  else {
    console.log(`Server running on port ${PORT}`)
  }
})