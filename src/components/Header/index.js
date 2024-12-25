import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Header extends Component {
  logout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    return (
      <ul className="header-bg list">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
        </li>
        <li className="row">
          <Link to="/" className="link">
            <p>Home</p>
          </Link>
          <Link to="/jobs" className="link">
            <p>Jobs</p>
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={this.logout}
            className="btn header-btn"
          >
            Logout
          </button>
        </li>
      </ul>
    )
  }
}
export default withRouter(Header)
