import React, { useState, useEffect } from "react";
import axios from "axios";
import "jspdf-autotable";
import { toast } from "react-toastify";
import { Button, Modal } from "antd";
import { backendUrl } from "../backendUrl";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

const EditVendorModal = ({ onCancel, editVendors1, editingId, vendorDetails, fetchVendorDetails }) => {
  console.log("editingIdinvendor", editingId)
  console.log("vendorDetailsZSASF", vendorDetails)
  const [editVendorConfirm, setEditVendorsConfirm] = useState(false);

  const [editUpdate1, setEditUpdate1] = useState(false);
  const [vendorData, setVendorData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    PANNumber: "",
  });
  const [validation, setValidation] = useState({
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phoneNumber: { isValid: true, message: "" },
    addressLine1: { isValid: true, message: "" },
    PANNumber: { isValid: true, message: "" },
  });

  useEffect(() => {
    vendorDetails && setVendorData(vendorDetails);
  }, [vendorDetails]);

  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneNumberChange = (value) => {
    const fieldName = "phoneNumber"
    let isValid = true;
    let message = "";
    console.log("handlePhoneNumberChange", value)
    const phoneNumberString = value ? String(value) : "";
    const isValidPhone = isValidPhoneNumber(phoneNumberString);
    if (isValidPhone === true) {
      setVendorData({
        ...vendorData,
        [fieldName]: value,
      });
      setValidation({
        ...validation,
        [fieldName]: { isValid, message },
      });
    } else {
      isValid = false;
      message = "Invalid Phone Number"
      setValidation({
        ...validation,
        [fieldName]: { isValid, message },
      });
    }
    // const phoneNumberString = String(value); // Convert value to a string
    // const isValidPhone = isValidPhoneNumber(phoneNumberString);
    // setPhoneNumber(phoneNumberString);
    // handleInputForm("phoneNumber", phoneNumberString);
  };

  const [datasource, setDatasource] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  useEffect(() => {
    if (
      toggleTabsState !== 1 &&
      toggleTabsState !== 2 &&
      toggleTabsState !== 3
    ) {
      setToggleTabsState(0);
    }
  }, [toggleTabsState]);




  const handleInputChange = (fieldName, value) => {
    let isValid = true;
    let message = "";
    const nameRegex = /^[a-zA-Z\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const addressLine1Regex = /^[#.0-9a-zA-Z\s,-]+$/;
    const panRegex = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;

    if (fieldName === "name") {
      isValid = nameRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "email") {
      isValid = emailRegex.test(value);
      message = "Invalid email";
    } else if (fieldName === "phoneNumber") {
      isValid = phoneRegex.test(value);
      if (!isValid) {
        message = "Invalid phone number";
      }
    } else if (fieldName === "addressLine1") {
      isValid = addressLine1Regex.test(value);
      message = "Invalid address";
    } else if (fieldName === "PANNumber") {
      isValid = panRegex.test(value);
      message = "Invalid PANNumber";
    }

    setVendorData({
      ...vendorData,
      [fieldName]: value,
    });

    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };

  const validationFormErrors = (vendorData) => {
    const validationError = {};
    if (!vendorData.name) {
      validationError.name = {
        isValid: false,
        message: "please enter a name",
      };
    }
    if (!vendorData.email) {
      validationError.email = {
        isValid: false,
        message: "please enter a email",
      };
    }
    if (!vendorData.phoneNumber) {
      validationError.phoneNumber = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }

    return validationError;
  };

  console.log("editdata ", datasource);

  // edit update
  const [editVendorid, setEditvendorid] = useState("");
  const editvendorsidUpdate = (value) => {
    const validationError = validationFormErrors(vendorData);
    if (Object.keys(validationError).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationError,
      }));
      return;
    }
    setEditVendorsConfirm(true);
    setEditvendorid(value);
    onCancel(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${backendUrl}/api/addVendor/vendors/${vendorDetails._id}`,
        vendorData
      );
      if (response.status === 200) {
        toast.success("Vendor updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // window.location.reload();
        vendorDetails();
        // fetchVendorDetails();
      } else {
        toast.error("Failed to update Vendor. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while updating the vendor.", {
        position: toast.POSITION.TOP_RIGHT,
      });

      console.error("Error:", error);
    } finally {
      setEditVendorsConfirm(false);
    }
  };

  return (
    <>
      <Modal
        // className="add-bank-account-header-line"
        title="Edit Vendor"
        onCancel={onCancel}
        open={editVendors1}
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
            // data-bs-toggle=''
            // data-bs-target=''
            className="btn btn-info waves-effect waves-light primary-button confirm-modal"
            onClick={editvendorsidUpdate}
            disabled={!validation.name.isValid || !validation.email.isValid || !validation.phoneNumber.isValid}

          >
            Update
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
                className={`form-control ${!validation.name.isValid ? "is-invalid" : ""
                  }`}
                placeholder="Enter Name"
                value={vendorData?.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                Email<span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className={`form-control ${!validation.email.isValid ? "is-invalid" : ""
                  }`}
                placeholder="Enter Email Address"
                value={vendorData?.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
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
                value={String(vendorData?.phoneNumber)}
                onChange={handlePhoneNumberChange}
                placeholder="Enter Phone Number"
                className={`form-control d-flex ${!validation.phoneNumber.isValid ? "is-invalid" : ""
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
                Address Line1<span className="text-danger"></span>
              </label>
              <input
                type="text"
                className={`form-control`}
                placeholder="Enter Address"
                value={vendorData.addressLine1}
                onChange={(e) =>
                  handleInputChange("addressLine1", e.target.value)
                }
              />

            </div>
          </div>
          <div className="col-lg-12 col-sm-12">
            <div className="form-group">
              <label>
                Address Line2
              </label>
              <input
                type="text"
                className={`form-control`}
                placeholder="Enter Address"
                value={vendorData?.addressLine2}
                onChange={(e) =>
                  handleInputChange("addressLine2", e.target.value)
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
              value={vendorData.PANNumber}
              onChange={(e) => handleInputChange("PANNumber", e.target.value)}
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
      <Modal
        className="add-bank-account-header-line"
        onCancel={() => setEditVendorsConfirm(false)}
        open={editVendorConfirm}
        footer={null}
      >
        <div className="form-header">
          <h3 className="update-popup-buttons">
            Update Vendors
          </h3>
          <p>Are you sure you want to upadate?</p>
        </div>
        <div className="modal-btn delete-action">
          <div className="row">
            <div className="col-6">
              <button
                type="reset"
                // data-bs-dismiss="modal"
                className="w-100 btn btn-primary paid-continue-btn"
                onClick={() => handleUpdate(editVendorid)}
              >
                Update
              </button>
            </div>
            <div className="col-6">
              <button
                to="#"
                onClick={() => setEditVendorsConfirm(false)}
                className="w-100 btn btn-primary paid-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

      </Modal>

    </>
  );
};

export default EditVendorModal;
