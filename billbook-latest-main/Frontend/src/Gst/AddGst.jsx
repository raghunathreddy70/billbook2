// AddGstModal.js
import React, { useState } from "react";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const AddGst = ({ visible, onCancel, gstData,setGstData }) => {
  const [gstPercentageName, setGstPercentageName] = useState();
  const userData = useSelector((state) => state?.user?.userData);

  const [gstPercentageValue, setGstPercentageValue] = useState();
  const [validation, setValidation] = useState({
    gstPercentageName: { isValid: true, message: "" },
  });
  const [validation1, setValidation1] = useState({
    gstPercentageValue: { isValid: true, message: "" },
  });
  const handleGstPercentageName = (fieldName, value) => {
    const percentageRegex = /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)%?$/;
    const isValid = percentageRegex.test(value);

    setGstPercentageName(value);
    setValidation({
      gstPercentageName: {
        isValid,
        message: isValid ? "" : "Invalid (only letters and spaces allowed)",
      },
    });

    // setEditingData((prevData) => ({
    //   ...prevData,
    //   gstPercentageName: value,
    // }));
  };

  const handleGstPercentageValue = (fieldName, value) => {
  
    const percentagevalueRegex = /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)%?$/;
    const isValid = percentagevalueRegex.test(value);
    setGstPercentageValue(value);
    setGstPercentageName(`GST ${value}%`)
    setValidation1({
      gstPercentageValue: {
        isValid,
        message: isValid ? "" : "Invalid (only values allowed)",
      },
    });

    // setEditingData((prevData) => ({
    //   ...prevData,
    //   gstPercentageValue: value,
    // }));
  };
  const validateFormData = () => {
    const validationErrors = {};

    if (!gstPercentageName) {
      validationErrors.gstPercentageName = {
        isValid: false,
        message: "Please enter a percentage",
      };
      console.error("Please enter a percentage");
    }

    if (!gstPercentageValue) {
      validationErrors.gstPercentageValue = {
        isValid: false,
        message: "Please enter a percentage value",
      };
      console.error("Please enter percentage value");
    }
    return validationErrors;
  };
  const handleGstData = async (e) => {
    e.preventDefault();

    const validationErrors = validateFormData();
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      setValidation1((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
    const GstData = {
      gstPercentageName,
      gstPercentageValue,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/addgst/gst",
        {...GstData, businessId: userData?.data?._id }
      );

      if (response.status === 201) {
        setGstData([...gstData , response.data]);

        toast.success("GST added successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        onCancel()
      } else {
        toast.error("Failed to add GST. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while adding the gst.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Error:", error);
    }
  };
  return (
    <Modal
      className="add-bank-account-header-line"
      title="Add Gst"
      onCancel={onCancel}
      visible={visible}
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
          onClick={handleGstData}
        >
          Add Gst
        </Button>,
      ]}
    >
      <div className="row">

        <div className="col-lg-12 col-md-12">
          <div className="form-group">
            <label>
              Percentage Value
              <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${
                !validation1.gstPercentageValue.isValid ? "is-invalid" : ""
              }`}
              placeholder="Enter Percentage Value"
              value={gstPercentageValue}
              onChange={(e) =>
                handleGstPercentageValue("gstPercentageValue", e.target.value)
              }
            />
            {!validation1.gstPercentageValue.isValid && (
              <div className="error-message text-danger">
                {validation1.gstPercentageValue.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddGst;
