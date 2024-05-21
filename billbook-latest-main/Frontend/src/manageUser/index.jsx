import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import { img10 } from "../_components/imagepath";
import Select2 from "react-select2-wrapper";
import FeatherIcon from "feather-icons-react";
import SettingsSideBar from "../settings/SettingDashboardSideBar";
import { Upload } from "feather-icons-react/build/IconComponents";
import SettingDashboardSideBar from "../settings/SettingDashboardSideBar";
import { Button, Modal } from "antd";
import { useSelector } from "react-redux";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { backendUrl } from "../backendUrl";
import Swal from "sweetalert2";
import axios from "axios";

const AddUser = ({ onCancel, visible, datasource, setDatasource }) => {
  // const [role, setRole] = useState([
  //     { id: "User", text: "User" },
  //     { id: "Admin", text: "Admin" },
  // ]);

  
  const userData = useSelector((state)=> state?.user?.userData)

  const formObject = { 
    profile: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    adminId: null,

  }

  console.log("adminId",formData?.adminId)

  const [formData, setFormData] = useState(formObject);

  useEffect(()=>{
    setFormData({...formData, adminId: userData?.data?.adminId})
  },[userData])

  const [validation, setValidation] = useState({
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phone: { isValid: true, message: "" },
    role: { isValid: true, message: "" },
  });
  const handleInputForm = (fieldName, value) => {
    let isValid = true;
    let message = "";

    const userRegex = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    // if (fieldName === 'profile') {
    //     isValid = value;
    //     message = 'Invalid profile'
    // } else
    if (fieldName === "name") {
      isValid = userRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "email") {
      isValid = emailRegex.test(value);
      message = "Invalid email";
    } else if (fieldName === "phoneNumber") {
      isValid = phoneRegex.test(value);
      message = "Invalid phone number";
    } else if (fieldName === "role") {
      isValid = value;
      message = "Invalid role";
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Img = reader.result;
        setFormData({
          ...formData,
          profile: base64Img,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (e) => {
    setFormData({
      ...formData,
      profile: "",
    });
  }
  const validateFormData = (formData) => {
    const validationErrors = {};
    // if (!formData.profile) {
    //     validationErrors.profile = { isValid: false, message: 'please' };
    // }
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
    if (!formData.phoneNumber) {
      validationErrors.phoneNumber = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    if (!formData.role) {
      validationErrors.role = {
        isValid: false,
        message: "please select a role",
      };
    }
    return validationErrors;
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // const validationErrors = validateFormData(formData);
    // if (Object.keys(validationErrors).length > 0) {
    //   setValidation((prevValidation) => ({
    //     ...prevValidation,
    //     ...validationErrors,
    //   }));
    //   return;
    // }
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/create-user`,
        formData 
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "User added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        setFormData(formObject)
        onCancel(false)
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to add user. Please try again.",
        });
      }
    } catch (error) {

      if(error.response.data.Error === "User with phone number already exist"){
        Swal.fire({
          icon: "error",
          title: "User With Phone Already Exist",
        });
      }else{

        Swal.fire({
          icon: "error",
          title: "An error occurred while adding the user.",
        });
      }

      console.error("Error:", error.response.data.Error);
    }
  };

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


  const role = userData?.data?.roleAccess;
  const roleKeyValuePairs = [];

  if (role) {
    Object.keys(role).forEach((outerKey, index) => {
      const innerKeys = Object.keys(role[outerKey]);
      innerKeys.forEach((innerKey) => {
        roleKeyValuePairs.push({ id: outerKey, text: innerKey });
      });
    });
  }

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  console.log("userData", formData);
  return (
    <>
      <Modal
        className="add-bank-account-header-line add-godown-styles"
        title="Add Users"
        onCancel={onCancel}
        open={visible}
        footer={[
          <Button
            key="cancel"
            onClick={() => onCancel(false)}
            className="btn btn-secondary waves-effect me-2"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="btn btn-info waves-effect waves-light primary-button"
            onClick={(e)=>handleFormSubmit(e)}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <h5 className="form-title">Profile Picture</h5>
              <div className="profile-picture">
                <div className="upload-profile">
                  <div className="profile-img">
                    <img id="blah" className="avatar" src={formData.profile ? formData.profile : img10} alt="" />
                  </div>
                  <div className="add-profile">
                    <h5
                      value={formData.profile}
                      onChange={(e) =>
                        handleInputForm("profile", e.target.value)
                      }
                    >
                      Upload a New Photo<span className="text-danger">*</span>
                    </h5>
                  </div>
                  {/* {!validation.profile.isValid && (
                    <div className="error-message text-danger">{validation.profile.message}</div>
                  )} */}
                </div>
                <div className="img-upload d-flex justify-content-center">
                  <label className="btn btn-primary">
                    Upload
                    <input
                      type="file"
                      className="d-none"
                      onChange={handleImageChange}
                      required
                    />
                  </label>
                  <div className="btn btn-remove" onClick={(e)=>handleImageRemove(e)}>Remove</div>
                </div>
              </div>
              <div className="form-group">
                <label>
                  Name<span className="text-danger"></span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    !validation.name.isValid ? "is-invalid" : ""
                  }`}
                  placeholder="Enter User Name"
                  value={formData.name}
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
              <div className="form-group">
                <label>
                  Email<span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${
                    !validation.email.isValid ? "is-invalid" : "" 
                  }`}
                  placeholder="Enter Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {!validation.email.isValid && (
                  <div className="error-message text-danger">
                    {validation.email.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>
                  Phone Number<span className="text-danger">*</span>
                </label>
                <PhoneInput
                  international 
                  defaultCountry="IN"
                  value={formData.phone}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter Phone Number"
                  className={`form-control d-flex focus:outline-none ${!validation?.phone.isValid && "is-invalid"
                    }`}
                />
                {!validation?.phone?.isValid && (
                  <div className="error-message text-danger">
                    {validation?.phone?.message}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>
                  Role<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${
                    !validation.role.isValid ? "is-invalid" : ""
                  }`}
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <option value="">Select Role</option>
                  {roleKeyValuePairs.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.text}
                    </option>
                  ))}
                </select>
                {!validation.role.isValid && (
                  <div className="error-message text-danger">
                    {validation.role.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddUser;
