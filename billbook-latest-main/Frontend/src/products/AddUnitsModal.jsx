import React, { useState, useEffect } from "react";
import { Button, Modal } from 'antd';
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

export const AddUnitsModal = ({ visible, onCancel, setDatasource, datasource }) => {

  const userData = useSelector((state) => state?.user?.userData)
  const [formData, setFormData] = useState({
    unitName: "",
    shortName: "",
    businessId: userData?.data?._id,
  })

  const [validation, setValidation] = useState({
    unitName: { isValid: true, message: '' },
    shortName: { isValid: true, message: '' },
  })

    const handleUnitNameChange = (fieldName, value) => {
        const withoutTaxRegex = /^[a-zA-Z\s]*$/;
        let isValid = true;
        let message = '';
        if (fieldName === 'unitName') {
          isValid = withoutTaxRegex.test(value);
          message = 'Invalid value';
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
    
      const handleShortNameChange = (fieldName, value) => {
        const withoutTaxRegex = /^[a-zA-Z\s]*$/;
        let isValid = true;
        let message = '';
        if (fieldName === 'shortName') {
          isValid = withoutTaxRegex.test(value);
          message = 'Invalid value';
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
        if (!formData.unitName) {
          validationErrors.unitName = { isdataValid: false, message: 'please enter valid unit name' };
        }
        if (!formData.shortName) {
          validationErrors.shortName = { isdataValid: false, message: 'please enter valid short name' };
        }
        return validationErrors;
      };
      const handleunitData = async (e) => {
        e.preventDefault();
        const validationErrors = validateFormData(formData);
        if (Object.keys(validationErrors).length > 0) {
          setValidation(prevValidation => ({
            ...prevValidation,
            ...validationErrors
          }));
          return;
        }
    
        try {
          const response = await axios.post(
            'http://localhost:8000/api/Unit/units',
          {...formData, businessId : userData?.data?._id}
          );
    
          console.log("Data submitted successfully:", response.data);
          setDatasource(prevDatasource => [...prevDatasource, response.data]); // Add new data to datasource array
    
          toast.success("Submitted successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });

        } catch (error) {
          toast.success("Failed to add Currency. Please try again.", {
            position: toast.POSITION.TOP_RIGHT,
          });

          console.error('Error:', error);
        } finally {
          onCancel(false)
        }
      };
  return (
    <Modal
    className="add-bank-account-header-line"
    title="Add Units"
    onCancel={onCancel}
    open={visible}
    footer={[
      <Button key="cancel" onClick={() => onCancel(false)}
        className="btn btn-secondary waves-effect me-2">
        Cancel
      </Button>,
      <Button key="submit" type="primary"

        className="btn btn-info waves-effect waves-light primary-button"
        onClick={handleunitData}>
        Add Unit
      </Button>,]}
  >
    <div className="row">
      <div className="col-lg-12 col-sm-12">
        <div className="form-group">
          <label>
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${!validation?.unitName?.isValid ? "is-invalid" : ""}`}
            placeholder="Enter Title"
            value={formData.unitName}
            onChange={(e) => handleUnitNameChange('unitName', e.target.value)}
          />
          {!validation?.unitName?.isValid && <div className="error-message text-danger">{validation?.unitName?.message}</div>}

        </div>
      </div>
      <div className="col-lg-12 col-sm-12">
        <div className="form-group">
          <label>
            Symbol <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${!validation?.shortName?.isValid ? "is-invalid" : ""}`}
            placeholder="Enter Symbol"
            value={formData.shortName}
            onChange={(e) => handleShortNameChange('shortName', e.target.value)}
          />
          {!validation?.shortName?.isValid && <div className="error-message text-danger">{validation?.shortName?.message}</div>}

        </div>
      </div>
    </div>
  </Modal>
  )
}
