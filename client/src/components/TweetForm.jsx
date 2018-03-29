import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose, withStateHandlers, onlyUpdateForKeys } from 'recompose'
import { Form, TextArea, Button } from 'semantic-ui-react'

const withTextHandler = withStateHandlers(
  { text: '' },
  {
    handleChange: ({ text }) => (e, { value }) => ({ text: value })
  }
)

function TweetForm({ tweet, text, handleChange, sendTweet }) {
  return (
    <Form>
      <Form.Field>
        <TextArea
          value={ text }
          placeholder="What is on your mind?"
          onChange={ handleChange } />
      </Form.Field>
      <Button
        content="Send"
        icon="send"
        labelPosition="right"
        floated="right"
        onClick={() => sendTweet({ text, tweet })}/>
    </Form>
  )
}

TweetForm.propTypes = {
  text: PropTypes.string.isRequired,
  tweet: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  sendTweet: PropTypes.func.isRequired
}

function mapDispatch(dispatch) {
  return {
    sendTweet: payload => dispatch.User.tweet(payload)
  }
}

export default compose(
  connect(null, mapDispatch),
  withTextHandler,
  onlyUpdateForKeys(['text'])
)(TweetForm)
