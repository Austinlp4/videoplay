import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import firebase, { auth } from '../../firebase';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { signIn } from '../../store/actions/authActions';
import { Redirect, NavLink } from 'react-router-dom';

class Signin extends Component {
 state = {
   email: '',
   password: '',
   error: null,
 };
handleInputChange = (event) => {
   this.setState({ [event.target.name]: event.target.value });
 };

handleSubmit = (event) => {
   event.preventDefault();
   const { email, password } = this.state;
   const creds = {email,password};
   this.props.signIn(creds)

 };
 render() {
   const { authError } = this.props;
   const { email, password, error } = this.state;
   if(this.props.auth.uid) return <Redirect to='/' />
   return (
    <div>
     <div>
       <div>
         <div>         
           <NavLink to='/signup' className='reroute'>
              New? Sign Up Here!
           </NavLink>
         </div>
       </div>
       {error ? (
         <div>
           <div>
             <p>{error.message}</p>
           </div>
         </div>
       ) : null}
       <div>
         <div>
           <form onSubmit={this.handleSubmit}>
             <input type="text" name="email" placeholder="Email" value={email} onChange={this.handleInputChange} />
             <input
               type="password"
               name="password"
               placeholder="Password"
               value={password}
               onChange={this.handleInputChange}
             />
             <button children="Log In" />
             <div>
                {authError ? <p>{authError}</p> : null}
             </div>
           </form>
         </div>
       </div>
     </div>
     </div>
   );
 }
}



const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds) => dispatch(signIn(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signin))