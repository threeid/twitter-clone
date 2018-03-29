import { dispatch } from '@rematch/core'
import produce from 'immer'
import axios from 'axios'
import DB from './DB'

const Api = axios.create({
  baseURL: 'http://localhost:3000/api/user/'
})

const defaultUser = {
  'username': 'user', activeUser: '', isSignedIn: false, hasError: false
}

const User = {
  state: {
    'user': defaultUser
  },

  reducers: {
    load(state, payload) {
      return produce(state, draft => {
        draft[payload.username] = payload
      })
    },

    updateSync(state, payload) {
      return produce(state, draft => {
        draft[payload.username] = { ...state[payload.username], ...payload }  
        DB.addUser(draft[payload.username])
      })
    },

    delete(state, username) {
      DB.deleteUser(username)

      return produce(state, draft => {
        delete draft[username]
      })
    },
  },

  effects: {
    async restore() {
      try {
        let user = await DB.getUser('user')
        if (user && user.token) {
          Api.defaults.headers.common['authorization'] = 'Bearer ' + user.token

          dispatch.User.load(user)
        }
        else {
          dispatch.User.load(defaultUser)
          DB.addUser(defaultUser)
        }
      }
      catch(err) {
        console.log('restore ', err)
      }
    },

    async getUser(username, rootState) {
      let user = await DB.getUser(username)

      if (user) dispatch.User.load(user)
      else {
        try {
          const res = await Api.get(`${username}`)

          dispatch.User.load(res.data)

          DB.addUser(res.data)
        }
        catch(err) {
          console.log('getUser ', err)
        }
      }      
    },

    async register(userInfo, rootState) {
      try {
        await Api.post('register', userInfo)

        dispatch.User.updateSync({
          username: 'user',
          isRegistered: true,
          hasError: false
        })
      } catch (err) {
        console.log('register ', err)

        dispatch.User.updateSync({
          username: 'user',
          isRegistered: false,
          hasError: true
        })
      }
    },

    async signIn(userInfo, rootState) {
      try {
        let res = await Api.post('signin', userInfo)

        Api.defaults.headers.common['authorization'] = 'Bearer ' + res.data.token

        let currentUser = {
          username: 'user',
          hasError: false,
          isSignedIn: true,
          activeUser: userInfo.username,
          token: res.data.token
        }

        dispatch.User.updateSync(currentUser)

      } catch (err) {
        console.log('signIn ', err)

        dispatch.User.updateSync({ username: 'user', hasError: true })
      }
    },

    async signOut(payload, rootState) {
      const user = rootState.User['user']

      try {
        await Api.get(`${user.activeUser}/signout`)

        delete Api.defaults.headers.common['authorization']

        dispatch.User.delete(user.activeUser)
        dispatch.User.load(defaultUser)
      }
      catch(err) {
        console.log('signOut ', err)
      }
    },

    async update(userInfo, rootState) {
      let user = rootState.User['user']

      try {
        const res = await Api.post(`${user.activeUser}/update`, { userInfo })

        dispatch.User.updateSync(res.data)
      }
      catch(err) {
        console.log('update ', err)
      }
    },

    async upload(avatar, rootState) {
      let user = rootState.User['user']

      try {
        const formData = new FormData()
        formData.append('avatar', avatar)

        const res = await Api.post(`${user.activeUser}/upload`, formData)

        dispatch.User.updateSync(res.data)
      }
      catch(err) {
        console.log('upload ', err)
      }
    },

    async follow(username, rootState) {
      let user = rootState.User['user']
      
      try {
        Api.post(`${username}/follow`, { following: user.activeUser })

        dispatch.User.updateSync({ username, followers: rootState.User[username].followers + 1 })
        dispatch.User.updateSync({ username: user.activeUser, followings: rootState.User[user.activeUser].followings + 1 })
      }
      catch(err) {
        console.log('follow ', err)
      }
    },

    // TODO: add function to fronend, redirect, clear cache 
    async deleteAccount(payload, rootState) {
      let user = rootState.User['user']

      try {
        Api.get(`${user.activeUser}/delete`)
      }
      catch(err) {
        console.log('deleteAccount ', err)
      }
    },

    async tweet(payload, rootState) {
      let user = rootState.User['user']

      try {
        const aTweet = { time: Date.now(), text: payload.text }
        if(payload.tweet) aTweet.thread = payload.tweet.id
        const res = await Api.post(`${user.activeUser}/tweet`, { aTweet })

        dispatch.Tweets.add(res.data)

        if(payload.tweet) {
          let { tweet } = payload
          dispatch.Tweets.update({ ...tweet, replies: tweet.replies + 1})
        }
      }
      catch(err) {
        console.log('tweet ', err)
      }
    },

    async likeTweet(tweet, rootState) {
      let user = rootState.User['user']

      try {
        Api.get(`${user.activeUser}/${tweet.id}/like`)

        dispatch.Tweets.update({ ...tweet, likes: tweet.likes + 1})
      }
      catch(err) {
        console.log('likeTweet ', err)
      }
    },

    async retweet(tweet, rootState) {
      let user = rootState.User['user']

      try{
        const res = await Api.post(`${user.activeUser}/${tweet.id}/retweet`, { time: Date.now() })

        dispatch.Tweets.add(res.data)
        dispatch.Tweets.update({ ...tweet, retweets: tweet.retweets + 1})
      }
      catch(err) {
        console.log('retweet ', err)
      }
    },

    async deleteTweet(tweetId, rootState) {
      let user = rootState.User['user']

      try {
        Api.get(`${user.activeUser}/${tweetId}/delete`)

        dispatch.Tweets.delete({ username: user.activeUser, tweetId})
      }
      catch(err) {
        console.log('deleteTweet ', err)
      }
    }
  }
}

export default User
