import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', err: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.setState({err: ''})
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.setState({err: data.error_msg})
    }
  }

  checkUsername = () => {}

  render() {
    const {username, password, err} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg">
        <form onSubmit={this.submitForm} className="login-form">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-website-logo"
          />

          <label htmlFor="username">USERNAME</label>

          <input
            type="text"
            id="username"
            value={username}
            onChange={this.onChangeUsername}
            placeholder="Username"
          />
          <label htmlFor="password">PASSWORD</label>

          <input
            type="password"
            id="password"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
          />
          <button type="submit" className="btn">
            Login
          </button>
          {err !== '' && <p className="red">{err}</p>}
        </form>
      </div>
    )
  }
}
export default Login
