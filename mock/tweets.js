const faker = require('faker/locale/vi')
const nanoid = require('nanoid')
const reader = require('fs').readFileSync
const writer = require('fs').writeFileSync

const randomjs = require('random-js')
const Random = new randomjs(randomjs.engines.mt19937().autoSeed())

const Users = JSON.parse(reader('Users.json', 'utf-8'))
const Followers = JSON.parse(reader('Followers.json', 'utf-8'))

const followersByUser = {}

Users.forEach(user => {
  followersByUser[user.username] = Followers.filter(follower => follower.username === user.username)
})

const now = Date.now()

const Tweets = []

function tweeting(user, thread = '') {
  const likes = Random.integer(0, ((thread ? 15 : 40) * followersByUser[user.username].length) / 100)

  const tweet = {
    id: nanoid(16),
    time: Random.integer(user.time, now),
    username: user.username,
    text: faker.lorem.paragraph(Random.integer(1, 3)),
    likes,
    replies: 0,
    retweets: 0,
    thread
  }

  Tweets.push(tweet)

  return tweet
}

// generate tweets
for (let i = 0; i < 1000; i++) {
  let user = Random.pick(Users)

  let tweet = tweeting(user)

  replying(user, tweet)
}

// replyTweet
function replying(user, tweet, level = 0) {
  let replies = 0
  if (level === 0) {
    replies = Random.integer(0, Math.floor(40 * tweet.likes / 100))
  }
  else {
    replies = Random.integer(0, Math.floor((5 * followersByUser[user.username].length) / 100))
  }

  tweet.replies = replies

  for (let i = 0; i < tweet.replies; i++) {
    let follower = Random.pick(followersByUser[user.username]).follower
    let fu = Users.find(u => u.username === follower)

    let ftweet = tweeting(fu, tweet.id)
    replying(fu, ftweet, level + 1)
  }
}

// reTweet
Tweets.forEach(tweet => {
  // a tweet has higher chance if it is original
  let retweetChance = Random.integer(0, Math.floor(((tweet.thread ? 5 : 20) * tweet.likes) / 100))

  tweet.retweets = retweetChance

  for (let i = 0; i < retweetChance; i++) {
    let user = Random.pick(Users)
    if (user.username !== tweet.username) {
      Tweets.push(Object.assign({}, tweet, { id: nanoid(16), time: Random.integer(tweet.time, now), link: tweet.id, retweeter: user.username }))
    } else {
      i--
    }
  }
})

Tweets.sort((a, b) => b.time - a.time)

writer('Users.json', JSON.stringify(Users))
writer('Tweets.json', JSON.stringify(Tweets))
