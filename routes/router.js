const express = require("express")
const controller = require("../controllers/controller")

const router = express.Router()

router.post("/add", (req, res) => {
  controller.add(req.body)
  res.sendStatus(200)
})

router.get("/balance", (req, res) => {
  res.send(controller.balance())
})

module.exports = router