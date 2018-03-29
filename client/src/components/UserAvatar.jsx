import React, { Component } from 'react'
import { connect } from 'react-redux'

import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import { Button, Image } from 'semantic-ui-react'

class UserAvatar extends Component {
  constructor() {
    super()
    this.state = { image: null, showUpload: false }
  }

  toggleUpload = () => {
    this.setState({ showUpload: !this.state.showUpload })
  }

  handleDrop = dropped => {
    this.setState({ image: dropped[0] })
  }

  handleRef = node => {
    this.setState({ avatarEditorRef: node })
  }

  handleCheck = () => {
    if(!this.state.avatarEditorRef) return

    const canvas = this.state.avatarEditorRef.getImageScaledToCanvas()

    canvas.toBlob(blob => {
      this.props.upload(blob)
    })

    this.setState({ showUpload: false })
  }

  render() {
    const { user, ownHomePage } = this.props
    const { showUpload } = this.state
    let dropzoneRef
    
    return (
      <div className="userProfileAvatar">
        {
          !showUpload ?
            (<div>
              <Image size="small" src={user.avatar}/>
              { ownHomePage && <Button icon="edit" floated="right" onClick={this.toggleUpload}/> }
            </div>)
          :
          (
          <Dropzone
            disableClick
            ref={(node) => { dropzoneRef = node }}
            onDrop={this.handleDrop}
            style={{ width: 150, height: 150, position: 'relative', bottom: 50 }}>
            <Button icon="upload" floated="right" onClick={() => { dropzoneRef.open() }}/>
            <Button icon="check" floated="right" onClick={this.handleCheck}/>

            <AvatarEditor width={150} height={150} borderRadius={100} scale={2} image={this.state.image} ref={ this.handleRef }/>
          </Dropzone>
          )
        }
      </div>
    )
  }
}

function mapDispatch(dispatch) {
  return {
    upload: (avatar) => dispatch.User.upload(avatar)
  }
}

export default connect(null, mapDispatch)(UserAvatar)
