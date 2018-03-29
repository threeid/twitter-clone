import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  Form,
  Segment,
  Message,
  Header,
  Button,
  Image
} from 'semantic-ui-react'

import Logo from '../logo.svg'

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = { name: '', username: '', email: '' }
    this.handleChange = this.handleChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  handleChange(e, { name, value }) {
    this.setState({ [name]: value })
  }

  submit() {
    // TODO: validate user's input
    this.props.register(this.state)
  }

  render() {
    const { name, username, email } = this.state
    const { hasError, isRegistered } = this.props

    return (
      <div className="login-form">
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
        <Grid
          textAlign="center"
          verticalAlign="middle"
          style={{ height: '100%' }}>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="blue" textAlign="center">
              <Image src={Logo} /> Create your account
            </Header>
            <Form size="large" error={hasError} success={isRegistered}>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Your username"
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Your name"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="Your email address"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                />
                <Button
                  color="blue"
                  fluid
                  size="large"
                  onClick={this.submit}
                  content="Register"
                />
              </Segment>
              {hasError && (
                <Message
                  error
                  content="Oops! Something's wrong! Please try again!"
                />
              )}
              {isRegistered && (
                <Message
                  success
                  content="We just sent you a verification link. Please verify your account!"
                />
              )}
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

function mapState(state) {
  return {
    hasError: state.User['user'] && state.User['user'].hasError,
    isRegistered: state.User['user'] && state.User['user'].isRegistered
  }
}

function mapDispatch(dispatch) {
  return {
    register: userInfo => dispatch.User.register(userInfo)
  }
}

export default connect(mapState, mapDispatch)(Signup)
