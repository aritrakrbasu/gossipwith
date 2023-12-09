import { Route,  HashRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import CreateProfile from './routes/CreateProfile';
import Dashboard from './routes/Dashboard';
import Profile from './routes/Profile';
import SendMessage from './routes/SendMessage';

function App() {
  return (
    <Router>
    <AuthProvider>
      <Switch>
        <PrivateRoute path="/createProfile" component={CreateProfile}/>
        <PrivateRoute path="/dashboard" component={Dashboard}/>
        <PrivateRoute path="/profile" component={Profile}/>
        <Route path="/:userid" component={SendMessage}/>
        <Route exact path="/" component={Login} />
      </Switch>
    </AuthProvider>
  </Router>
  );
}

export default App;
