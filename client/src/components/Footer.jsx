import React from 'react'
import { List } from 'semantic-ui-react'

function Footer() {
  return (
    <List size="tiny" horizontal>
      <List.Item>Copyright@ N.P.Tien</List.Item>
      <List.Item as='a'>Help</List.Item>
      <List.Item as='a'>Terms</List.Item>
      <List.Item as='a'>Policy</List.Item>
      <List.Item as='a'>Ads Info</List.Item>
      <List.Item as='a'>Blog</List.Item>
    </List>
  )
}

export default Footer
