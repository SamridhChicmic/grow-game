import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import API_BASE_URL from "../config.js";
function setCookie(name, value) {
  document.cookie = `${name}=${value};  path=/`; // Set the cookie with name, value, and path
}
// import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
const Signup = ({ setModel }) => {
  function onChange(value) {
    console.log("Captcha value:", value);
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [affiliateCode, setaffiliateCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform data validation
    if (username.trim() === "") {
      // Handle empty username error
      alert("please add a username");
      return;
    }

    if (!/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm.test(email)) {
      // Handle invalid email error
      alert("invalid email");
      return;
    }

    if (password.trim() === "" || password.length < 4) {
      // Handle empty or short password error
      alert("the password should be more than 4 characters long");
      return;
    }
    try {
      // Data is valid, send the registration request to the backend
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          affiliateCode,
        }),
      });
      const json_data = await response.json();
      if (response.ok) {
        if (json_data.error) {
          // Registration failed, display an error message
          alert(json_data.error);
        } else if (json_data.message === "User successfully created") {
          // Registration success, display a success message and redirect to the sign-in menu
          alert(json_data.message);
          setCookie("jwt", json_data.jwt);
          localStorage.setItem("userid", json_data.user);
          localStorage.setItem("userName", username);
          // Perform the redirect here
          window.location.href = "/home";
        }
      } else {
        // Handle other non-200 status codes here
        // Display an error message or perform appropriate actions
        if (json_data.error) {
          alert(json_data.error);
        }
        if (json_data.message) {
          alert(json_data.message);
        }
      }
    } catch (error) {
      // Handle fetch error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dsd">
      <div className="modal">
        <div className="register">
          <div className="top_flex">
            <div className="title">Register</div>
            <div onClick={() => setModel(false)} className="close_img">
              {" "}
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

          <div className="mt-4 text_start">
            <label className="input_title" for="exampleInputEmail1">
              Email
            </label>
            <input
              class="form-control css_input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-4 text_start">
            <label className="input_title" for="exampleInputEmail1">
              Affiliate Code (Optional)
            </label>
            <input
              class="form-control css_input"
              type="text"
              placeholder="Affiliate Code"
              value={affiliateCode}
              onChange={(e) => setaffiliateCode(e.target.value)}
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
            Register
          </button>
          <p className="border_line">
            Already have an account?<span className="sign_label">Sign In</span>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Signup;
