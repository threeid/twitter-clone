const MongoClient = require('mongodb').MongoClient

class DBClient {
  constructor(username, password) {
    MongoClient.connect(`mongodb://${username}:${password}@ds115729.mlab.com:15729/twitter-app`, (err, client) => {
      if(err) console.log(err)
      else {
        const db = client.db('twitter-app')
        this.users = db.collection('users')
        this.pending = db.collection('pending')
        this.followings = db.collection('followings')
        this.tweets = db.collection('tweets') 
      }
    })
  }

  addNewUser(user) {
    this.logins.insertOne(user, (err, res) => {
      if(err) console.log(err)
    })
  }

  addNewTweet(tweet) {

  }

  updateUser(user, info) {

  }

  getTweets(username) {

  }

  getThread(thread) {

  }

  deleteUser(user) {

  }

  deleteTweet(tweet) {

  }

  addToPending(user) {

  }

  verifyPending(uniqueId, callback) {

  }
}
