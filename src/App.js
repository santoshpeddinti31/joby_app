import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import Protected from './components/Protected'
import NotFound from './components/NotFound'
import './App.css'

const App = () => (
  <div>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Protected exact path="/" component={Home} />
      <Protected exact path="/jobs" component={Jobs} />
      <Protected exact path="/jobs/:id" component={JobItemDetails} />
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </div>
)

export default App
