import React, { useEffect, useState } from "react";
import { Modal, Table, Button, Tooltip, Select } from "antd";
import Select2 from "react-select2-wrapper";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const AddGodown = ({ visible, onCancel, GodownList, setGodownList }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    godownName: "",
    godownStreetAddress: "",
    placeofsupply: "",
    godownPincode: "",
    godownCity: "",
  });
  const userData = useSelector((state) => state?.user?.userData)
  const [States, setStates] = useState([
    { id: "Andhra Pradesh", text: "Andhra Pradesh" },
    { id: "Arunachal Pradesh", text: "Arunachal Pradesh" },
    { id: "Assam", text: "Assam" },
    { id: "Bihar", text: "Bihar" },
    { id: "Chhattisgarh", text: "Chhattisgarh" },
    { id: "Goa", text: "Goa" },
    { id: "Gujarat", text: "Gujarat" },
    { id: "Haryana", text: "Haryana" },
    { id: "Himachal Pradesh", text: "Himachal Pradesh" },
    { id: "Jharkhand", text: "Jharkhand" },
    { id: "Karnataka", text: "Karnataka" },
    { id: "Kerala", text: "Kerala" },
    { id: "Madhya Pradesh", text: "Madhya Pradesh" },
    { id: "Maharashtra", text: "Maharashtra" },
    { id: "Manipur", text: "Manipur" },
    { id: "Meghalaya", text: "Meghalaya" },
    { id: "Mizoram", text: "Mizoram" },
    { id: "Nagaland", text: "Nagaland" },
    { id: "Odisha", text: "Odisha" },
    { id: "Punjab", text: "Punjab" },
    { id: "Rajasthan", text: "Rajasthan" },
    { id: "Sikkim", text: "Sikkim" },
    { id: "Tamil Nadu", text: "Tamil Nadu" },
    { id: "Telangana", text: "Telangana" },
    { id: "Tripura", text: "Tripura" },
    { id: "Uttar Pradesh", text: "Uttar Pradesh" },
    { id: "Uttarakhand", text: "Uttarakhand" },
    { id: "West Bengal", text: "West Bengal" },
  ]);

  const [validation, setValidation] = useState({
    godownName: { isValid: true, message: "" },
    godownPincode: { isValid: true, message: "" },
  });

  const changeInputForm = (fieldName, value) => {
    const nameRegex = /^[a-zA-Z0-9\s'-]+$/;
    const addressRegex = /^[a-zA-Z0-9\s,'.#-]+$/;
    const cityRegex = /^[a-zA-Z\s'-]+$/;
    const pincodeRegex = /^\d{4,6}$/;
    let isValid = true;
    let message = "";
    if (fieldName === "godownName") {
      isValid = nameRegex.test(value);
      message = "Invalid godown name";
    }
    if (fieldName === "godownStreetAddress") {
      isValid = addressRegex.test(value);
      message = "Invalid godown Streetaddress";
    }
    if (fieldName === "placeofsupply") {
      isValid = value;
      message = "Invalid godown Streetaddress";
    }
    if (fieldName === "godownPincode") {
      isValid = pincodeRegex.test(value);
      message = "Invalid godown pincode";
    }
    if (fieldName === "godownCity") {
      isValid = cityRegex.test(value);
      message = "Invalid godown city";
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
    if (!formData.godownName) {
      validationErrors.godownName = {
        isValid: false,
        message: "please enter valid godown name",
      };
    }

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
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/godown/addgodown",
        {...formData, businessId : userData?.data?._id}
      );

      if (response.status === 201) {
        toast.success("Godown added successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setGodownList([...GodownList, response.data])
        // fetchGodownData();
      } else {
        toast.error("Failed to add Godown. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while adding the Godown.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Error:", error);
    } finally {
      onCancel(false);
    }
  };
  return (
    <>
      <Modal
        className="add-bank-account-header-line add-godown-styles"
        title="Add Godown"
        width={550}
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
              !validation.godownName.isValid ||
              !validation.godownPincode.isValid
            }
          >
            Submit
          </Button>,
        ]}
      >
        <div className="row">
          <div className="col-lg-12 col-md-6 col-sm-12">
            <div className="mb-3 form-group">
              <label>
                Godown Name{" "}
                <span className="accountprofilesettings-start-mark">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${!validation.godownName.isValid ? "is-invalid" : ""
                  }`}
                id="field-1"
                placeholder="Ex. Main FCD Godown"
                value={formData.godownName}
                onChange={(e) => changeInputForm("godownName", e.target.value)}
              />
              {!validation.godownName.isValid && (
                <div className="error-message text-danger">
                  {validation.godownName.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-12 col-md-6 col-sm-12">
            <div className="mb-3 form-group">
              <label>Street Address</label>
              <input
                type="text"
                className={
                  `form-control`
                  // ${!validation.godownStreetAddress.isValid
                  //   ? "is-invalid"
                  //   : ""
                  //   }`
                }
                id="field-2"
                value={formData.godownStreetAddress}
                placeholder="Enter Street Address"
                onChange={(e) =>
                  changeInputForm("godownStreetAddress", e.target.value)
                }
                />
                {/* {!validation.godownStreetAddress.isValid && (
                              <div className="error-message text-danger">
                                {validation.godownStreetAddress.message}
                              </div>
                            )} */}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>Place of Supply</label>
              <Select2
                data={States}
                onChange={(e) =>
                  changeInputForm("placeofsupply", e.target.value)
                }
                className={`form-select w-100 is-invalid`}
                options={{
                  placeholder: "Enter state",
                }}
                value={formData.placeofsupply}
              />
              {/* {!validation.placeofsupply.isValid && (
                              <div className="error-message text-danger">
                                {validation.placeofsupply.message}
                              </div>
                            )} */}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                onChange={(e) =>
                  changeInputForm("godownPincode", e.target.value)
                }
                value={formData.godownPincode}
                className={`form-control
                 ${!validation.godownPincode.isValid
                    ? "is-invalid"
                    : ""
                  }`}
                placeholder="Ex.560038"
              />
              {!validation.godownPincode.isValid && (
                <div className="error-message text-danger">
                  {validation.godownPincode.message}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3 form-group">
              <label>City</label>
              <input
                type="text"
                onChange={(e) => changeInputForm("godownCity", e.target.value)}
                value={formData.godownCity}
                className={`form-control`}
                // ${!validation.godownCity.isValid
                //   ? "is-invalid"
                //   : ""
                //   }`}
                id="field-4"
                placeholder="Boston"
              />
              {/* {!validation.godownCity.isValid && (
                              <div className="error-message text-danger">
                                {validation.godownCity.message}
                              </div>
                            )} */}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default AddGodown;
