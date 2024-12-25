import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {IoBag} from 'react-icons/io5'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Jobs extends Component {
  state = {
    profileData: {},
    profileStatus: 'loading',
    jobsData: [],
    jobsStatus: 'loading',
    searchInput: '',
    employment: [],
    salaryRange: '',
  }

  employmentTypesList = [
    {
      label: 'Full Time',
      employmentTypeId: 'FULLTIME',
    },
    {
      label: 'Part Time',
      employmentTypeId: 'PARTTIME',
    },
    {
      label: 'Freelance',
      employmentTypeId: 'FREELANCE',
    },
    {
      label: 'Internship',
      employmentTypeId: 'INTERNSHIP',
    },
  ]

  salaryRangesList = [
    {
      salaryRangeId: '1000000',
      label: '10 LPA and above',
    },
    {
      salaryRangeId: '2000000',
      label: '20 LPA and above',
    },
    {
      salaryRangeId: '3000000',
      label: '30 LPA and above',
    },
    {
      salaryRangeId: '4000000',
      label: '40 LPA and above',
    },
  ]

  jwtToken = Cookies.get('jwt_token')

  componentDidMount() {
    this.getData()
    this.getJobsData()
  }

  getData = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const jsonResponse = await response.json()
      const data = jsonResponse.profile_details
      const profileData = {
        name: data.name,
        profileImageUrl: data.profile_image_url,
        shortBio: data.short_bio,
      }
      this.setState({profileData, profileStatus: 'success'})
    } else {
      this.setState({profileStatus: 'failure'})
    }
  }

  renderProfile = () => {
    const {profileData, profileStatus} = this.state
    if (profileStatus === 'success') {
      const {name, profileImageUrl, shortBio} = profileData
      return (
        <div className="profile-bg">
          <img src={profileImageUrl} alt="profile" />
          <h1 className="profile-head">{name}</h1>
          <p className="profile-para">{shortBio}</p>
        </div>
      )
    }
    if (profileStatus === 'failure') {
      return (
        <button type="button" className="btn header-btn" onClick={this.getData}>
          Retry
        </button>
      )
    }
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  onSearchChange = event => {
    this.setState({searchInput: event.target.value})
  }

  getResults = () => {
    this.getJobsData()
  }

  employmentChange = id => event => {
    const {checked} = event.target
    this.setState(prevState => {
      const {employment} = prevState
      if (checked) {
        return {employment: [...employment, id]}
      }
      return {
        employment: employment.filter(item => item !== id),
      }
    }, this.getJobsData)
  }

  salaryChange = id => () => {
    this.setState({salaryRange: id}, this.getJobsData)
  }

  getJobsData = async () => {
    const {searchInput, employment, salaryRange} = this.state
    const employmentString = employment.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentString}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const jsonData = await response.json()
      const {jobs} = jsonData
      if (jobs.length === 0) {
        this.setState({jobsStatus: 'noJobs'})
      } else {
        const updatedData = jobs.map(item => ({
          companyLogoUrl: item.company_logo_url,
          employmentType: item.employment_type,
          id: item.id,
          jobDescription: item.job_description,
          location: item.location,
          packagePerAnnum: item.package_per_annum,
          rating: item.rating,
          title: item.title,
        }))
        this.setState({jobsData: updatedData, jobsStatus: 'success'})
      }
    } else {
      this.setState({jobsStatus: 'failure'})
    }
  }

  renderJobs = () => {
    const {jobsData, jobsStatus} = this.state
    if (jobsStatus === 'success') {
      return (
        <ul className="list">
          {jobsData.map(item => (
            <li className="job-item-bg" key={item.id}>
              <Link to={`/jobs/${item.id}`} className="link-class">
                <div className="row">
                  <img
                    src={item.companyLogoUrl}
                    alt="company logo"
                    className="company-logo"
                  />
                  <div>
                    <h2>{item.title}</h2>
                    <p>
                      <FaStar className="jobs-icon rating" />
                      {item.rating}
                    </p>
                  </div>
                </div>
                <div className="row-space">
                  <div className="row">
                    <MdLocationOn className="jobs-icon" />
                    <p>{item.location}</p>
                    <IoBag className="jobs-icon bag" />
                    <p>{item.employmentType}</p>
                  </div>
                  <p>{item.packagePerAnnum}</p>
                </div>
                <hr />
                <h2>Description</h2>
                <p className="jobs-para">{item.jobDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      )
    }
    if (jobsStatus === 'failure') {
      return (
        <div className="fail-bg">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We Cannot seem to find the page you are looking for.</p>
          <button
            type="button"
            className="btn header-btn"
            onClick={this.getJobsData}
          >
            Retry
          </button>
        </div>
      )
    }
    if (jobsStatus === 'noJobs') {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  render() {
    const {searchInput, salaryRange} = this.state
    return (
      <>
        <Header />
        <div className="jobs-bg">
          <div className="top">
            {this.renderProfile()}
            <hr />
            <h1 className="type-head">Type of Employment</h1>
            <ul className="list">
              {this.employmentTypesList.map(item => (
                <li className="row" key={item.employmentTypeId}>
                  <input
                    type="checkBox"
                    id={item.employmentTypeId}
                    onChange={this.employmentChange(item.employmentTypeId)}
                  />
                  <label htmlFor={item.employmentTypeId}>{item.label}</label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="type-head">Salary Range</h1>
            <ul className="list">
              {this.salaryRangesList.map(item => (
                <li key={item.salaryRangeId}>
                  <input
                    type="radio"
                    id={item.salaryRangeId}
                    checked={salaryRange === item.salaryRangeId}
                    onChange={this.salaryChange(item.salaryRangeId)}
                  />
                  <label htmlFor={item.salaryRangeId}>{item.label}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="btm">
            <div className="row-space search">
              <input
                type="search"
                placeholder="search"
                value={searchInput}
                onChange={this.onSearchChange}
                className="search-input"
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-icon"
                onClick={this.getResults}
              >
                <BsSearch />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
