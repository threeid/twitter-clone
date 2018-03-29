import React from 'react'
import { Grid, Container, Menu, Button } from 'semantic-ui-react'

import UserAvatar from './UserAvatar'

function UserHero({ user, ownHomePage }) {
  return (
    <Grid>
      <Grid.Row
        style={{
          height: 280,
          background: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)'
        }}
      />
      <Grid.Row>
        <Container>
          <Grid columns={2}>
            <Grid.Column width={4}>
              <UserAvatar user={user} ownHomePage={ownHomePage}/>
            </Grid.Column>
            <Grid.Column width={12}>
              <Menu borderless>
                <Menu.Item name={user.tweets + 'tweets'} />
                <Menu.Item name={user.followers + 'followers'} />
                <Menu.Item name={user.followings + 'followings'} />
                { !ownHomePage &&
                  <Menu.Menu position="right">
                    <Menu.Item>
                      <Button icon="star" content="Follow" />
                    </Menu.Item>
                  </Menu.Menu>
                }
              </Menu>
            </Grid.Column>
          </Grid>
        </Container>
      </Grid.Row>
    </Grid>
  )
}

export default UserHero
