import React, { useState } from "react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const PanCardNumber = ({
  open,
  onClose,
  setPancardmodalOpen,
  customerName,
  handleSubmit,
  isCustomerPan,
  isBusinessPan,
}) => {
  const userData = useSelector((state) => state?.user?.userData);

  const bussinessPan = userData?.data?._id;

  console.log("customerNamesadfc", customerName);

  const [formData, setFormData] = useState({
    pannumber1: "",
    pannumber2: "",
  });

  console.log("formDatainPan", formData);
  const [validation, setValidation] = useState({
    pannumber1: { isValid: true, message: "" },
    pannumber2: { isValid: true, message: "" },
  });
  const changeHandle = (fieldName, value) => {
    const panRegex = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;
    let isValid = true;
    let message = "";
    if (fieldName === "pannumber1") {
      isValid = panRegex.test(value);
      message = "Invalid value";
    } else if (fieldName === "pannumber2") {
      isValid = panRegex.test(value);
      message = "Invalid value";
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

    return validationErrors;
  };

  const handleSubmitPanNumber = async (e) => {
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
      const response = await axios.put(
        `http://localhost:8000/api/addInvoice/updatePanNumber/${customerName}/${bussinessPan}`,
        formData
      );

      console.log("Data updated successfully:", response.data);

      if (response.status === 200) {
        toast.success("PANNumber Updated Succesfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        //   window.location.reload();
        handleSubmit(e);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setPancardmodalOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        title="PAN Number"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className="btn btn-secondary waves-effect me-2"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="btn btn-info waves-effect waves-light primary-button"
            onClick={handleSubmitPanNumber}
          >
            Submit
          </Button>,
        ]}
      >
        <div className="row">
          <div className="col-md-12">
            <div className="">
              <div className="form-group-item border-0 pb-0 mb-0">
                <div className="row">
                  <div className="Invoice-more-than-one pb-2">
                    <p>
                      For Invoice more than ₹2 Lakh, PAN is required for both
                      business owner and party
                    </p>
                  </div>
                  {!isBusinessPan && (
                    <div className="col-lg-12 col-sm-12">
                      <div className="form-group">
                        <label>
                          Business owner PAN{" "}
                          <span className="text-danger"></span>
                        </label>
                        <input
                          className={`form-control ${
                            !validation?.pannumber1?.isValid && "is-invalid"
                          }`}
                          type="text"
                          placeholder="Enter Title"
                          value={formData?.pannumber1}
                          onChange={(e) =>
                            changeHandle("pannumber1", e.target.value)
                          }
                        />
                        {!validation?.pannumber1?.isValid && (
                          <div className="error-message text-danger">
                            {validation?.pannumber1?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {!isCustomerPan && (
                    <div className="col-lg-12 col-sm-12">
                      <div className="form-group">
                        <label>
                          Customer PAN <span className="text-danger"></span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            !validation?.pannumber2?.isValid && "is-invalid"
                          }`}
                          placeholder="Enter Title"
                          value={formData?.pannumber2}
                          onChange={(e) =>
                            changeHandle("pannumber2", e.target.value)
                          }
                        />
                        {!validation?.pannumber2?.isValid && (
                          <div className="error-message text-danger">
                            {validation?.pannumber2?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PanCardNumber;
