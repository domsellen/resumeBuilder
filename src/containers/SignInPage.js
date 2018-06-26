import React, { Component } from "react";
import { connect } from "react-redux";
import { signIn } from "../actions";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom'; //navigate in app

import logo from '../img/logoColor.png';


class Signin extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentWillUpdate(nextProps) {
    if (nextProps.auth) {
      console.log("Authenticated")
    }
  }
  formSubmit = (event) => {
    const email = event.target[0].value;
    const pass = event.target[1].value;
    this.props.signIn(email, pass);
  }
  render() {
    return (
      <div id="SignInPage" className="builderCss">
        <ul className='tabs'>
          <li className="active">Sign in</li>
          <li><Link to="/signUp">Sign up</Link></li>
        </ul>
        <div className="side">
          <div className="container">
            <img src={logo} alt='ResumePage Logo' />
            <h2>Great to see you again!</h2>
            <form onSubmit={this.formSubmit}>
              <div >
                <label>Email</label>
                <input type="email" />
              </div>
              <div >
                <label>Password</label>
                <input type="password" />
              </div>
              <button className='btn btn-primary full-width'>Sign in</button>
            </form>
            <p className="center"><Link to={'/signinforgot'} className="center">Forgot password?</Link></p>
            <p className='center'>Or</p>
            <button href="#" className="btn full-width google social-signin" onClick={this.props.signInForgot}>
              <i className="fa fa-google social-signin-icon" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, { signIn })(Signin);
