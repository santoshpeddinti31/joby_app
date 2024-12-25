import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="home-bg">
          <div className="text">
            <h1 className="head">Find The Job That Fits Your Life</h1>
            <p>
              Millions of people are searching for jobs,salary information,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
            <Link to="/jobs">
              <button type="button" className="btn header-btn">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </>
    )
  }
}
export default Home
