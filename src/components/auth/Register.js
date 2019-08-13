import React from 'react';
import { withRouter} from 'react-router-dom';
// import styled from 'styled-components';
// import firebase from '../../firebase';
// import Register from './Register';
import { signUp, signUpWithGoogle } from '../../store/actions/authActions.js';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      followers: 0,
      passValid: false
    };
  }

  onChange = event => {
    if(event.target.value.length > 0 && event.target.value.length < 6){
      this.setState({
        [event.target.name]: event.target.value,
        passValid: true
      })
    }else{
      this.setState({
        [event.target.name]: event.target.value,
      })
    }
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.signUp(this.state)
    this.props.history.push('/signin');
  };

  historyPush = () => {
    this.props.history.push('/')
  }
  

  googleSign = event => {
    event.preventDefault();
    this.props.signUpWithGoogle();

  }

  
  render() {
    return (
      <div >
      <div>
        <div >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NavLink to='/signin' className='reroute' style={{ alignSelf: 'center' }}>
              Already a user? Sign in here!
           </NavLink>
          </div>
        </div>
        <div>
          <div>
            <form onSubmit={this.onSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.onChange}
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.onChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.onChange}
              />
              {this.state.passValid
              ?
                <p 
                style={{ margin: '0 0', fontSize: '.8rem', color: 'red' }}
                >Password must be at least 6 characters</p>
                :
                null
            }
              <button children="Register" />
              <div>
                {this.props.authError ? <p>{this.props.authError}</p> : null}
              </div>
            </form>
          </div>
        </div>
        {/* <Route
            path="/register"
            render={props => (
              <Register {...props} newUser={this.props.newUser} />
            )}
          /> */}
      </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (newUser) => dispatch(signUp(newUser)),
    signUpWithGoogle: (newUser) => dispatch(signUpWithGoogle(newUser))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));