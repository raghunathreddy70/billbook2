import React, { useState } from 'react'
import { PiImageSquareThin } from "react-icons/pi";
import Select2 from 'react-select2-wrapper';
export const EditManageBusiness = () => {
    const [open3, setOpen3] = useState(false);
    const [bgOptions, setbgOptions] = useState([
        { id: 1, text: 'Retailer' },
        { id: 2, text: 'Wholesaler' },
        { id: 3, text: 'Distributor' },
        { id: 4, text: 'Manufacturer' },
        { id: 5, text: 'Services' }
    ])
    const [brtOptions, setbrtOptions] = useState([
        { id: 1, text: 'Public limited company' },
        { id: 2, text: 'Partnership firm' },
        { id: 3, text: 'One Person Company' },
        { id: 4, text: 'Business not registered' },
        { id: 5, text: 'Services' }
    ])
    const [formData, setFormData] = useState({
        businessName: "",
        companyPhone: "",
        companyEmail: "",
        billingAddress: "",
        billingState: "",
        billingpincode: "",
        billingCity: "",
        businessType: "",
        industryType: '',
        businessRegType: "",
    })
    const [validation, setValidation] = useState({
        businessName: { isValid: true, message: '' },
        companyPhone: { isValid: true, message: '' },
        companyEmail: { isValid: true, message: '' },
        billingAddress: { isValid: true, message: '' },
        billingCity: { isValid: true, message: '' },
        billingState: { isValid: true, message: '' },
        billingpincode: { isValid: true, message: '' },
        businessType: { isValid: true, message: '' },
        industryType: { isValid: true, message: '' },
        businessRegType: { isValid: true, message: "" },
    })
    const handleInputChange = (fieldName, value) => {
        let isValid = true;
        let message = '';
        const cityRegex = /^[a-zA-Z\s]*$/;
        const nameRegex = /^[a-zA-Z0-9\s]*$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const pincodeRegex = /^\d{6}$/;

        if (fieldName === 'businessName') {
            isValid = nameRegex.test(value);
            message = 'Invalid businessName'
        } else if (fieldName === 'companyPhone') {
            isValid = phoneRegex.test(value);
            message = 'Invalid phone number'
        } else if (fieldName === 'companyEmail') {
            isValid = emailRegex.test(value);
            message = 'Invalid email'
        } else if (fieldName === 'billingAddress') {
            isValid = nameRegex.test(value);
            message = 'Invalid address'
        } else if (fieldName === 'billingCity') {
            isValid = cityRegex.test(value);
            message = 'Invalid city'
        } else if (fieldName === 'billingState') {
            isValid = cityRegex.test(value);
            message = 'Invalid state'
        } else if (fieldName === 'billingpincode') {
            isValid = pincodeRegex.test(value);
            message = 'Invalid pincode'
        } else if (fieldName === 'businessType') {
            isValid = value;
            message = 'Invalid '
        } else if (fieldName === 'industryType') {
            isValid = value;
            message = 'Invalid '
        } else if (fieldName === 'businessRegType') {
            isValid = value;
            message = 'Invalid '
        }
        setFormData({
            ...formData,
            [fieldName]: value
        });
        setValidation({
            ...validation,
            [fieldName]: { isValid, message }

        });
    };
    const validateFormBusinessData = (formData) => {
        const validationErrors1 = {};

        if (!formData.businessType) {
            validationErrors1.businessType = { isValid: false, message: 'please select a business type' };
        }
        if (!formData.industryType) {
            validationErrors1.industryType = { isValid: false, message: 'please select a industry Type' };
        }
        if (!formData.businessRegType) {
            validationErrors1.businessRegType = { isValid: false, message: 'please enter a business Registration Type' };
        }

        return validationErrors1;
    };
    const validateFormData = (formData) => {
        const validationErrors = {};

        if (!formData.businessName) {
            validationErrors.businessName = { isValid: false, message: 'please enter a businessName' };
        }
        if (!formData.companyEmail) {
            validationErrors.companyEmail = { isValid: false, message: 'please enter a email' };
        }
        if (!formData.companyPhone) {
            validationErrors.companyPhone = { isValid: false, message: 'please enter a phone Number' };
        }
        if (!formData.billingAddress) {
            validationErrors.billingAddress = { isValid: false, message: 'please enter a billing address' };
        }
        if (!formData.billingCity) {
            validationErrors.billingCity = { isValid: false, message: 'please enter a billing city' };
        }
        if (!formData.billingpincode) {
            validationErrors.billingpincode = { isValid: false, message: 'please enter a pincode' };
        }
        if (!formData.billingState) {
            validationErrors.billingState = { isValid: false, message: 'please enter a billing state' };
        }

        return validationErrors;
    };
    const handleSubmitCompany = async (e) => {
        e.preventDefault();
        const validationErrors = validateFormData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setValidation(prevValidation => ({
                ...prevValidation,
                ...validationErrors
            }));
            return;
        }
    }
    const handleSubmitBusiness = async (e) => {
        e.preventDefault();
        const validationErrors1 = validateFormBusinessData(formData);
        if (Object.keys(validationErrors1).length > 0) {
            setValidation(prevValidation => ({
                ...prevValidation,
                ...validationErrors1
            }));
            return;
        }
    }
    return (
        <div>
            <div className=''>
                <div className='manage-business-buttons-two'>
                    <ul className="nav nav-tabs border-0">
                        <li className="nav-item">
                            <a
                                className="nav-link active"
                                href="#profiletab"
                                data-bs-toggle="tab"
                            >
                                Custemer Details
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#basictab2"
                                data-bs-toggle="tab"
                            >
                                Business Details
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="tab-content ">
                    <div className="tab-pane show active" id="profiletab">
                        <div className="row my-4">
                            {/* <h5 className='editing-company-details-page-h5' ></h5> */}

                            <div className="col-lg-3 col-md-12 col-sm-12">
                                <div className="form-group">
                                    <label class="upload-image-manage-business">
                                        <input type="file" name="" id="" className='' />
                                        <span>
                                            {/* <i className="fe fe-check-square me-2" /> */}
                                            {/* <FeatherIcon icon="image" /> */}
                                            <PiImageSquareThin size={40} />
                                        </span>
                                        <div className='upload-image-manage-business-text'>
                                            <p className='upload-image-manage-business-p'>Upload Image</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label>Business Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${!validation.businessName.isValid ? "is-invalid" : ""}`}
                                        placeholder="Enter Name"
                                        value={formData.businessName}
                                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                                    />
                                    {!validation.businessName.isValid && (
                                        <div className="error-message text-danger">{validation.businessName.message}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label>Company Phone Number</label>
                                    <input
                                        type="text"
                                        className={`form-control ${!validation.companyPhone.isValid ? "is-invalid" : ""}`}
                                        value={formData.companyPhone}
                                        onChange={(e) => handleInputChange("companyPhone", e.target.value)}

                                        placeholder="Enter company phone number"
                                    />
                                    {!validation.companyPhone.isValid && (
                                        <div className="error-message text-danger">{validation.companyPhone.message}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label>Company E-Mail</label>
                                    <input
                                        type="email"
                                        className={`form-control ${!validation.companyEmail.isValid ? "is-invalid" : ""}`}
                                        value={formData.companyEmail}
                                        onChange={(e) => handleInputChange("companyEmail", e.target.value)}
                                        placeholder="Enter Email Address"
                                    />
                                    {!validation.companyEmail.isValid && (
                                        <div className="error-message text-danger">{validation.companyEmail.message}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-6 col-sm-12">
                            <div className="form-group">
                                <label>Billing Address</label>
                                <input
                                    type="text"
                                    className={`form-control ${!validation.billingAddress.isValid ? "is-invalid" : ""}`}
                                    value={formData.billingAddress}
                                    onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                                    placeholder="Enter billing address"
                                />
                                {!validation.billingAddress.isValid && (
                                    <div className="error-message text-danger">{validation.billingAddress.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        className={`form-control ${!validation.billingState.isValid ? "is-invalid" : ""}`}
                                        value={formData.billingState}
                                        onChange={(e) => handleInputChange("billingState", e.target.value)}
                                        placeholder="Enter state"
                                    />
                                    {!validation.billingState.isValid && (
                                        <div className="error-message text-danger">{validation.billingState.message}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input
                                        type="text"
                                        className={`form-control ${!validation.billingpincode.isValid ? "is-invalid" : ""}`}
                                        value={formData.billingpincode}
                                        onChange={(e) => handleInputChange("billingpincode", e.target.value)}
                                        placeholder="Enter pincode"
                                    />
                                    {!validation.billingpincode.isValid && (
                                        <div className="error-message text-danger">{validation.billingpincode.message}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-6 col-sm-12">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    className={`form-control ${!validation.billingCity.isValid ? "is-invalid" : ""}`}
                                    placeholder="Enter city"
                                    value={formData.billingCity}
                                    onChange={(e) => handleInputChange("billingCity", e.target.value)}
                                />
                                {!validation.billingCity.isValid && (
                                    <div className="error-message text-danger">{validation.billingCity.message}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12">

                            <div className="text-end">

                                <button type="submit" className="btn btn-primary mr-1" onClick={handleSubmitCompany}>
                                    
                                </button>

                                <button type="submit" className="btn btn-primary" onClick={handleSubmitCompany}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane" id="basictab2">
                        <div className="row">
                            <h5 className='editing-company-details-page-h5'></h5>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label>Business Type <span className='manage-business-e-invoicing-p'>(Select multiple, if applicable)</span></label>
                                    <Select2 className={`w-100 form-select is-invalid`} data={bgOptions} options={{ placeholder: 'Choose your business type', }}
                                        value={formData.businessType}
                                        onChange={(e) => handleInputChange("businessType", e.target.value)}
                                    />
                                    {!validation.businessType.isValid && (
                                        <div className="error-message text-danger">{validation.businessType.message}</div>
                                    )}                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label>Industry Type</label>
                                    <Select2 data={bgOptions} className={`w-100 form-select is-invalid`}
                                        value={formData.industryType} options={{ placeholder: 'Choose your industry type', }} onChange={(e) => handleInputChange("industryType", e.target.value)} />
                                    {!validation.industryType.isValid && (
                                        <div className="error-message text-danger">{validation.industryType.message}</div>
                                    )}                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-group">
                                    <label>Business Registration Type</label>
                                    <Select2 className={`w-100 form-select is-invalid`} data={brtOptions} options={{ placeholder: 'Choose your business registration type', }}
                                        value={formData.businessRegType}
                                        onChange={(e) => handleInputChange("businessRegType", e.target.value)} />
                                    {!validation.businessRegType.isValid && (
                                        <div className="error-message text-danger">{validation.businessRegType.message}</div>
                                    )}                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="manage-business-note">
                                    <h6>Note:&nbsp;</h6>
                                    <p>Details added below will be shown on your Invoices</p>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group row">
                                    <label>Terms and Conditions</label>
                                    <textarea name="" id="" cols="70" rows="5">
                                        1. Goods once sold will not be taken back or exchanged
                                        2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only
                                    </textarea>
                                </div>
                            </div>

                            <div className="col-12 col-xl mb-3">Signature</div>
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group">
                                    <label class="custom-file-upload">
                                        <input type="file" />
                                        + Add Signature
                                    </label>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12">

                                <div className="text-end">
                                    <button type="submit" className="btn btn-primary mr-1" onClick={handleSubmitBusiness}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" onClick={handleSubmitBusiness}>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
