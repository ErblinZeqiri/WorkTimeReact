import React from "react";
import "./login.css";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import GoogleLogin from "./GoogleLogin";


const Login = () => {
  return (
    <>
      <div className="frame">
        <div className="d-flex main-content">
          <div className="login mr-2">
            <div className="loginCadre">
              <div className="form-container">
                <p className="title">Welcome</p>
                <form className="form">
                  <input type="text" className="input" placeholder="Name" />
                  <input
                    type="text"
                    className="input"
                    placeholder="Firstname"
                  />

                  <div className="dropdown">
                    <input
                      type="text"
                      className="input"
                      id="searchInput"
                      placeholder="Organisation"
                    />
                    <div className="dropdown-content input"></div>
                  </div>

                  <input type="email" className="input" placeholder="Email" />
                  <input
                    type="password"
                    className="input"
                    placeholder="Password"
                  />
                  <p className="page-link">
                    <span className="page-link-label">Forgot Password?</span>
                  </p>
                  <button className="form-btn">Log in</button>
                </form>
                <p className="sign-up-label">
                  Don't have an account?
                  <span className="sign-up-link">Sign up</span>
                </p>
                <GoogleLogin />
              </div>
            </div>
          </div>
          <div className="logo">
            <div className="logoCadre">
              <img
                src="./src/assets/images/PhotoRoom-20240501_131716.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
