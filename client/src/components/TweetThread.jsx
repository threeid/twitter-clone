import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { pure, mapProps, compose } from 'recompose'
import { Feed } from 'semantic-ui-react'

import TweetFeed from './TweetFeed'

const withProps = mapProps(
  ({ username, thread, replies, tweetStore, getThread }) => {
    let tweets = []

    const keys = Object.keys(tweetStore)

    if (username) {
      tweets = keys
        .filter(k => tweetStore[k].username === username)
        .map(k => tweetStore[k])
    } else if (thread) {
      tweets = keys.filter(k => tweetStore[k].thread === thread).map(k => tweetStore[k])

      if (tweets.length !== replies) getThread(thread)
    }

    return { tweets }
  }
)

function TweetThread({ tweets }) {
  if (!tweets.length) return null

  return (
    <Feed>{tweets.map(item => <TweetFeed tweet={item} key={item.id} />)}</Feed>
  )
}

TweetThread.propTypes = {
  tweets: PropTypes.array
}

function mapState(state) {
  return {
    tweetStore: state.Tweets
  }
}

function mapDispatch(dipatch) {
  return {
    getThread: thread => dipatch.Tweets.getThread(thread)
  }
}

export default compose(
  connect(mapState, mapDispatch),
  withProps,
  pure
)(TweetThread)
