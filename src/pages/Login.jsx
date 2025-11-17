import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import API_BASE_URL from "../config.js";
// import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
// Function to set a cookie
function setCookie(name, value) {
  document.cookie = `${name}=${value};  path=/`; // Set the cookie with name, value, and path
}

const Login = ({ setModel1 }) => {
  // email password capture
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform data validation
    if (username.trim() === "") {
      // Handle empty username error
      alert("please add a username");
      return;
    }
    if (password.trim() === "" || password.length < 4) {
      // Handle empty or short password error
      alert("the password should be more than 4 characters long");
      return;
    }
    try {
      // Data is valid, send the registration request to the backend
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const json_data = await response.json();
      if (response.ok) {
        if (json_data.error) {
          // Registration failed, display an error message
          alert(json_data.error);
        } else if (json_data.message === "User successfully Logged in") {
          // Registration success, display a success message and redirect to the sign-in menu
          console.log(response.headers.entries());
          localStorage.setItem("userName", username);
          setCookie("jwt", json_data.jwt);
          alert(json_data.message);
          // Perform the redirect here
          window.location.href = "/home";
        }
      } else {
        console.log(json_data);
        // Handle other non-200 status codes here
        // Display an error message or perform appropriate actions
      }
    } catch (error) {
      // Handle fetch error
    }
  };
  // end email password capture

  function onChange(value) {
    console.log("Captcha value:", value);
  }
  return (
    <form
      onSubmit={handleSubmit}
      style={{ height: "500px", marginTop: "50px" }}
      className="modal"
    >
      <div className="register">
        <div className="top_flex">
          <div className="title">Sign In</div>
          <div onClick={() => setModel1(false)} className="close_img">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
          </div>
        </div>
        <div className="text_start mt-4">
          <label className="input_title" for="exampleInputEmail1">
            Username
          </label>
          <input
            class="form-control bg-transparent css_input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="text_start mt-4">
          <label className="input_title" for="exampleInputEmail1">
            Password
          </label>
          <input
            class="form-control css_input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <ReCAPTCHA
          theme="dark"
          style={{ background: "rgb(51, 51, 51)" }}
          className="custom mt-3"
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          onChange={onChange}
        />
        <button type="submit" className="register_btn mt-3">
          Sign In
        </button>
        <p className="forgot">Forgot Password</p>
        <p className="border_line">
          Do you have an account?
          <span className="sign_label">Register An Account</span>
        </p>
      </div>
    </form>
  );
};

export default Login;
