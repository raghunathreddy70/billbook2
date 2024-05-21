import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal, Button, Input, Checkbox } from "antd";
import Select from "react-select";
import "sweetalert2/dist/sweetalert2.min.css";
import { backendUrl } from "../backendUrl";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddCustomer = ({ visible, onCancel, fetchData }) => {
  const userData = useSelector((state) => state?.user?.userData);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountry1, setSelectedCountry1] = useState(null);

  const [selectedState, setSelectedState] = useState(null);

  const [selectedState1, setSelectedState1] = useState(null);

  const [selectedCity, setSelectedCity] = useState(null);

  const [selectedCity1, setSelectedCity1] = useState(null);

  useEffect(() => {
    console.log(selectedCountry);
    console.log(selectedCountry?.isoCode);
    console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  }, [selectedCountry]);

  const customerObject = {
    name: "",
    phoneNumber: "",
    email: "",
    GSTNo: "",
    PANNumber: "",

    billingAddress: {
      addressLine1: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
    useShippingAddress: false,
    shippingAddress: {
      addressLine1: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
  };

  const [customer, setCustomer] = useState(customerObject);
  const [handleSubmitTriggered, setHandleSubmitTriggered] = useState(false);
  const eventRef = useRef(null);

  console.log("awdzsfcasf", customer);

  const [phoneNumber, setPhoneNumber] = useState([]);

  const [formErrors, setFormErrors] = useState({
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phoneNumber: { isValid: true, message: "" },
    GSTNo: { isValid: true, message: "" },
    PANNumber: { isValid: true, message: "" },
    billingAddress: {
      pincode: { isValid: true, message: "" },
    },
    shippingAddress: {
      pincode: { isValid: true, message: "" },
    },
  });

  const handleInputChange = (fieldName, value, addressType) => {
    setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));

    const nameRegex = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const gstRegex = /^[a-zA-Z0-9]{15}$/;
    const panRegex = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    let isValid = true;
    let message = "";

    if (fieldName === "name") {
      isValid = nameRegex.test(value);
      message = "Invalid name";
    } else if (fieldName === "email") {
      isValid = emailRegex.test(value);
      message = "Invalid email";
    } else if (fieldName === "GSTNo") {
      isValid = gstRegex.test(value);
      message = "Invalid GST No";
    } else if (fieldName === "PANNumber") {
      isValid = panRegex.test(value);
      message = "Invalid PANNumber";
    } else if (fieldName === "billingAddress.pincode") {
      isValid = pincodeRegex.test(value);
      message = "Invalid Pincode";
    } else if (fieldName === "shippingAddress.pincode") {
      isValid = pincodeRegex.test(value);
      message = "Invalid Pincode";
    }

    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [fieldName]: value,
      [addressType]: {
        ...prevCustomer[addressType],
        [fieldName]: value,
      },
    }));

    if (fieldName === "useShippingAddress" && value) {
      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        shippingAddress: {
          ...prevCustomer.billingAddress,
        },
      }));
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: { isValid, message },
    }));
  };

  const validateFormData = (customer) => {
    const validationErrors = {};
    if (!customer.name) {
      validationErrors.name = {
        isValid: false,
        message: "please enter a name",
      };
    }
    if (!customer.email) {
      validationErrors.email = {
        isValid: false,
        message: "please enter a email",
      };
    }
    if (!customer.phoneNumber) {
      validationErrors.phoneNumber = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }

    return validationErrors;
  };

  const handlePhoneNumberChange = (value) => {
    const phoneNumberString = value ? String(value) : "";
    const isValid = isValidPhoneNumber(phoneNumberString);

    if (isValid) {
      setPhoneNumber(phoneNumberString);
      handleInputChange("phoneNumber", phoneNumberString);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: { isValid: true, message: "" },
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: {
          isValid: false,
          message: "Please enter a valid phone number",
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFormData(customer);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      console.log("validationErrors", validationErrors);
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/addCustomer/customers`,
        { ...customer, businessId: userData?.data?._id }
      );
      console.log("Data submitted successfully:", response.data);
      toast.success("Customer added successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      fetchData();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setCustomer(customerObject); 
      onCancel(false); 
    }
  };


  const handleButtonClick = (e) => {
    eventRef.current = e; 
    setHandleSubmitTriggered(true); 
  };

  useEffect(() => {
    if (handleSubmitTriggered) {
      handleSubmit(eventRef.current);
      setHandleSubmitTriggered(false); // Reset the trigger
    }
  }, [handleSubmitTriggered]);

  useEffect(() => {
    if (selectedCountry) {
      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        billingAddress: {
          ...prevCustomer.billingAddress,
          country: selectedCountry,
        },
      }));
      setSelectedState("");
      setSelectedCity("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry1) {
      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        shippingAddress: {
          ...prevCustomer.shippingAddress,
          country: selectedCountry1,
        },
      }));
      setSelectedState1("");
      setSelectedCity1("");
    }
  }, [selectedCountry1]);

  useEffect(() => {
    if (selectedState) {
      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        billingAddress: {
          ...prevCustomer.billingAddress,
          state: selectedState,
        },
      }));
      // setSelectedCountry("")
      setSelectedCity("");
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedState1) {
      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        shippingAddress: {
          ...prevCustomer.shippingAddress,
          state: selectedState1,
        },
      }));
      // setSelectedCountry1("")
      setSelectedState1("");
    }
  }, [selectedState1]);

  useEffect(() => {
    if (selectedCity) {
      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        billingAddress: {
          ...prevCustomer.billingAddress,
          city: selectedCity,
        },
      }));
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedCity1) {
      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        shippingAddress: {
          ...prevCustomer.shippingAddress,
          city: selectedCity1,
        },
      }));
    }
  }, [selectedCity1]);

  return (
    <Modal
      title="Add Customer"
      visible={visible}
      width={800}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          className="btn btn-secondary waves-effect"
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="btn btn-info waves-effect waves-light"
          onClick={handleButtonClick}
          disabled={
            !formErrors.name.isValid ||
            !formErrors.phoneNumber.isValid ||
            !formErrors.email.isValid
          }
        >
          Submit
        </Button>,
      ]}
    >
      <div className="row">
        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              Customer Name
              <span className="text-danger">*</span>
            </label>
            <Input
              value={customer?.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter Name"
              className={`form-control ${
                !formErrors?.name?.isValid && "is-invalid"
              }`}
            />
            {!formErrors?.name?.isValid && (
              <div className="error-message text-danger">
                {formErrors?.name?.message}
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              Phone Number
              <span className="text-danger">*</span>
            </label>
            <PhoneInput
              international
              defaultCountry="IN"
              value={customer.phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter Phone Number"
              className={`form-control d-flex  ${
                !formErrors.phoneNumber.isValid && "is-invalid"
              }`}
            />
            {!formErrors.phoneNumber.isValid && (
              <div className="error-message text-danger">
                {formErrors.phoneNumber.message}
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              Email<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control
  ${!formErrors.email.isValid ? "is-invalid" : ""}`}
              placeholder="Enter Name"
              value={customer.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            {!formErrors.email.isValid && (
              <div className="error-message text-danger">
                {formErrors.email.message}
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              GST No<span className="text-danger"></span>
            </label>
            <input
              type="text"
              className={`form-control
  ${!formErrors.GSTNo?.isValid ? "is-invalid" : ""}`}
              placeholder="Enter Name"
              value={customer.GSTNo}
              onChange={(e) => handleInputChange("GSTNo", e.target.value)}
            />
            {!formErrors.GSTNo?.isValid && (
              <div className="error-message text-danger">
                {formErrors.GSTNo?.message}
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              PAN Number <span className="text-danger"></span>
            </label>
            <input
              type="text"
              className={`form-control
  ${!formErrors.PANNumber?.isValid ? "is-invalid" : ""}`}
              placeholder="Enter Name"
              value={customer.PANNumber}
              onChange={(e) => handleInputChange("PANNumber", e.target.value)}
            />
            {!formErrors.PANNumber?.isValid && (
              <div className="error-message text-danger">
                {formErrors.PANNumber?.message}
              </div>
            )}
          </div>
        </div>
        <h1 className="billing-address-line mx-3">Billing Address</h1>
        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              Address Line <span className="text-danger"></span>
            </label>
            <input
              type="text"
              className={`form-control
 `}
              placeholder="Enter Name"
              value={customer.billingAddress?.addressLine1}
              onChange={(e) =>
                handleInputChange(
                  "addressLine1",
                  e.target.value,
                  "billingAddress"
                )
              }
            />
          </div>
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              Country <span className="text-danger"></span>
            </label>
            <Select
              className="z-50"
              options={Country.getAllCountries()}
              getOptionLabel={(options) => {
                return options["name"];
              }}
              getOptionValue={(options) => {
                return options["name"];
              }}
              value={selectedCountry}
              onChange={(item) => {
                setSelectedCountry(item);
              }}
            />
          </div>
        </div>

        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              State <span className="text-danger"></span>
            </label>
            <Select
              options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
              getOptionLabel={(options) => {
                return options["name"];
              }}
              getOptionValue={(options) => {
                return options["name"];
              }}
              value={selectedState}
              onChange={(item) => {
                setSelectedState(item);
              }}
            />
          </div>
        </div>

        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              City <span className="text-danger"></span>
            </label>
            <Select
              options={City.getCitiesOfState(
                selectedState?.countryCode,
                selectedState?.isoCode
              )}
              getOptionLabel={(options) => {
                return options["name"];
              }}
              getOptionValue={(options) => {
                return options["name"];
              }}
              value={selectedCity}
              onChange={(item) => {
                setSelectedCity(item);
              }}
            />
          </div>
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="form-group">
            <label>
              PinCode <span className="text-danger"></span>
            </label>
            <input
              type="number"
              className={`form-control
    ${!formErrors?.billingAddress?.pincode?.isValid ? "is-invalid" : ""}`}
              placeholder="Enter Country"
              value={customer?.billingAddress?.pincode}
              onChange={(e) =>
                handleInputChange("pincode", e.target.value, "billingAddress")
              }
            />
            {!formErrors.billingAddress?.pincode?.isValid && (
              <div className="error-message text-danger">
                {formErrors.billingAddress?.pincode?.message}
              </div>
            )}
          </div>
        </div>
        <Checkbox
          checked={customer.useShippingAddress}
          onChange={(e) =>
            handleInputChange("useShippingAddress", e.target.checked)
          }
        >
          Use shipping address
        </Checkbox>
        {!customer.useShippingAddress && (
          <div>
            <h3 className="billing-address-line">Shipping Address</h3>
            <div className="row">
              <div className="col-lg-6 col-sm-6">
                <div className="form-group">
                  <label>
                    Address Line <span className="text-danger"></span>
                  </label>
                  <input
                    type="text"
                    className={`form-control`}
                    placeholder="Enter Name"
                    value={customer.shippingAddress?.addressLine1}
                    onChange={(e) =>
                      handleInputChange(
                        "addressLine1",
                        e.target.value,
                        "shippingAddress"
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-6">
                <div className="form-group">
                  <label>
                    Country <span className="text-danger"></span>
                  </label>

                  <Select
                    options={Country.getAllCountries()}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedCountry1}
                    onChange={(item) => {
                      setSelectedCountry1(item);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-6">
                <div className="form-group">
                  <label>
                    State <span className="text-danger"></span>
                  </label>
                  <Select
                    options={State?.getStatesOfCountry(
                      selectedCountry1?.isoCode
                    )}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedState1}
                    onChange={(item) => {
                      setSelectedState1(item);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-6">
                <div className="form-group">
                  <label>
                    City <span className="text-danger"></span>
                  </label>
                  <Select
                    options={City.getCitiesOfState(
                      selectedState1?.countryCode,
                      selectedState1?.isoCode
                    )}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      console.log("optionValue", options["name"]);
                      return options["name"];
                    }}
                    value={selectedCity1}
                    onChange={(item) => {
                      console.log("The ITEM VALUE", item);
                      setSelectedCity1(item);
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-6">
                <div className="form-group">
                  <label>
                    PinCode <span className="text-danger"></span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      !formErrors.shippingAddress?.pincode?.isValid
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Pincode"
                    value={customer?.shippingAddress?.pincode}
                    onChange={(e) =>
                      handleInputChange(
                        "pincode",
                        e.target.value,
                        "shippingAddress"
                      )
                    }
                  />
                  {!formErrors?.shippingAddress?.pincode?.isValid && (
                    <div className="error-message text-danger">
                      {formErrors.shippingAddress?.pincode?.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
export default AddCustomer;
