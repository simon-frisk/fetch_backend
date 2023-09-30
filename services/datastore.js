
const datastore = {
  // Mock a database with an in memory array.
  // This stores entries of form { payer: "...", points: ..., timestamp: ... }
  pointSources: [],

  add(payer, points, timestamp) {
    if (points > 0) {
      let entry = {
        "payer": payer,
        "points": points,
        "timestamp": timestamp
      }
      this.pointSources.push(entry)
    }
    // TODO: What if negative points?
  },

  balance() {
    let payers = {}
    for (let i in this.pointSources) {
      let pointSource = this.pointSources[i];
      if (payers[pointSource.payer])
        payers[pointSource.payer] += pointSource.points
      else
        payers[pointSource.payer] = pointSource.points
    }
    return payers
  },

  // returns null if not enough points
  spend(points) {
  }
}

module.exports = datastore