import React from 'react'
import { connect } from 'react-redux'
import { compose, withStateHandlers, pure } from 'recompose'
import { Link, Redirect } from 'react-router-dom'

import {
  Grid,
  Form,
  Segment,
  Header,
  Button,
  Image,
  Message
} from 'semantic-ui-react'

import Logo from '../logo.svg'

const withInputHandlers = withStateHandlers(
  { email: '', username: '' },
  {
    handleChange: state => (e, { name, value }) => ({
      ...state,
      [name]: value
    })
  }
)

function Login({
  username,
  email,
  handleChange,
  handleUserPageClicked,
  toUserPage,
  isSignedIn,
  hasError,
  signIn
}) {
  return (
    <div className="login-form">
      <Grid
        textAlign="center"
        verticalAlign="middle"
        style={{ height: '100%' }}>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="blue" textAlign="center">
            <Image src={Logo} /> Log-in to your account
          </Header>
          <Form size="large" error={hasError}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Your username"
                name="username"
                value={username}
                onChange={handleChange}
              />
              <Form.Input
                fluid
                icon="mail"
                iconPosition="left"
                placeholder="Your email address"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <Button
                color="blue"
                fluid
                size="large"
                onClick={() => signIn({ username, email })}
                content="Sign In"
              />
            </Segment>
            {hasError && (
              <Message
                error
                content="Oops! Something's wrong! Please check your info and try again!"
              />
            )}
          </Form>
          {isSignedIn && <Redirect to={username} push />}
          <Message>
            Are you new? Then let's <Link to="/register">Register!</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  )
}

function mapState(state) {
  const user = state.User['user']

  return {
    isSignedIn: user && user.isSignedIn,
    hasError: user && user.hasError
  }
}

function mapDispatch(dispatch) {
  return {
    signIn: userInfo => dispatch.User.signIn(userInfo)
  }
}

export default compose(
  connect(mapState, mapDispatch), 
  withInputHandlers, 
  pure
)(Login)
