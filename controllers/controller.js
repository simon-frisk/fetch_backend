const datastore = require("../services/datastore")

// TODO: Validation

module.exports = {
  add(body) {
    console.log(body)
    datastore.add(body.payer, body.points, body.timestamp)
  },

  spend(body) {
    datastore.spend(body.points)
  },

  balance() {
    return datastore.balance()
  }
}