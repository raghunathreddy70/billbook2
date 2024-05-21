import React, { useState } from "react";
import { Button, Modal } from "antd";
import Link from "antd/es/typography/Link";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import axios from "axios";
import { backendUrl } from "../backendUrl";
import { useSelector } from "react-redux";
const AddvendorModal = ({
  visible,
  onCancel,
  fetchVendorsData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    PANNumber: "",
    businessId: userData?.data?._id,

  });
  const [validation, setValidation] = useState({
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phoneNumber: { isValid: true, message: "" },
    addressLine1: { isValid: true, message: "" },
    addressLine2: { isValid: true, message: "" },
    PANNumber: { isValid: true, message: "" },
  });
  const handlePhoneNumberChange = (value) => {
    const fieldName = "phoneNumber";
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

  const handleInputForm = (fieldName, value) => {
    let isValid = true;
    let message = "";
    const nameRegex = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const panRegex = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;

    if (fieldName === "name") {
      isValid = nameRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "email") {
      isValid = emailRegex.test(value);
      message = "Invalid email";
    } else if (fieldName === "PANNumber") {
      isValid = panRegex.test(value);
      message = "Invalid PANNumber";
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
    if (!formData.phoneNumber) {
      validationErrors.phoneNumber = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }

    return validationErrors;
  };
  const userData = useSelector((state) => state?.user?.userData)

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
      const response = await axios.post(`${backendUrl}/api/addVendor/vendors`,
        {...formData, businessId : userData?.data?._id},
      );
      console.log("Data submitted successfully:", response.data);
      toast.success("Vendor Added successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      fetchVendorsData();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      onCancel(false);
    }
  };
  return (
    <>
      <Modal
        className="add-bank-account-header-line"
        title="Add Vendor"
        onCancel={onCancel}
        open={visible}
        footer={[
          <Button
            key="cancel"
            onClick={onCancel}
            className="btn btn-secondary waves-effect me-2"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="btn btn-info waves-effect waves-light primary-button"
            onClick={handleSubmit}
            disabled={
              !validation.name.isValid ||
              !validation.email.isValid ||
              !validation.phoneNumber.isValid
            }
          >
            Submit
          </Button>,
        ]}
      >
        <div className="row">
          <div className="col-lg-12 col-sm-12">
            <div className="form-group">
              <label>
                Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${
                  !validation.name.isValid ? "is-invalid" : ""
                }`}
                placeholder="Enter Name"
                value={formData.name}
                onChange={(e) => handleInputForm("name", e.target.value)}
              />
              {!validation.name.isValid && (
                <div className="error-message text-danger">
                  {validation.name.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-12 col-sm-12">
            <div className="form-group">
              <label>
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className={`form-control ${
                  !validation.email.isValid ? "is-invalid" : ""
                }`}
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={(e) => handleInputForm("email", e.target.value)}
              />
              {!validation.email.isValid && (
                <div className="error-message text-danger">
                  {validation.email.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-12 col-sm-12">
            <div className="form-group">
              <label>
                Phone Number
                <span className="text-danger">*</span>
              </label>
              <PhoneInput
                international
                defaultCountry="IN"
                style={{ background: "#f2f2f2", color: "#000" }}
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter Phone Number"
                className={`form-control d-flex ${
                  !validation.phoneNumber.isValid ? "is-invalid" : ""
                } `}
              />
              {!validation.phoneNumber.isValid && (
                <div className="error-message text-danger">
                  {validation.phoneNumber.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-12 col-sm-12">
            <div className="form-group">
              <label>
                Address Line1
                <span className="text-danger"></span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Address Amount"
                value={formData.addressLine1}
                onChange={(e) =>
                  handleInputForm("addressLine1", e.target.value)
                }
              />
            </div>
          </div>
          <div className="col-lg-12 col-sm-12">
            <div className="form-group">
              <label>
                Address Line2
                <span className="text-danger"></span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Address Amount"
                value={formData.addressLine2}
                onChange={(e) =>
                  handleInputForm("addressLine2", e.target.value)
                }
              />
            </div>
          </div>
          <div className="col-lg-12 col-sm-12">
          <div className="form-group">
            <label>
              PAN Number <span className="text-danger"></span>
            </label>
            <input
              type="text"
              className={`form-control
  ${!validation.PANNumber?.isValid ? "is-invalid" : ""}`}
              placeholder="Enter Name"
              value={formData.PANNumber}
              onChange={(e) => handleInputForm("PANNumber", e.target.value)}
            />
            {!validation.PANNumber?.isValid && (
              <div className="error-message text-danger">
                {validation.PANNumber?.message}
              </div>
            )}
          </div>
        </div>
        </div>
      </Modal>
    </>
  );
};

export default AddvendorModal;
