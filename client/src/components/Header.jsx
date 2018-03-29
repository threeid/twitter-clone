import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { compose, withState, withHandlers, pure } from 'recompose'
import { Container, Menu, Input } from 'semantic-ui-react'

const withNavigationHandlers = compose(
  withState('userPageClicked', 'updateState', false),
  withHandlers({
    handleUserPageClick: ({ updateState }) => () => updateState(value => !value)
  })
)

// Using isSignedOut to redirect user to '/' index page after user signed out
// We need isSignedOut beside isSignedIn,
// because if we use !isSignedIn, we always are redirected to '/'

function Header({
  userPageClicked,
  handleUserPageClick,
  activeUser,
  isSignedIn,
  isSignedOut,
  signOut
}) {
  return (
    <Menu fixed="top" borderless>
      <Container>
        <Menu.Item name="home" as="a" />
        <Menu.Item name="about" as="a" />
        <Menu.Menu position="right">
          <Menu.Item>
            <Input icon="search" placeholder="Search..." />
          </Menu.Item>
          { activeUser && (
            <Menu.Item name={activeUser} onClick={handleUserPageClick} />
          )}
          { isSignedIn ? (
            <Menu.Item name="Sign out" onClick={() => signOut()} />
          ) : (
            <Link to="/signin">
              <Menu.Item name="Sign In" />
            </Link>
          )}
        </Menu.Menu>
      </Container>
      { userPageClicked && <Redirect to={activeUser} push /> }
      { isSignedOut && <Redirect to="/" push /> }
    </Menu>
  )
}

function mapState(state) {
  const user = state.User['user']

  return {
    activeUser: user.activeUser,
    isSignedIn: user.isSignedIn,
    isSignedOut: user.isSignedOut
  }
}

function mapDispatch(dispatch) {
  return {
    signOut: () => dispatch.User.signOut()
  }
}

export default compose(
  connect(mapState, mapDispatch),
  withNavigationHandlers,
  pure
)(Header)
