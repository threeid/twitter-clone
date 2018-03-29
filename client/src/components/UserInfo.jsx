import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, List, Form } from 'semantic-ui-react'
import format from 'date-fns/format'

class UserInfo extends Component {
  constructor(props) {
    super(props)

    this.state = { showForm: false, icon: 'edit' }

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(e, { name, value }) {
    this.setState({ [name]: value })
  }

  handleClick() {
    if(this.state.showForm) {
      this.setState({ icon: 'edit' })

      this.props.update(this.state)
    }
    else {
      const { bio, email } = this.props.user
      this.setState({ icon: 'check', bio, email })
    }

    this.setState({ showForm: !this.state.showForm })
  }

  render() {
    const { user, ownHomePage } = this.props
    const { bio, email, icon, showForm } = this.state

    return (
      <Card>
        <Card.Content>
          { ownHomePage && <Button basic size="mini" icon={icon} floated="right" onClick={ this.handleClick }/> }
          <Card.Header>{user.name}</Card.Header>
          <Card.Meta>{user.username}</Card.Meta>
          <Card.Description>
            <List relaxed>
              { showForm ?
                (<Form>
                  <Form.Input icon="address card" iconPosition='left' name="bio" value={bio} onChange={this.handleChange} />
                  <Form.Input icon="mail" iconPosition='left' name="email" value={email} onChange={this.handleChange} />
                </Form>)
                :
                (<div>
                  <List.Item>{user.bio}</List.Item>
                  <List.Item>
                    <List.Icon name="mail" />
                    <List.Content>{user.email}</List.Content>
                  </List.Item>
                </div>)
              }
              <List.Item>
                <List.Icon name="calendar" />
                <List.Content>{format(user.time, 'MMM, DD YYYY')}</List.Content>
              </List.Item>
            </List>
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}

function mapDispatch(dispatch) {
  return {
    update: (userInfo) => dispatch.User.update(userInfo)
  }
}

export default connect(null, mapDispatch)(UserInfo)
