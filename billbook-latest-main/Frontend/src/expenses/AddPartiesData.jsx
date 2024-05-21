import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { toast } from 'react-toastify';
import axios from "axios";
import { backendUrl } from "../backendUrl";

export const AddPartiesData = ({ visible, onCancel, setDatasource, datasource }) => {
    const [formData, setFormData] = useState({
        partyName: "",
        phoneNumber: "",
    });
    const [validation, setValidation] = useState({
        partyName: { isValid: true, message: '' },
        phoneNumber: { isValid: true, message: '' },

    })
    const handleInputForm = (fieldName, value) => {
        let isValid = true;
        let message = '';

        const nameRegex = /^[a-zA-Z\s]*$/;
        const phoneRegex = /^\d{10}$/;

        if (fieldName === 'partyName') {
            isValid = nameRegex.test(value);
            message = 'Invalid name'
        }
        else if (fieldName === 'phoneNumber') {
            isValid = phoneRegex.test(value);
            message = 'Invalid phone number'
        }
        setFormData({
            ...formData,
            [fieldName]: value
        });
        setValidation({
            ...validation,
            [fieldName]: { isValid, message }

        });
    }

    const validateFormData = (formData) => {
        const validationErrors = {};

        if (!formData.partyName) {
            validationErrors.partyName = { isValid: false, message: 'please enter a name' };

        }
        if (!formData.phoneNumber) {
            validationErrors.phoneNumber = { isValid: false, message: 'please enter a phone Number' };
        }

        return validationErrors;
    };
    const handleSubmit = async (e) => {
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
                `${backendUrl}/api/Parties/party`,
                { formData }
            );

            console.log('Data submitted successfully:', response.data);
            toast.success("Party Added successfully", {
                position: toast.POSITION.TOP_RIGHT,
              }); window.location.reload();

            // Update the state with the new data
            setDatasource([...datasource, response.data]);

            // Close the modal
            setShow(false);

            // Show SweetAlert success notification
            toast.success("Party Submitted", {
                position: toast.POSITION.TOP_RIGHT,
            }); window.location.reload();
        } catch (error) {
            console.error('Error submitting data:', error);

            // Show SweetAlert error notification
            toast.error("Error submitting data", {
                position: toast.POSITION.TOP_RIGHT,
            }); window.location.reload();
        }
        finally {
            onCancel(false);
        }
    };
    return (
        <Modal
            className="add-bank-account-header-line add-godown-styles"
            title="Add Parties"
            onCancel={onCancel}
            open={visible}
            footer={[
                <Button key="cancel" onClick={onCancel}
                    className="btn btn-secondary waves-effect me-2">
                    Cancel
                </Button>,
                <Button key="submit" type="primary"
                    className="btn btn-info waves-effect waves-light primary-button"
                    onClick={handleSubmit}>
                    Submit
                </Button>,]}
        >
            <div className="row">
                <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                        <label >Name<span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className={`form-control ${!validation.partyName.isValid ? "is-invalid" : ""}`}
                            placeholder="Enter Name"

                            value={formData.partyName}
                            onChange={(e) => handleInputForm('partyName', e.target.value)}
                        />
                        {!validation.partyName.isValid && (
                            <div className="error-message text-danger">{validation.partyName.message}</div>
                        )}
                    </div>
                </div>

                <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                        <label>Phone Number<span className="text-danger">*</span></label>
                        <input
                            type="Phonenumber"
                            className={`form-control ${!validation.phoneNumber.isValid ? "is-invalid" : ""}`}
                            placeholder="Enter Phone Number"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputForm("phoneNumber", e.target.value)}
                        />
                        {!validation.phoneNumber.isValid && (
                            <div className="error-message text-danger">{validation.phoneNumber.message}</div>
                        )}
                    </div>
                </div>

            </div>
        </Modal>
    )
}
