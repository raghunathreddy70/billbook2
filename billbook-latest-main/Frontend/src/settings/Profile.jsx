import React, { useState } from "react";
import { img2 } from "../_components/imagepath";
import SettingSidebar from "../layouts/SettingsSidebar";
import FeatherIcon from "feather-icons-react";
import Header from "../layouts/Header";
import SettingDashboardSideBar from "./SettingDashboardSideBar";
import axios from "axios";
import EditProfile from "./EditSettings";
import EditSettings from "./EditSettings";

const ProfileSettings = () => {
  const [menu, setMenu] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    country: "",
    city: "",
    state: "",
    addressline1: "",
    addressline2: "",
    zipCode: "",
    profileImage: null,
  });
  // console.log(validation.country)
  const [validation, setValidation] = useState({
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phoneNumber: { isValid: true, message: "" },
    country: { isValid: true, message: "" },
    city: { isValid: true, message: "" },
    state: { isValid: true, message: "" },
    addressline1: { isValid: true, message: "" },
    zipCode: { isValid: true, message: "" },
  });

  const handleInputChange = (fieldName, value) => {
    let isValid = true;
    let message = "";

    const nameRegex = /^[a-zA-Z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (fieldName === "name") {
      isValid = nameRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "email") {
      isValid = emailRegex.test(value);
      message = "Invalid email";
    } else if (fieldName === "phoneNumber") {
      console.log(value);
      isValid = phoneRegex.test(value);
      message = "Invalid phone number";
    }
    setProfileData({
      ...profileData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };

  const validateFormData = (profileData) => {
    const validationErrors = {};

    if (!profileData.name) {
      validationErrors.name = {
        isValid: false,
        message: "please enter a name",
      };
    }
    if (!profileData.email) {
      validationErrors.email = {
        isValid: false,
        message: "please enter a email",
      };
    }
    if (!profileData.phoneNumber) {
      validationErrors.phoneNumber = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    if (!profileData.country) {
      validationErrors.country = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    if (!profileData.city) {
      validationErrors.city = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    if (!profileData.state) {
      validationErrors.state = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    if (!profileData.addressline1) {
      validationErrors.addressline1 = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    if (!profileData.zipCode) {
      validationErrors.zipCode = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    return validationErrors;
  };
  // Handle location inputs separately
  const handleLocationChange = (fieldName, value) => {
    let isValid = true;
    let message = "";
    const countryRegex = /^[a-zA-Z\s]*$/;

    if (fieldName === "country") {
      isValid = countryRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "city") {
      isValid = countryRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "state") {
      isValid = countryRegex.test(value);
      message = "Invalid name";
    }
    setProfileData({
      ...profileData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };
  const handleAddressChange = (fieldName, value) => {
    let isValid = true;
    let message = "";
    const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;

    if (fieldName === "addressline1") {
      isValid = addressRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "zipCode") {
      isValid = pincodeRegex.test(value);
      message = "Invalid name";
    }
    setProfileData({
      ...profileData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(profileData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/profile/profile`,
        { profileData }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting profile:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfileData((prevData) => ({
          ...prevData,
         
            profileImage: reader.result,
          
        }));
      };

      reader.readAsDataURL(selectedFile);
    }
  };
  return (
    <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
      {/* <Header onMenuClick={(value) => setMenu(!menu)} /> */}
      {/* <SettingDashboardSideBar /> */}
      {/* <Sidebar /> 	 */}
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="page-head-titles">
              <div className="content-page-header">
                <h5>Settings</h5>
              </div>
              <div className="edit-page-button">
                <EditSettings />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-md-4">
              <SettingSidebar />
            </div>
            <div className="col-xl-9 col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Basic information</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Profile
                      </label>
                      <div className="col-sm-9">
                        <div className="d-flex align-items-center">
                          <label className="avatar avatar-xxl profile-cover-avatar m-0">
                            <img
                              id="avatarImg"
                              className="avatar-img"
                              src={profileData.profileImage || img2}
                              alt="Profile Image"
                            />
                            <input
                              type="file"
                              id="edit_img"
                              onChange={handleFileChange}
                            />
                            <span className="avatar-edit">
                              <FeatherIcon icon="edit-2" />
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${
                            !validation.name.isValid ? "is-invalid" : ""
                          }`}
                          id="name"
                          placeholder="Your Name"
                          value={profileData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                        />
                        {!validation.name.isValid && (
                          <div className="error-message text-danger">
                            {validation.name.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Email<span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="email"
                          className={`form-control ${
                            !validation.email.isValid ? "is-invalid" : ""
                          }`}
                          id="email"
                          placeholder="Email"
                          value={profileData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                        {!validation.email.isValid && (
                          <div className="error-message text-danger">
                            {validation.email.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${
                            !validation.phoneNumber.isValid ? "is-invalid" : ""
                          }`}
                          id="phoneNumber"
                          placeholder="+x(xxx)xxx-xx-xx"
                          value={profileData.phoneNumber}
                          onChange={(e) =>
                            handleInputChange("phoneNumber", e.target.value)
                          }
                        />
                        {!validation.phoneNumber.isValid && (
                          <div className="error-message text-danger">
                            {validation.phoneNumber.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Location<span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <div className="mb-3">
                          <input
                            type="text"
                            className={`form-control ${
                              !validation.country.isValid ? "is-invalid" : ""
                            }`}
                            id="location"
                            placeholder="Country"
                            value={profileData.country}
                            onChange={(e) =>
                              handleLocationChange("country", e.target.value)
                            }
                          />
                          {!validation.country.isValid && (
                            <div className="error-message text-danger">
                              {validation.country.message}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <input
                            type="text"
                            className={`form-control ${
                              !validation.city.isValid ? "is-invalid" : ""
                            }`}
                            placeholder="City"
                            value={profileData.city}
                            onChange={(e) =>
                              handleLocationChange("city", e.target.value)
                            }
                          />
                          {!validation.isValid && (
                            <div className="error-message text-danger">
                              {validation.city.message}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                        <input
                          type="text"
                          className={`form-control ${!validation.state.isValid ? "is-invalid" : ""}`}
                          placeholder="State"
                          value={profileData.state}
                          onChange={(e) =>
                            handleLocationChange("state", e.target.value)
                          }
                        />{!validation.state.isValid && (
                          <div className="error-message text-danger">{validation.state.message}</div>
                        )}
                        </div>
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Address line 1<span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${!validation.addressline1.isValid ? "is-invalid" : ""}`}
                         
                          placeholder="Your address"
                          value={profileData.addressline1}
                          onChange={(e) =>
                            handleAddressChange("addressline1", e.target.value)
                          }
                        />
                        {!validation.addressline1.isValid && (
                          <div className="error-message text-danger">
                            {validation.addressline1.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Address line 2{" "}
                        <span className="text-muted">(Optional)</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                         
                          placeholder="Your address"
                          value={profileData.addressline2}
                          onChange={(e) =>
                            handleAddressChange("addressline2", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Zip code<span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${!validation.zipCode.isValid ? "is-invalid" : ""}`}
                          
                          placeholder="Your zip code"
                          value={profileData.zipCode}
                          onChange={(e) =>
                            handleAddressChange("zipCode", e.target.value)
                          }
                        />
                        {!validation.zipCode.isValid && (
                          <div className="error-message text-danger">
                            {validation.zipCode.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
