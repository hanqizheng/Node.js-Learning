import React, { Component } from 'react'
import propTypes from 'prop-type'

class CommentInput extends Component {
  static propTypes = {
    onSubmit: propTypes.func
  }

  constructor() {
    super()
    this.state = {
      username: '',
      content: ''
    }
  }

  componentDidMount() {
    this.textarea.focus()
  }

  componentWillMount() {
    this._localUsername()
  }

  handleUsernameChange(event) {
    this.setState({
      username:event.target.value
    })
  }

  handleContentChange(event) {
    this.setState({
      content:event.target.value
    })
  }

  handleSubmit(event) {
    if (this.props.onSubmit) {
      this.props.onSubmit({
        username: this.state.username,
        content: this.state.content,
        createdTime: +new Date()
      })
    }
    this.setState({content: ''})
  }

_localUsername() {
  const username = localStorage.getItem('username')
  if (username) {
    this.setState({ username })
  }
}

  _saveUsername (username) {
    localStorage.setItem('username', username)
  }

  handleUsernameBlur(event) {
    this._saveUsername(event.target.value)
  }

  render() {
    return (
      <div className='comment-input'>
        <div className='comment-field'>
          <span className='comment-field-name'>用户名:</span>
          <div className='comment-field-input'>
            <input 
              value={this.state.username}
              onBlur={this.handleUsernameBlur.bind(this)}
              onChange={this.handleUsernameChange.bind(this)} />
          </div>
        </div>
        <div className='comment-field'>
          <span className='comment-field-name'>内容:</span>
          <div className='comment-field-input'>
            <textarea
              ref={(textarea) => this.textarea = textarea}
              value={this.state.content}
              onChange={this.handleContentChange.bind(this)} />
          </div>
        </div>
        <div className='comment-field-button'>
          <button
            onClick={this.handleSubmit.bind(this)}>
              发布
          </button>
        </div>
      </div>
    )
  }
}

export default CommentInput