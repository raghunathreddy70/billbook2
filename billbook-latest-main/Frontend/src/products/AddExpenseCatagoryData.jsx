import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { toast } from 'react-toastify';
import axios from "axios";

export const AddExpenseCatagoryData = ({ visible, onCancel, setDatasource, datasource,fetchexpensecategoryData }) => {
    const [formData, setFormData] = useState([])

    const [validation, setValidation] = useState({
        expensecategoryName: { isValid: true, message: '' },
    })
    const changeHandle = (fieldName, value) => {
        const withoutTaxRegex = /^[a-zA-Z\s]*$/;
        let isValid = true;
        let message = '';
        if (fieldName === 'expensecategoryName') {
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
    }
    const validateFormData = (formData) => {
        const validationErrors = {};
        if (!formData.expensecategoryName) {
            validationErrors.expensecategoryName = { isdataValid: false, message: 'please enter valid name' };
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
                "http://localhost:8000/api/ExpenseCat/expensecategories",
                formData
            );
            setDatasource([...datasource, response.data]);
            //   setFilteredDatasource([...filteredDatasource, response.data]);

            toast.success("added successfully", {
                position: toast.POSITION.TOP_RIGHT,
            });
            fetchexpensecategoryData();

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
        <Modal
            className="add-bank-account-header-line add-godown-styles"
            title="Add Category"
            onCancel={onCancel}
            visible={visible}
            footer={
                [
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
                                            className={`form-control ${!validation.expensecategoryName.isValid ? "is-invalid" : ""}`}
                                            placeholder="Enter Title"
                                            value={formData.expensecategoryName}
                                            onChange={(e) => changeHandle('expensecategoryName', e.target.value)}
                                        />
                                        {!validation.expensecategoryName.isValid && <div className="error-message text-danger">{validation.expensecategoryName.message}</div>}

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
