import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {IoBag} from 'react-icons/io5'
import Header from '../Header'
import './index.css'

class JobItemDetails extends Component {
  state = {data: {}, jobDetailsStatus: 'loading'}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    console.log(match)
    const {params} = match
    const {id} = params
    console.log(id)
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const jsonResponse = await response.json()
      const jobDetails = jsonResponse.job_details
      console.log(jsonResponse)
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        companyWebsiteUrl: jobDetails.company_website_url,
      }
      const updatedSkills = jobDetails.skills.map(item => ({
        imageUrl: item.image_url,
        name: item.name,
      }))
      const updatedLifeAtCompany = {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      }
      const updatedSimilarJobs = jsonResponse.similar_jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        rating: item.rating,
        title: item.title,
      }))
      const data = {
        jobDetails: updatedJobDetails,
        skills: updatedSkills,
        lifeAtCompany: updatedLifeAtCompany,
        location: jobDetails.location,
        title: jobDetails.title,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        similarJobs: updatedSimilarJobs,
      }
      this.setState({data, jobDetailsStatus: 'success'})
    } else {
      this.setState({jobDetailsStatus: 'failure'})
    }
  }

  renderSkills = () => {
    const {data} = this.state
    return (
      <ul className="list row-wrap">
        {data.skills.map(item => (
          <li className="row skill" key={item.name}>
            <img src={item.imageUrl} alt={item.name} className="skill-img" />
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderJobDetails = () => {
    const {data} = this.state
    const {
      jobDetails,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
    } = data
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      companyWebsiteUrl,
    } = jobDetails
    return (
      <div className="job-item-bg">
        <div className="row">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div>
            <h2>{title}</h2>
            <p>
              <FaStar className="jobs-icon rating" />
              {rating}
            </p>
          </div>
        </div>
        <div className="row-space">
          <div className="row">
            <MdLocationOn className="jobs-icon" />
            <p>{location}</p>
            <IoBag className="jobs-icon bag" />
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="row-space">
          <h2>Description</h2>
          <a href={companyWebsiteUrl} target="__blank">
            Visit
          </a>
        </div>
        <p className="jobs-para">{jobDescription}</p>
        <h2>Skills</h2>
        {this.renderSkills()}
        <h2>Life at company</h2>
        <div className="md-row">
          <p>{lifeAtCompany.description}</p>
          <img
            src={lifeAtCompany.imageUrl}
            alt="life at company"
            className="life-at-company "
          />
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {data} = this.state
    const {similarJobs} = data
    return (
      <ul className="list md-row">
        {similarJobs.map(similarItem => (
          <li key={similarItem.id} className="job-item-bg similar">
            <div className="row">
              <img
                src={similarItem.companyLogoUrl}
                alt="similar job company logo"
                className="company-logo"
              />
              <div>
                <h2>{similarItem.title}</h2>
                <p>
                  <FaStar className="jobs-icon rating" />
                  {similarItem.rating}
                </p>
              </div>
            </div>
            <h2>Description</h2>
            <p>{similarItem.jobDescription}</p>
            <div className="row">
              <MdLocationOn className="jobs-icon" />
              <p>{similarItem.location}</p>
              <IoBag className="jobs-icon bag" />
              <p>{similarItem.employmentType}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderData = () => {
    const {jobDetailsStatus} = this.state
    if (jobDetailsStatus === 'success') {
      return (
        <ul className="details-bg list">
          <li>
            <Header />
          </li>
          <div className="details-bg list">
            <li>{this.renderJobDetails()}</li>
            <li>
              <h2>Similar Jobs</h2>
              {this.renderSimilarJobs()}
            </li>
          </div>
        </ul>
      )
    }
    if (jobDetailsStatus === 'failure') {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for.</p>
          <button type="button" onClick={this.getData}>
            Retry
          </button>
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
    return <div>{this.renderData()}</div>
  }
}
export default JobItemDetails
