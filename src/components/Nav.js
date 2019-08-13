import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../store/actions/authActions';

const Nav = (props) => {
    return(
        <div>
            <NavLink to={`/${props.auth.uid}`}></NavLink>
            <div onClick={props.signOut}>Sign out</div>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
      signOut: () => dispatch(signOut()),
    };
  };
  
  const mapStateToProps = state => {
    console.log(state);
    return {
      auth: state.firebase.auth,
      profile: state.firebase.profile,
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Nav);
