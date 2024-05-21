import React, { useState } from "react";
import { img2 } from "../_components/imagepath";
import FeatherIcon from "feather-icons-react";

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    state: "",
    addressline1: "",
    addressline2: "",
    zipCode: "",
  });
  // console.log(validation.country)
  const [validation, setValidation] = useState({
    name: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    phone: { isValid: true, message: '' },
    country: { isValid: true, message: "" },
    city: { isValid: true, message: "" },
    state: { isValid: true, message: "" },
    addressline1: { isValid: true, message: "" },
    zipCode: { isValid: true, message: "" },
  })


  const handleInputChange = (fieldName, value) => {
    let isValid = true;
    let message = '';

    const nameRegex = /^[a-zA-Z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (fieldName === 'name') {
      isValid = nameRegex.test(value);
      message = 'Invalid name'
    }
    else if (fieldName === 'email') {
      isValid = emailRegex.test(value);
      message = 'Invalid email'

    } else if (fieldName === 'phone') {
      console.log(value);
      isValid = phoneRegex.test(value);
      message = 'Invalid phone number'
    }
    setProfileData({
      ...profileData,
      [fieldName]: value
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message }

    });
  };

  const validateFormData = (profileData) => {
    const validationErrors = {};

    if (!profileData.name) {
      validationErrors.name = { isValid: false, message: 'please enter a name' };
    }
    if (!profileData.email) {
      validationErrors.email = { isValid: false, message: 'please enter a email' };
    }
    if (!profileData.phone) {
      validationErrors.phone = { isValid: false, message: 'please enter a phone Number' };
    }
    if (!profileData.country) {
      validationErrors.country = { isValid: false, message: 'please enter a phone Number' };
    }
    if (!profileData.city) {
      validationErrors.city = { isValid: false, message: 'please enter a phone Number' };
    }
    if (!profileData.state) {
      validationErrors.state = { isValid: false, message: 'please enter a phone Number' };
    }
    if (!profileData.addressline1) {
      validationErrors.addressline1 = { isValid: false, message: 'please enter a phone Number' };
    }
    if (!profileData.zipCode) {
      validationErrors.zipCode = { isValid: false, message: 'please enter a phone Number' };
    }
    return validationErrors;
  };
  // Handle location inputs separately
  const handleLocationChange = (fieldName, value) => {
    let isValid = true;
    let message = '';
    const countryRegex = /^[a-zA-Z\s]*$/;

    if (fieldName === 'country') {
      isValid = countryRegex.test(value);
      message = 'Invalid name'
    } else if (fieldName === 'city') {
      isValid = countryRegex.test(value);
      message = 'Invalid name'
    } else if (fieldName === 'state') {
      isValid = countryRegex.test(value);
      message = 'Invalid name'
    }
    setProfileData({
      ...profileData,
      [fieldName]: value
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message }
    });
  };
  const handleAddressChange = (fieldName, value) => {
    let isValid = true;
    let message = '';
    const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;

    if (fieldName === 'addressline1') {
      isValid = addressRegex.test(value);
      message = 'Invalid name'
    } else if (fieldName === 'zipCode') {
      isValid = pincodeRegex.test(value);
      message = 'Invalid name'
    }
    setProfileData({
      ...profileData,
      [fieldName]: value
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(profileData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation(prevValidation => ({
        ...prevValidation,
        ...validationErrors
      }));
      return;
    }
  }
  return (
    <>
          <form onSubmit={handleSubmit}>
                    <div className="row form-group">
                     
                     
                    </div>
                   <div className="preference-edit-form">
                   <div className="col-sm-9">
                        <div className="d-flex align-items-center">
                          <label className="avatar avatar-xxl profile-cover-avatar m-0">
                            <img
                              id="avatarImg"
                              className="avatar-img"
                              src={img2}
                              alt="Profile Image"
                            />
                            <input type="file" id="edit_img" />
                            <span className="avatar-edit">
                              <FeatherIcon icon="edit-2" />
                            </span>
                          </label>
                        </div>
                      </div>
                   <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Name
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${!validation.name.isValid ? "is-invalid" : ""}`}
                          id="name"
                          placeholder="Your Name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                        {!validation.name.isValid && (
                          <div className="error-message text-danger">{validation.name.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Email
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="email"
                          className={`form-control ${!validation.email.isValid ? "is-invalid" : ""}`}
                          id="email"
                          placeholder="Email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                        {!validation.email.isValid && (
                          <div className="error-message text-danger">{validation.email.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Phone <span className="text-muted">(Optional)</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${!validation.phone.isValid ? "is-invalid" : ""}`}
                          id="phone"
                          placeholder="+x(xxx)xxx-xx-xx"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                        {!validation.phone.isValid && (
                          <div className="error-message text-danger">{validation.phone.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-sm-3 col-form-label input-label">
                        Location
                      </label>
                      <div className="col-sm-9">
                      <div className="mb-3">
                          <input
                            type="text"
                            className={`form-control ${!validation.country.isValid ? "is-invalid" : ""}`}
                            id="location"
                            placeholder="Country"
                            value={profileData.country}
                            onChange={(e) =>
                              handleLocationChange("country", e.target.value)
                            }
                          />{!validation.country.isValid && (
                            <div className="error-message text-danger">{validation.country.message}</div>
                          )}
                        </div>
                        <div className="mb-3">
                          <input
                            type="text"
                            className={`form-control ${!validation.city.isValid ? "is-invalid" : ""}`}
                            placeholder="City"
                            value={profileData.city}
                            onChange={(e) =>
                              handleLocationChange("city", e.target.value)
                            }
                          />{!validation.isValid && (
                            <div className="error-message text-danger">{validation.city.message}</div>
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
                        Address line 1
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
                        />{!validation.addressline1.isValid && (
                          <div className="error-message text-danger">{validation.addressline1.message}</div>
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
                        Zip code
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
                        />{!validation.zipCode.isValid && (
                          <div className="error-message text-danger">{validation.zipCode.message}</div>
                        )}
                      </div>
                    </div>
                   </div>
                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
    </>
  )
}

export default EditProfile