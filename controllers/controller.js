const datastore = require("../services/datastore")

module.exports = {
  add(body) {
    console.log(body)
    // TODO: Validation
    datastore.add(body.payer, body.points, body.timestamp)
  },

  spend() {

  },

  balance() {
    return datastore.balance()
  }
}