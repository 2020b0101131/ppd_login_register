
import React, { useState, useEffect } from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    return error;
  };

  const loginHandler = (e) => {
    e.preventDefault();
    const errors = validateForm(user);
    setFormErrors(errors);
    setIsSubmit(true);
    setIsLoading(true); // Show loader when login is clicked
// console.log(process.env.URL)
    if (Object.keys(errors).length === 0) {
      axios.post(`https://pdd-login-register-server.onrender.com/login`, user)
        .then((res) => {
          if (res.data.message === "Login successfully") {
            setUserState(res.data.user);
            window.location.href="https://saransh-vaishnai-tribhuvan.onrender.com/";
          } else {
            alert(res.data.message);
            setIsLoading(false); // Hide loader if login is not successful
          }
        })
        .catch((error) => {
          toast("User Not Exist. Kindly Register");
          setIsLoading(false); // Hide loader if login fails due to an error
        });
    } else {
      setIsLoading(false); // Hide loader if there are form errors
    }
  };

  return (

    <div className={loginstyle.login}>
       <ToastContainer />
      {isLoading && <div className="loader">Loading...</div>} {/* Loader component */}
      <form>
        <h1>Login</h1>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={changeHandler}
          value={user.email}
        />
        <p className={basestyle.error}>{formErrors.email}</p>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={changeHandler}
          value={user.password}
        />
        <p className={basestyle.error}>{formErrors.password}</p>
        <button style={{cursor:'pointer'}}className={basestyle.button_common} onClick={loginHandler}>
          Login
        </button>
      </form>
      <NavLink to="/signup">Not yet registered? Register Now</NavLink>
    </div>
  );
};

export default Login;
