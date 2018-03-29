import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { onlyUpdateForKeys, mapProps, compose } from 'recompose'

import { Grid, Container, Card, Image } from 'semantic-ui-react'

import UserInfo from './UserInfo'
import UserHero from './UserHero'
import TweetThread from './TweetThread'
import TweetForm from './TweetForm'
import People from './People'
import Trends from './Trends'
import Footer from './Footer'


function TweetCard({ user }) {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <Image
            size="mini"
            src={user.avatar}
          />
          {user.name}
        </Card.Header>
        <Card.Description>
          <TweetForm />
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

function User({
  isHomePage,
  username,
  user,
  getUser,
  getTweets
}) {

  if (!user) {
    getUser(username)
    getTweets(username)
    return null
  }

  return (
    <React.Fragment>
      <UserHero user={user} ownHomePage={isHomePage}/>
      <Container>
        <Grid columns={3}>
          <Grid.Column width={4}>
            <UserInfo user={user} ownHomePage={isHomePage}/>
          </Grid.Column>

          <Grid.Column width={8}>
            { isHomePage && <TweetCard user={user} /> }
            <TweetThread username={username} />
          </Grid.Column>

          <Grid.Column width={4}>
            <People />
            <Trends />
            <Footer />
          </Grid.Column>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

User.propTypes = {
  getUser: PropTypes.func.isRequired,
  getTweets: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  user: PropTypes.object,
  isHomePage: PropTypes.bool.isRequired
}

const withProps = mapProps(({ match, userStore, getUser, getTweets }) => {
  const username = match.params.username
  const currentUser = userStore['user']

  return {
    username, 
    isHomePage: currentUser.isSignedIn && currentUser.activeUser === username,
    user: userStore[username],
    getUser,
    getTweets
  }
})

function mapState(state) {
  return {
    userStore: state.User
  }
}

function mapDispatch(dispatch) {
  return {
    getUser: username => dispatch.User.getUser(username),
    getTweets: username => dispatch.Tweets.getTweets(username)
  }
}

export default compose(
  withRouter,
  connect(mapState, mapDispatch),
  withProps,
  onlyUpdateForKeys(['username', 'isHomePage', 'user'])
)(User)
