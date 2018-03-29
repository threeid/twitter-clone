import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import Header from './components/Header'
import User from './components/User'
import SignIn from './components/SignIn'
import Register from './components/Register'

import './semantic.min.css'
import './App.css'

function App({ user }) {
  return (
    <Router>
      <Container fluid>
        <Header />
        <Switch>
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/register" component={Register} />
          <Route path="/:username" component={User} />
        </Switch>
      </Container>
    </Router>
  )
}

export default App
