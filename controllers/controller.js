const express = require("express")
const datastore = require("../services/datastore")

const router = express.Router()

router.post("/add", (req, res) => {
  datastore.add(req.body.payer, req.body.points, req.body.timestamp)
  res.sendStatus(200)
})

router.post("/spend", (req, res) => {
  res.send(controller.spend(req.body.points))
})

router.get("/balance", (req, res) => {
  res.send(datastore.balance())
})

module.exports = router