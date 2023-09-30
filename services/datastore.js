
const datastore = {
  // Mock a database with an in memory array.
  // This stores entries of form { payer: "...", points: ..., timestamp: ... }
  pointSources: [],

  add(payer, points, timestamp) {
    if (points > 0) {
      let entry = {
        payer: payer,
        points: points,
        timestamp: Date.parse(timestamp)
      }
      let isInserted = false
      for (let i in this.pointSources) {
        if (entry.timestamp < this.pointSources[i].timestamp) {
          this.pointSources.splice(i, 0, entry)
          isInserted = true
        }
      }
      if (!isInserted)
        this.pointSources.push(entry)
    }
    console.log(this.pointSources)
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
    let pointDeductions = []
    let pointSourceIndex = 0

    // Loop through all point sources until enough points are found
    while (points > 0) {
      // If no more point sources left, then there are not enough points in account
      // to spend
      if (pointSourceIndex >= this.pointSources.length)
        break
      // Deduct points from next point source
      pointSource = this.pointSources[pointSourceIndex]
      if (pointSource.points < points) {
        pointDeductions.push(pointSource.points)
        points -= pointSource.points
      }
      else {
        pointDeductions.push(points)
        points -= points
      }
      // Increment point source index
      pointSourceIndex += 1
    }
    // If not enough points, return null
    if (points != 0)
      return null
    // If enough points, write deductions to database and return map of what companies were deducted from
    else {
      // TODO: I DONT LIKE THIS
      const payerDeductions = {}
      for (pointIndex in pointDeductions) {
        const payer = this.pointSources[0].payer
        // Add points to payerDeductions map
        if (payerDeductions[payer])
          payerDeductions[payer] += pointDeductions[pointIndex]
        else
          payerDeductions[payer] = pointDeductions[pointIndex]
        // Write deductions to database
        if (this.pointSources[0].points == pointDeductions[pointIndex])
          this.pointSources.shift() // Remove record from pointSources
        else // This else branch can only run in the last iteration
          this.pointSources[0].points = this.pointSources[0].points - pointDeductions[pointIndex]
      }
      return payerDeductions
    }
  }
}

module.exports = datastore