import React from 'react'
import { Card, List } from 'semantic-ui-react'

function TrendList() {
  const trends = [
    {
      tag: 'Javascript',
      tweets: 10
    },
    {
      tag: 'C#',
      tweets: 10
    },
    {
      tag: 'Python',
      tweets: 10
    },
    {
      tag: 'Java',
      tweets: 10
    },
    {
      tag: 'C++',
      tweets: 10
    },
    {
      tag: 'Go',
      tweets: 10
    },
    {
      tag: 'Ruby',
      tweets: 10
    },
    {
      tag: 'Rust',
      tweets: 10
    },
    {
      tag: 'Awesome',
      tweets: 10
    },
    {
      tag: 'Flutter',
      tweets: 10
    }
  ]

  return (
    <List relaxed>
      {
        trends.map(trend => (
          <List.Item key={trend.tag}>
            <List.Content>
              <List.Header as="a">{ trend.tag }</List.Header>
              <List.Description>{ trend.tweets } Tweets</List.Description>
            </List.Content>
          </List.Item>
        ))
      }
    </List>
  )
}

function Trends() {
  return (
    <Card>
      <Card.Content>
        <Card.Header>Trends</Card.Header>
        <Card.Description>
          <TrendList />
        </Card.Description>
      </Card.Content>
    </Card>
  )
}

export default Trends
