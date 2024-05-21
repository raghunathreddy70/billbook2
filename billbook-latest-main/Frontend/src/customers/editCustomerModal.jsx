import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import { Button, Checkbox, Input, Modal, Space, Table, Tooltip } from "antd";
import useHandleDownload from "../Hooks/useHandleDownload";
import { toast } from "react-toastify";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { backendUrl } from "../backendUrl";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useSelector } from "react-redux";

const EditCustomerModal = ({
  onCancel,
  editCustomer1,
  customerDetails,
  fetchCustomerDetails,
}) => {
  console.log("customerDetailsss", customerDetails);

  const userData = useSelector((state) => state?.user?.userData);

  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    // console.log(selectedCountry);
    // console.log(selectedCountry?.isoCode);
    // console.log(State?.getStatesOfCountry(selectedCountry?.isoCode));
  }, [selectedCountry]);

  const [customer, setCustomer] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    GSTNo: "",
    PANNumber: "",
    billingAddress: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
    useShippingAddress: false,
    shippingAddress: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
  });

  console.log("customer Main", customer);

  const [CustomersData, setCustomersData] = useState([]);

  const fetchData = async () => {
    try {
      console.log("userData", userData && userData);
      if (userData && userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/addCustomer/customers/${userData?.data?._id}`
        );
        setCustomersData(response.data);

        console.log("Response Main", response.data);

        setDownloadData(response.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData && userData]);

  console.log("CustomersData", CustomersData);

  useEffect(() => {
    customerDetails && setCustomer(customerDetails);
  }, [customerDetails]);

  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const handleReset = () => {
    setSearchText("");
  };

  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [downloadData, setDownloadData] = useState([]);
  useEffect(() => {
    let downloadableData = customer;
    setDownloadData(downloadableData);
  }, [customer]);
  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    const csvData = downloadData.map((item) => ({
      "No.": item.id,
      Name: item.name,
      Phone: item?.phoneNumber,
      "Email ": item?.email,
      "PanNumber ": item?.PANNumber,
      "GstNO ": item?.GSTNo,
      "Country ": item?.billingAddress.country,
    }));
    // Define CSV headers
    const headers = [
      { label: "No.", key: "id" },
      { label: "Name", key: "name" },
      { label: "PhoneNumber", key: "PhoneNumber" },
      { label: "Email", key: "email" },
      { label: "PanNumber", key: "PanNumber" },
      { label: "GstNO", key: "GstNO" },
      { label: "Country", key: "Country" },
    ];
    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here
  // download data in pdf format code goes here
  const handlePDFDownloadSet = () => {
    const columns = [
      "No.",
      "Name",
      "Phone",
      "Email",
      "PanNumber",
      "GstNo",
      "Country",
    ];

    const rows = downloadData.map((item) => [
      item.id,
      item?.name,
      item?.phoneNumber,
      item.email,
      item.PANNumber,
      item.GSTNo,
      item.billingAddress.country,
    ]);
    handlePDFDownload({ columns, rows, heading: "Vendors" });
  };

  const [modalVisible, setModalVisible] = useState(false);

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

    let isValid = true;
    let message = "";
    const nameRegex = /^[a-zA-Z0-9\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const gstRegex = /^[a-zA-Z0-9]{15}$/;
    const panRegex = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
    const pincodeRegex = /^[0-9]{6}$/;

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

    // Update state based on the address type
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [fieldName]: value,
      [addressType]: {
        ...prevCustomer[addressType],
        [fieldName]: value,
      },
    }));

    // Update form errors
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
      console.error("Invalid phone number entered");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${backendUrl}/api/addCustomer/update-customer/${customerDetails._id}`,
        customer
      );
      if (response.status === 200) {
        toast.success("customer updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        fetchData();
        fetchCustomerDetails();
      } else {
        toast.error("Failed to update customer. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while updating the customer.", {
        position: toast.POSITION.TOP_RIGHT,
      });

      console.error("Error:", error);
    } finally {
      setEditUpdateModal(false);
    }
  };
  const [editUpdateModal, setEditUpdateModal] = useState(false);
  const handleUpdateEdit = () => {
    const validationErrors = validateFormData(customer);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      console.log("validationErrors", validationErrors);
      return;
    }
    setEditUpdateModal(true);
    onCancel(false);
  };

  return (
    <>
      <Modal
        title="Edit Customer"
        onCancel={onCancel}
        open={editCustomer1}
        width={"800px"}
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
            className="btn btn-info waves-effect waves-light primary-button confirm-modal"
            onClick={handleUpdateEdit}
          >
            Update
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
                className={`form-control ${
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
                PANNumber <span className="text-danger"></span>
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
                value={customer?.billingAddress?.country}
                // value={selectedCountry}
                onChange={(item) => {
                  handleInputChange("country", item, "billingAddress");
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
                options={
                  customer?.billingAddress?.country &&
                  State?.getStatesOfCountry(
                    customer?.billingAddress?.country?.isoCode
                  )
                }
                getOptionLabel={(options) => {
                  return options["name"];
                }}
                getOptionValue={(options) => {
                  return options["name"];
                }}
                value={customer?.billingAddress?.state}
                onChange={(item) => {
                  handleInputChange("state", item, "billingAddress");
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
                  customer?.billingAddress?.state?.countryCode,
                  customer?.billingAddress?.state?.isoCode
                )}
                getOptionLabel={(options) => {
                  return options["name"];
                }}
                getOptionValue={(options) => {
                  return options["name"];
                }}
                value={customer?.billingAddress?.city}
                onChange={(item) => {
                  handleInputChange("city", item, "billingAddress");
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
                className={`form-control
                      ${
                        !formErrors.billingAddress?.pincode?.isValid
                          ? "is-invalid"
                          : ""
                      }`}
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
              <h1 className="billing-address-line">Shipping Address</h1>
              <div className="row">
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
                      value={customer?.shippingAddress?.country}
                      onChange={(item) => {
                        handleInputChange("country", item, "shippingAddress");
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
                      options={
                        customer?.shippingAddress?.country &&
                        State?.getStatesOfCountry(
                          customer?.shippingAddress?.country?.isoCode
                        )
                      }
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        return options["name"];
                      }}
                      value={customer?.shippingAddress?.state}
                      onChange={(item) => {
                        handleInputChange("state", item, "shippingAddress");
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
                        customer?.shippingAddress?.state?.countryCode,
                        customer?.shippingAddress?.state?.isoCode
                      )}
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        console.log("optionValue", options["name"]);
                        return options["name"];
                      }}
                      value={customer?.shippingAddress?.city}
                      onChange={(item) => {
                        handleInputChange("city", item, "shippingAddress");
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
                      placeholder="Enter Country"
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
                        {formErrors.shippingAddress?.incode?.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
      <Modal
        onCancel={() => setEditUpdateModal(false)}
        closable={false}
        open={editUpdateModal}
        footer={null}
        centered
      >
        <div className="form-header">
          <h3 className="update-popup-buttons">Update Customer</h3>
          <p>Are you sure want to update?</p>
        </div>
        <div className="modal-btn delete-action">
          <div className="row">
            <div className="col-6">
              <button
                type="submit"
                className="w-100 btn btn-primary paid-continue-btn"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
            <div className="col-6">
              <button
                type="submit"
                onClick={() => setEditUpdateModal(false)}
                className="w-100 btn btn-primary paid-cancel-btn delete-category"
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

export default EditCustomerModal;
