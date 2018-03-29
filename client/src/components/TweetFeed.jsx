import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Feed, Image, Icon } from 'semantic-ui-react'

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

import TweetThread from './TweetThread'
import TweetForm from './TweetForm'

class TweetFeed extends Component {
  constructor(props) {
    super(props)

    this.state = { isOpened: false, canShowForm: false }

    this.toggleThread = this.toggleThread.bind(this)
    this.toggleForm = this.toggleForm.bind(this)
  }

  toggleThread() {
    const { tweet } = this.props

    if (!this.state.isOpened && tweet.replies > 0) {
      const thread = tweet.link ? tweet.link : tweet.id

      this.setState({ thread })
      this.props.getThread(thread)
    }

    this.setState({ isOpened: !this.state.isOpened })
  }

  toggleForm() {
    if (this.props.isSignedIn) {
      const { tweet } = this.props
      const thread = tweet.link ? tweet.link : tweet.id

      this.setState({ canShowForm: true, thread })
    }
  }

  render() {
    const { canShowForm, isOpened, thread } = this.state
    const { tweet, retweet, like } = this.props

    return (
      <Feed.Event>
        <Feed.Label>
          <Image
            size="mini"
            src="https://pbs.twimg.com/profile_images/446356636710363136/OYIaJ1KK_bigger.png"
          />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <div>
              { tweet.link && [tweet.retweeter, " retweet from"] }
              { tweet.thread && ["Reply to ", tweet.thread]}
            </div>
            <Link to={'/' + tweet.username}>
              <Feed.User as="span">{tweet.name} &nbsp;</Feed.User>
              <Feed.Date as="span">
                {tweet.username + ' ' + distanceInWordsToNow(tweet.time)}
              </Feed.Date>
            </Link>
          </Feed.Summary>
          <Feed.Extra onClick={ this.toggleThread } text as="div">
            { tweet.text }
          </Feed.Extra>
          <Feed.Meta>
            <Feed.Like onClick={ this.toggleForm }>
              <Icon name="comments" />
              { tweet.replies }
            </Feed.Like>
            <Feed.Like onClick={ () => retweet(tweet) }>
              <Icon name="linkify" />
              { tweet.retweets }
            </Feed.Like>
            <Feed.Like onClick={ () => like(tweet) }>
              <Icon name="heart" />
              { tweet.likes }
            </Feed.Like>
          </Feed.Meta>
          { 
            canShowForm &&
            <TweetForm tweet={tweet} />
          }
          {
            isOpened &&
            <TweetThread thread={thread} replies={tweet.replies} />
          }
        </Feed.Content>
      </Feed.Event>
    )
  }
}

function mapState(state) {
  return {
    isSignedIn: state.User['user'].isSignedIn
  }
}

function mapDispatch(dispatch) {
  const User = dispatch.User

  return {
    like: tweet => User.likeTweet(tweet),
    retweet: tweet => User.retweet(tweet),
    getThread: thread => dispatch.Tweets.getThread(thread)
  }
}

export default connect(mapState, mapDispatch)(TweetFeed)
