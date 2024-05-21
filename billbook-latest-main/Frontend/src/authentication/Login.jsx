import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { InvoiceLogo1, logoblack } from "../_components/imagepath";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { backendUrl } from "../backendUrl";
import { useDispatch } from "react-redux";
import PhoneInput from "react-phone-number-input";
import { openDB } from "idb";

import { isValidPhoneNumber } from "react-phone-number-input";

const Login = () => {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm();
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [message, setMessage] = useState("");
  const [requestedOtp, setrequestedOtp] = useState(false);
  const [emailOfUser, setEmailOfUser] = useState("");
  const [OTPerrormsg, setOTPerrormsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    phone: { isValid: true, message: "" },
  });
  const [formData, setFormData] = useState("");
  const dispatch = useDispatch();

  console.log("message", message);

  const history = useHistory();

  const handlePhoneNumberChange = (value) => {
    const fieldName = "phone";
    let isValid = true;
    let message = "";
    console.log("handlePhoneNumberChange", value);
    const phoneNumberString = value ? String(value) : "";
    const isValidPhone = isValidPhoneNumber(phoneNumberString);
    if (isValidPhone === true) {
      setPhone(value);
      setValidation({
        ...validation,
        [fieldName]: { isValid: true, message: "" },
      });
    } else {
      isValid = false;
      message = "Invalid Phone Number";
      setValidation({
        ...validation,
        [fieldName]: { isValid, message },
      });
    }
  };

  const validateFormData = (phone) => {
    const validationErrors = {};
    if (!phone) {
      validationErrors.phone = {
        isValid: false,
        message: "please enter a name",
      };
    }
    return validationErrors;
  };
  const requestOTP = async (e) => {
    e.preventDefault();

    const validationErrors = validateFormData(phone);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      console.log("validationErrors", validationErrors);
      return;
    }
    setrequestedOtp(true);
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/requestOTP`, {
        phone,
      });
      console.log("response", response);
      setEmailOfUser(response.data);
      setLoading(false);

      setMessage("OTP sent to your email");
    } catch (error) {
      setLoading(false);
      setMessage("Failed to send OTP");
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/verifyOTP`, {
        phone,
        otp,
      });
      console.log("123", phone);
      console.log("123", otp);
      if (response.status === 200 && response.data.token) {
        const token = response.data.token;
        const currentBusiness = response.data.currentBusiness;

        function setLocalStorage(data) {
          try {
            localStorage.setItem(
              "currentBusiness_billBook",
              JSON.stringify(data)
            );
          } catch (error) {
            localStorage.clear();
            setLocalStorage(data);
          }
        }

        setLocalStorage(currentBusiness);

        // Open IndexedDB database
        const db = await openDB("bill_book_DB", 1, {
          async upgrade(db) {
            if (db.objectStoreNames.contains("tokens")) {
              db.deleteObjectStore("tokens");
            }

            db.createObjectStore("tokens");
          },
        });

        const tx = db.transaction("tokens", "readwrite");
        const store = tx.objectStore("tokens");
        await store.put(token, "bill_book");
        await tx.done;
        console.log("Token stored successfully in IndexedDB");

        setMessage("OTP verified");
        // window.location.reload();
        history.push("/index");
      } else {
        setMessage("Invalid OTP");
        history.push("/login");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Error verifying OTP");
    }
  };

  return (
    <>
      <div className="main-wrapper login-body">
        <div className="login-wrapper">
          <div className="container">
            <img
              className="img-fluid logo-dark mb-2"
              src={logoblack}
              alt="Logo"
            />
            <div className="loginbox">
              <div className="login-right">
                <div className="login-right-wrap">
                  <h1>Login / Register</h1>
                  <p className="account-subtitle">Access to our dashboard</p>
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <svg
                        class="animate-spin h-16 w-16"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <div>
                      <form>
                        <div className="form-group">
                          <label>
                            Phone Number
                            <span className="text-danger">*</span>
                          </label>
                          <PhoneInput
                            international
                            defaultCountry="IN"
                            value={phone}
                            onChange={handlePhoneNumberChange}
                            placeholder="Enter Phone Number"
                            className={`form-control d-flex  ${
                              !validation.phone.isValid && "is-invalid"
                            }`}
                          />
                          {!validation.phone.isValid && (
                            <div className="error-message text-danger">
                              {validation.phone.message}
                            </div>
                          )}
                        </div>
                        <button
                          className="btn btn-lg btn-block w-100 btn-primary pt-2"
                          disabled={requestedOtp}
                          hidden={requestedOtp}
                          onClick={requestOTP}
                        >
                          Request OTP
                        </button>
                        {requestedOtp && (
                          <div className="form-group input_text">
                            <label className="form-control-label">
                              Enter OTP
                            </label>
                            <div className="pass-group">
                              <input
                                type="text"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOTP(e.target.value)}
                                autoComplete="false"
                              />
                            </div>
                            {OTPerrormsg === "Invalid OTP" && (
                              <p className="pt-3 pb-3 text-danger">
                                {OTPerrormsg}
                              </p>
                            )}
                            <p className="pt-3 pb-3 text-info">
                              check your mail {emailOfUser}! for OTP
                            </p>
                          </div>
                        )}
                      </form>
                      {requestedOtp && (
                        <button
                          className="btn btn-lg btn-block w-100 btn-primary pt-2"
                          onClick={(e) => verifyOTP(e)}
                        >
                          Login
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
