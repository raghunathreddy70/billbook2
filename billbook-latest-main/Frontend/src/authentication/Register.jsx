import React, { useEffect, useState } from "react";

import axios from "axios";
import { useHistory } from "react-router-dom";
import { InvoiceLogo1, Logo, logoblack } from "../_components/imagepath";

import Select2 from "react-select2-wrapper";
import { backendUrl } from "../backendUrl";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

const Register = () => {
  const userDetails = {
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    industryType: "",
    registrationType: "",
    gstNumber: "",
    password: "",
    confirmPassword: "",
  };


  const [formData, setFormData] = useState(userDetails);

  const [validation, setValidation] = useState({
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phone: { isValid: true, message: "" },
    businessName: { isValid: true, message: "" },
    businessType: { isValid: true, message: "" },
    industryType: { isValid: true, message: "" },
    registrationType: { isValid: true, message: "" },
    gstNumber: { isValid: true, message: "" },
  });

  const handlePhoneNumberChange = (value) => {
    const fieldName = "phone";
    let isValid = true;
    let message = "";
    console.log("handlePhoneNumberChange", value);
    const phoneNumberString = value ? String(value) : "";
    const isValidPhone = isValidPhoneNumber(phoneNumberString);
    if (isValidPhone === true) {
      setFormData({
        ...formData,
        [fieldName]: value,
      });
      setValidation({
        ...validation,
        [fieldName]: { isValid, message },
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

  const [bgOptions, setbgOptions] = useState([
    { id: "Retailer", text: "Retailer" },
    { id: "Wholesale", text: "Wholesaler" },
    { id: "Distributor", text: "Distributor" },
    { id: "Manufacturer", text: "Manufacturer" },
    { id: "Services", text: "Services" },
  ]);
  const [brtOptions, setbrtOptions] = useState([
    { id: "Public limited company", text: "Public limited company" },
    { id: "Partnership firm", text: "Partnership firm" },
    { id: "One Person Company", text: "One Person Company" },
    { id: "Business not registered", text: "Business not registered" },
    { id: "Services", text: "Services" },
  ]);
  const [industryOptions, setIndustryOptions] = useState([
    { id: "Agriculture", text: "Agriculture" },
    { id: "Automobile", text: "Automobile" },
    { id: "Battery", text: "Battery" },
    { id: "Electronics", text: "Electronics" },
    { id: "Engineering", text: "Engineering" },
    { id: "Electrical Work", text: "Electrical Work" },
    { id: "Education", text: "Education" },
    { id: "Fitness", text: "Fitness" },
    { id: "Footwear", text: "Footwear" },
    { id: "Fruits and Vegetables", text: "Fruits and Vegetables" },
  ]);
  const [isGSTRegistered, setIsGSTRegistered] = useState(true);

  const [error, setError] = useState(false);
  const [InValidEmail, setInValidEmail] = useState(false);

  const handleRadioChange = (event) => {
    setIsGSTRegistered(event.target.value === "yes");
  };

  console.log(formData);

  const history = useHistory();

  const isValidEmail = (email) => {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  };



  const handledropdownChange = (fieldName, value, index) => {
    let isValid = true;
    let message = "";
    if (fieldName === "businessType" || "industryType" || "registrationType") {
      isValid = value;
      message = "Invalid email";
    }
    setFormData({
      ...formData,
      [fieldName]: value
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };
  const handleInputForm = (fieldName, value) => {
    let isValid = true;
    let message = "";
    const nameRegex = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const gstRegex = /^[a-zA-Z0-9]{15}$/;
    if (fieldName === "name") {
      isValid = nameRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "email") {
      isValid = emailRegex.test(value);
      message = "Invalid email";
    } else if (fieldName === "businessName") {
      isValid = nameRegex.test(value);
      message = "Invalid business name";
    } else if (fieldName === "gstNumber") {
      isValid = gstRegex.test(value);
      message = "Invalid GST Number";
    }

    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  }

  const validateFormData = (formData) => {
    const validationErrors = {};
    if (!formData.name) {
      validationErrors.name = {
        isValid: false,
        message: "please enter a name",
      };
    }
    if (!formData.email) {
      validationErrors.email = {
        isValid: false,
        message: "please enter a email",
      };
    }
    if (!formData.phone) {
      validationErrors.phone = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    if (!formData.businessName) {
      validationErrors.businessName = {
        isValid: false,
        message: "please enter a business name",
      };
    }
    if (!formData.businessType) {
      validationErrors.businessType = {
        isValid: false,
        message: "Please select the business type",
      };
    }
    if (!formData.industryType) {
      validationErrors.industryType = {
        isValid: false,
        message: "Please select the industry type",
      };
    }
    if (!formData.registrationType) {
      validationErrors.registrationType = {
        isValid: false,
        message: "Please select the registration type",
      };
    }
    // if (!formData.gstNumber) {
    //   validationErrors.gstNumber = {
    //     isValid: false,
    //     message: "please enter a gst Number",
    //   };
    // }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      console.log("validationErrors", validationErrors);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/admin/register`,
        { formData });
      setFormData(userDetails);
      history.push("/login");
      console.log(response.data);
      // Redirect or handle success as needed
    } catch (error) {
      if (error.response.status === 422) {
        // Handle validation errors
        error.response.data.errors.forEach((validationError) => {
          setError(validationError.param, {
            type: "manual",
            message: validationError.msg,
          });
        });
      }
    }
  };
  // const handleInputForm = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "phone" && value?.length > 10) {
  //     return;
  //   }

  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  return (
    <>
      <div className="container max-w-5xl min-h-[80vh] bg-slate-50">
        <div className="flex justify-center items-center ">
          <img src={logoblack} alt="Logo" className="w-4/12" />
        </div>
        <div className="flex items-center justify-center gap-4 flex-col">
          <h2 className="text-start text-4xl font-sans font-semibold">
            Register
          </h2>
          <form class="w-full max-w-4xl" onSubmit={handleSubmit}>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  class="appearance-none block w-full shadow-lg bg-white text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:scale-105 focus:bg-white"
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  name="name"
                  value={formData.name}
                  className={` form-control ${!validation?.name?.isValid && "is-invalid"}`}
                  onChange={(e) => handleInputForm("name", e.target.value)}
                />
                {!validation?.name?.isValid && (
                  <div className="error-message text-danger">
                    {validation?.name?.message}
                  </div>
                )}
              </div>
              <div class="w-full md:w-1/2 px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  class="appearance-none block w-full shadow-lg bg-white text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:scale-105 focus:bg-white"
                  id="grid-last-name"
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={formData.businessName}
                  className={` form-control ${!validation?.businessName?.isValid && "is-invalid"}`}
                  onChange={(e) => handleInputForm("businessName", e.target.value)}
                />
                {!validation?.businessName?.isValid && (
                  <div className="error-message text-danger">
                    {validation?.businessName?.message}
                  </div>
                )}
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  class="appearance-none block w-full shadow-lg bg-white text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:scale-105 focus:bg-white"
                  id="grid-full-name"
                  type="text"
                  name="email"
                  placeholder="Jane@mail.com"
                  value={formData.email}
                  className={` form-control ${!validation?.email?.isValid && "is-invalid"}`}
                  onChange={(e) => handleInputForm("email", e.target.value)}
                />
                {!validation?.email?.isValid && (
                  <div className="error-message text-danger">
                    {validation?.email?.message}
                  </div>
                )}
              </div>
              <div class="w-full md:w-1/2 px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Phone Number <span className="text-red-400">*</span>
                </label>
               
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={formData.phone}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter Phone Number"
                  className={`form-control d-flex  ${!validation?.phone.isValid && "is-invalid"
                    }`}
                />
                {!validation?.phone?.isValid && (
                  <div className="error-message text-danger">
                    {validation?.phone?.message}
                  </div>
                )}
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col gap-2">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  Business Type <span className="text-red-400">*</span>
                </label>
                <Select2
                  className={`appearance-none block w-full shadow-lg bg-white text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:scale-105 focus:bg-white  is-invalid `}
                  data={bgOptions}
                  options={{ placeholder: "Choose your business type" }}
                  value={formData?.businessType}

                  // className={` form-control ${!validation?.email?.isValid && "is-invalid"}`}
                  onChange={(e) => handledropdownChange("businessType", e.target.value)}
                />
                {!validation?.businessType?.isValid && (
                  <div className="error-message text-danger">
                    {validation?.businessType?.message}
                  </div>
                )}
              </div>
              <div class="w-full md:w-1/2 px-3 flex flex-col gap-2">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >
                  Industry Type <span className="text-red-400">*</span>
                </label>
                <Select2
                  className={`appearance-none block w-full shadow-lg bg-white text-gray-700 border border-red-500 rounded  mb-3 leading-tight focus:outline-none focus:scale-105 focus:bg-white p-10 is-invalid`}
                  data={industryOptions}
                  options={{ placeholder: "Choose your industry type" }}
                  value={formData?.industryType}
                  onChange={(e) => handledropdownChange("industryType", e.target.value)}

                />
                {!validation?.industryType?.isValid && (
                  <div className="error-message text-danger">
                    {validation?.industryType?.message}
                  </div>
                )}
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0 flex flex-col gap-2">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  Business Registration Type{" "}
                  <span className="text-red-400">*</span>
                </label>
                <Select2
                  className={`appearance-none block w-full shadow-lg bg-white text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:scale-105 focus:bg-white  is-invalid`}
                  data={brtOptions}
                  options={{
                    placeholder: "Choose your registration type",
                  }}
                  value={formData?.registrationType}
                  onChange={(e) =>
                    handledropdownChange("registrationType", e.target.value)
                  }
                />
                {!validation?.registrationType?.isValid && (
                  <div className="error-message text-danger">
                    {validation?.registrationType?.message}
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Are you GST Registered?</label>
              <div className="">
                <label className="custom_radio me-3">
                  <input
                    type="radio"
                    name="payment"
                    value="yes"
                    checked={isGSTRegistered}
                    onChange={handleRadioChange}
                  />
                  <span className="checkmark" /> Yes
                </label>
                <label className="custom_radio">
                  <input
                    type="radio"
                    name="payment"
                    value="no"
                    checked={!isGSTRegistered}
                    onChange={handleRadioChange}
                  />
                  <span className="checkmark" /> No
                </label>
              </div>
            </div>
            {isGSTRegistered && (
              <>
                <div className="col-lg-12 col-md-6 col-sm-6">
                  <div className="form-group">
                    <label>GSTIN</label>
                    <input
                      type="text"
                      className={`appearance-none block w-full shadow-lg bg-white text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:scale-105 focus:bg-white  ${!validation.GSTNo?.isValid ? "is-invalid" : ""}`}
                      placeholder="Enter your GST Number"
                      value={formData.gstNumber}
                      onChange={(e) =>
                        handleInputForm("gstNumber", e.target.value)
                      }
                      name="gstNumber"
                    />

                    {!validation?.gstNumber?.isValid && (
                      <div className="error-message text-danger">
                        {validation?.gstNumber?.message}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="w-full flex justify-center my-16">
              <button
                className="btn btn-lg btn-block w-100 btn-primary py-2"
                type="submit"
                onClick={(e) => handleSubmit(e)}
              >
                Register As Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Register;
