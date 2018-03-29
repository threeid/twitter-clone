require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const boom = require('express-boom')
const multer = require('multer')({ dest: 'uploads/' })
const readFile = require('fs').readFileSync
const nanoid = require('nanoid')
const jwtAuth = require('./jwtAuth')(process.env.APP_SECRET)

const Users = JSON.parse(readFile('./Users.json', 'utf-8'))
const Followers = JSON.parse(readFile('./Followers.json', 'utf-8'))
const Tweets = JSON.parse(readFile('./Tweets.json', 'utf-8'))

const app = express()
app.options('*', cors())
app.use(cors())
app.use(boom())
app.use(bodyParser.json())

// authorization
// check if there is an authorization request header
// if so, use jwtAuth to verify token from the authorization header

app.use((req, res, next) => {
  const authorization = req.headers['authorization']

  if(authorization) {
    const token = authorization.split(' ')[1]
    if(!token) {
      res.boom.unauthorized()
    }
    else {
      jwtAuth
        .verify(token)
        .then(decoded => {
          req.user = decoded
          next()
        })
        .catch(err => {
          console.log('authorization ', err)
          res.boom.badImplementation()
        })
    }
  }
  else {
    next()
  }
})

app.use(express.static('build'))
// serve avatar
app.use('/uploads', express.static(__dirname + '/uploads'))

app.post('/api/user/register', (req, res) => {
  let { username, name, email } = req.body

  if( !username || !name || !email ) return res.boom.badData()
  if(Users.find(user => user.username === username || user.email === email)) return res.boom.badData()

  Users.push({
    username,
    name,
    email,
    time: Date.now(),
    avatar: 'http://localhost:3000/uploads/avatar.png'
  })

  res.status(200).end()
})

app.get('/api/user/:username/verify/:code', (req, res) => {})

app.post('/api/user/signin', (req, res) => {
  let { username, email } = req.body
  
  if( !username || !email ) return res.boom.badData()

  let user = Users.find(user => user.username === username && user.email === email)
  if( !user ) return res.boom.badData()

  jwtAuth
    .sign({ username, email })
    .then(token => res.json({token}))
    .catch(err => {
      res.boom.badImplementation()
      console.log(err)
    })
})

app.get('/api/user/:username/signout', (req, res) => {
  // clear session, destroy token
  res.status(200).end()
})

app.get('/api/user/:username', (req, res) => {
  let username = req.params.username

  let user = Users.find(user => user.username === username)
  if (!user) return res.boom.notFound()

  user.tweets = Tweets.filter(tweet => tweet.username === username).length

  let followers = 0,
    followings = 0

  Followers.forEach(follower => {
    if (follower.username === username) {
      followers += 1
    } else if (follower.follower === username) {
      followings += 1
    }
  })

  user.followers = followers
  user.followings = followings

  if(!user.avatar) {
    user.avatar = 'http://localhost:3000/uploads/avatar.png'
  }

  res.json(user)
})

app.get('/api/user/:username/delete', (req, res) => {
  const username = req.params.username
  const decodedToken = req.user

  if( !decodedToken || username !== decodedToken.username ) return res.boom.unauthorized()
  
  delete Users[index]

  res.status(200).end()
})

app.post('/api/user/:username/follow', (req, res) => {
  const username = req.params.username
  const following = req.body.following
  const decodedToken = req.user

  if( !decodedToken || follower !== decodedToken.username ) return res.boom.badData()
  
  Followers.push({ username, following })

  res.status(200).end()
})

app.post('/api/user/:username/update', (req, res) => {
  const username = req.params.username
  const { userInfo } = req.body
  const decodedToken = req.user

  if( !decodedToken || decodedToken.username !== username || !userInfo) return res.boom.badData()
  
  let userIndex = Users.findIndex(user => user.username === username)

  Users[userIndex] = Object.assign({}, Users[userIndex], userInfo)

  res.json(Users[userIndex])
})

app.post('/api/user/:username/upload', multer.single('avatar'), (req, res) => {
  const username = req.params.username
  const { userInfo } = req.body
  const decodedToken = req.user

  if( !decodedToken || decodedToken.username !== username || !req.file) return res.boom.badData()
  
  const avatar = `http://localhost:3000/uploads/${req.file}`
  const userIndex = Users.findIndex(user => user.username === username)

  Users[userIndex].avatar = avatar

  res.json({username, avatar})
})

app.get('/api/user/:username/:tweetId/like', (req, res) => {
  const { username, tweetId } = req.params
  const decodedToken = req.user
  
  if( !username || !tweetId || !decodedToken || decodedToken.username !== username) return res.boom.badData()
  
  let tweet = Tweets.find(tweet => tweet.id === tweetId)
  if(!tweet) return res.boom.notFound()

  tweet.likes += 1
  res.status(200).end()
})

app.post('/api/user/:username/:tweetId/retweet', (req, res) => {
  const { username, tweetId } = req.params
  const time = req.body.time
  const decodedToken = req.user

  if( !username || !tweetId || !time || !decodedToken || decodedToken.username !== username) return res.boom.badData()
  
  let tweet = Tweets.find(tweet => tweet.id === tweetId)
  if( !tweet ) return res.boom.notFound()

  tweet.retweets += 1

  let retweet = Object.assign({}, tweet, {
    id: nanoid(16),
    time, 
    link: tweetId,
    retweeter: username
  })

  Tweets.push(retweet)

  res.json(retweet)
})

app.get('/api/user/:username/:tweetId/delete', (req, res) => {
  const { username, tweetId } = req.params
  const decodedToken = req.user

  if( !username || !tweetId || !decodedToken || decodedToken.username !== username) return res.boom.badData()
  
  let tweetIndex = Tweets.findIndex(tweet => tweet.id === tweetId)
  if( !tweetIndex ) return res.boom.notFound()

  delete Tweets[index]

  res.status(200).end()
})

app.post('/api/user/:username/tweet', (req, res) => {
  const username = req.params.username
  const aTweet = req.body.aTweet
  const decodedToken = req.user

  if( !username || !aTweet || !decodedToken || decodedToken.username !== username) return res.boom.badData()
  
  if(aTweet.thread) {
    let tweet = Tweets.find(tweet => tweet.id === aTweet.thread)
    if(!tweet) return res.boom.badData()

    tweet.replies += 1
  }

  let tweet = Object.assign({}, 
    { likes: 0, replies: 0, retweets: 0, id: nanoid(16), username },
    aTweet
  )

  Tweets.push(tweet)

  res.json(tweet)
})

app.get('/api/user/:username/tweets', (req, res) => {
  let username = req.params.username

  let tweets = Tweets.filter(
    tweet =>
      (tweet.link && tweet.retweeter === username) ||
      (!tweet.link && tweet.username === username)
  )

  tweets.forEach(tweet => {
    tweet.name = Users.find(user => user.username === tweet.username).name
  })

  res.json(tweets)
})

app.get('/api/user/tweets/:thread', (req, res) => {
  let { thread } = req.params

  let tweets = Tweets.filter(t => t.thread === thread)

  tweets.forEach(tweet => {
    tweet.name = Users.find(user => user.username === tweet.username).name
  })

  res.json(tweets)
})

app.listen(3000, () => {
  console.log('App is listening on 3000')
})
