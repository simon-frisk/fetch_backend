const express = require("express")
const datastore = require("../services/datastore")

const router = express.Router()

router.post("/add", (req, res) => {
  let success = datastore.add(req.body.payer, req.body.points, req.body.timestamp)
  if (success)
    res.sendStatus(200)
  else
    res.status(400).send("Failed to add points")
})

router.post("/spend", (req, res) => {
  let spendmap = datastore.spend(req.body.points)
  if (spendmap == null)
    res.status(400).send("User does not have enough points.")
  else
    res.status(200).send(spendmap)
})

router.get("/balance", (req, res) => {
  let balance = datastore.balance()
  res.send(balance)
})

module.exports = router