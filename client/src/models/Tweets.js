import { dispatch } from '@rematch/core'
import produce from 'immer' 
import axios from 'axios'

const Api = axios.create({
  baseURL: 'http://localhost:3000/api/user/'
})

const Tweets = {
  state: {},

  reducers: {
    load(state, tweets) {
      return produce(state, draft => {
        tweets.forEach(tweet => draft[tweet.id] = tweet)
      })
    },

    add(state, tweet) {
      return produce(state, draft => {
        draft[tweet.id] = tweet
      })
    },

    update(state, tweet) {
      return produce(state, draft => {
        draft[tweet.id] = { ...tweet }
      })
    },

    delete(state, tweetId) {
      return produce(state, draft => {
        delete draft[tweetId]
      })
    }
  },

  effects: {
    // TODO: add lastUpdate, so only get new tweets from lastUpdate
    // TODO: add pagination
    async getTweets(username, rootState) {
      if(rootState[username]) return

      try {
        const res = await Api.get(`${username}/tweets`)

        dispatch.Tweets.load(res.data)
      }
      catch(err) {
        console.log('getTweets ', err)
      }
    },

    async getThread(thread, rootState) {
      if(rootState[thread]) return

      try {
        const res = await Api.get(`tweets/${thread}`)
      
        dispatch.Tweets.load(res.data)
      }
      catch(err) {
        console.log('getThread ', err)
      }
    }
  }
}

export default Tweets
