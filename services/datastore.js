
const datastore = {
  // Store records in memory
  // This stores entries of form { payer: "...", points: ..., timestamp: ... }
  pointSources: [],
  // All payers that the users have been connected to
  payers: [],

  // Add points to the user
  // return true if succeeds, false if not
  add(payer, points, timestamp) {
    // Register payer
    if (!this.payers.some(x => x.payer == payer)) {
      this.payers.push(payer)
    }
    // If positive points, add a new entry in the pointSources list
    if (points > 0) {
      let entry = {
        payer: payer,
        points: points,
        timestamp: Date.parse(timestamp)
      }
      // Insert in the correct place so the list remains sorted
      let isInserted = false
      for (let i in this.pointSources) {
        if (entry.timestamp < this.pointSources[i].timestamp) {
          this.pointSources.splice(i, 0, entry)
          isInserted = true
        }
      }
      if (!isInserted)
        this.pointSources.push(entry)
      return true
    }
    // Only store entries with positive number of points. If negative, instead deduct from the first
    // entry from that payer. If not enough exists, discard this add
    else if (points < 0) {
      // Count points from this payer to make sure enough points exists from this payer
      // to deduct 
      let sum = 0
      for (let i in this.pointSources) {
        const entry = this.pointSources[i]
        if (entry.payer == payer) {
          sum += entry.points
        }
      }
      if (sum < Math.abs(points))
        return false
      // Deduct points
      let index = 0
      let length = this.pointSources.length
      for (let i = 0; i < length; i++) {
        const entry = this.pointSources[index]
        if (entry.payer == payer) {
          let deduct = Math.min(Math.abs(points), entry.points)
          points += deduct
          entry.points -= deduct
          if (entry.points == 0)
            this.pointSources.splice(index, 1)
        }
        else {
          index++;
        }
      }
      return true
    }
  },

  // Method to get balance
  // return an object of user balance per payer
  balance() {
    // Create object with all payers
    let payers = {}
    for (let i in this.payers)
      payers[this.payers[i]] = 0
    // Populate payers object with the balance for each payer by iterating though pointSources
    for (let i in this.pointSources) {
      let pointSource = this.pointSources[i]
      payers[pointSource.payer] += pointSource.points
    }
    return payers
  },

  // Method to spend x points
  // return null if fails, else a object of what payers are billed how many points
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