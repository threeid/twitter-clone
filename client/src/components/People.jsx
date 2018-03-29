import React from 'react'
import { Card, Button, List, Image } from 'semantic-ui-react'

function UserList() {
  const users = [
    {
      avatar: 'https://pbs.twimg.com/profile_images/451924608388591616/CWE80cBY_bigger.png',
      name: 'React.js News',
      username: 'ReactJSNews'
    },
    {
      avatar: 'https://pbs.twimg.com/profile_images/446356636710363136/OYIaJ1KK_bigger.png',
      name: 'React.js',
      username: 'reactjs'
    },
    {
      avatar: 'https://pbs.twimg.com/profile_images/727278046646915072/cb8U-gL6_bigger.jpg',
      name: 'angular',
      username: 'angular'
    },
    {
      avatar: 'https://pbs.twimg.com/profile_images/875996174305472512/upM71pVR_bigger.jpg',
      name: 'Vue.js',
      username: 'vuejs'
    },
    {
      avatar: 'https://pbs.twimg.com/profile_images/702185727262482432/n1JRsFeB_bigger.png',
      name: 'Node.js',
      username: 'nodejs'
    }
  ]
  return (
    <List relaxed>
    {
      users.map(user => (
        <List.Item key={user.username}>
          <Image avatar src={user.avatar} />
          <List.Content>
            <List.Header as='a'>{user.name}</List.Header>
            <List.Description>{user.username}</List.Description>
          </List.Content>
        </List.Item>
      ))
    }
  </List>
  )
}

function People() {
  return (
    <Card>
      <Card.Content>
        <Button circular size="mini" floated="right" icon="refresh"/>
        <Card.Header>You may also like</Card.Header>
        <Card.Description>
          <UserList/>
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

export default People
