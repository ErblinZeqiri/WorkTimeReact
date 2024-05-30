import React from "react";
import "../../styles/login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoogleLogin from "./GoogleLogin";
import ApiData from "../../providers/ApiData";

const Login = () => {
  return (
    <>
      <div className="d-flex main-content">
        <div className="login mr-2">
          <div className="loginCadre">
            <div className="form-container">
              <p className="title">Welcome</p>
              <form className="form">
                <input type="text" className="input" placeholder="Name" />
                <input type="text" className="input" placeholder="Firstname" />
                <ApiData />
                <input type="email" className="input" placeholder="Email" />
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                />
                <p className="page-link">
                  <span className="page-link-label">Forgot Password?</span>
                </p>
                <button className="form-btn">Sign in</button>
              </form>
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
    </>
  );
};

export default Login;
