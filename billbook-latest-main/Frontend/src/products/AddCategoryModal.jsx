
import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { toast } from 'react-toastify';
import axios from "axios";
import { useSelector } from "react-redux";

const AddCategoryModal = ({ visible, onCancel, setDatasource, datasource }) => {
 
  const [formData, setFormData] = useState({
    categoryName: "",
    businessId: userData?.data?._id,
  });

  const [validation, setValidation] = useState({
    categoryName: { isValid: true, message: '' },
  });

  const changeHandle = (fieldName, value) => {
    const withoutTaxRegex = /^[a-zA-Z\s]*$/;
    let isValid = withoutTaxRegex.test(value);
    let message = isValid ? '' : 'Invalid value';
    
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
    if (!formData.categoryName) {
      validationErrors.categoryName = { isValid: false, message: 'Please enter a valid name' };
    }
    return validationErrors;
  };

  const userData = useSelector((state) => state?.user?.userData)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form data
    const validationErrors = validateFormData(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setValidation(prevValidation => ({
        ...prevValidation,
        ...validationErrors
      }));
      return; // Stop further execution if validation fails
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/addCategory/categories",
       {...formData, businessId : userData?.data?._id}
      );
   
      console.log("Data submitted successfully:", response.data);
  
      // Update the state with the new data
      setDatasource([...datasource, response.data]);
  
      // Show SweetAlert success notification
      toast.success("Data Submitted", {
        position: toast.POSITION.TOP_RIGHT,
      });
  
    } catch (error) {
      console.error("Error submitting data:", error);
  
      // Show SweetAlert error notification
      toast.error("Error submitting data", {
        position: toast.POSITION.TOP_RIGHT,
      });
  
    } finally {
      onCancel(false);
    }
  };
  
  

  return (
    <Modal
      className="add-bank-account-header-line"
      title="Add Category"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} className="btn btn-secondary waves-effect me-2">
          Cancel
        </Button>,
        <Button
        key="submit"
        type="primary"
        className="btn btn-info waves-effect waves-light primary-button"
        onClick={handleSubmit}
        disabled={!validation.categoryName.isValid}
      >
        Submit
      </Button>
      
      ]}
    >
      <div className="row">
        <div className="col-md-12">
          <div className="">
            <div className="form-group-item border-0 pb-0 mb-0">
              <div className="row">
                <div className="col-lg-12 col-sm-12">
                  <div className="form-group">
                    <label>
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${!validation?.categoryName?.isValid ? "is-invalid" : ""}`}
                      placeholder="Enter Title"
                      value={formData?.categoryName}
                      onChange={(e) => changeHandle('categoryName', e.target.value)}
                    />
                    {!validation?.categoryName?.isValid && <div className="error-message text-danger">{validation?.categoryName?.message}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
