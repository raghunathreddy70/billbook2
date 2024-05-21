import React from 'react'
import BackButton from '../Cards/BackButton';
import useFormHandler from '../customeHooks/useFormHandler';
import Select2 from "react-select2-wrapper";
import { DatePicker } from 'antd';

const InvoiceForm = ({ title, isGstEnabled, handleGstToggle, formData, setFormData, customeroptions, validation, openCustomerDetailsModal, isCustomerDetailsModalOpen, closeCustomerDetailsModal }) => {

    const { getNextInvoiceNumber, handleCustomerChange, handleDateChange } = useFormHandler();

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                <div className="page-header">
                    <div className="content-page-header justify-normal space-x-2">
                        <BackButton />
                        <h5>Add Invoice</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="form-group-item border-0 mb-0">
                                    <div className="row align-item-center">
                                        <div className="col-lg-12 col-md-6 col-sm-12">
                                            <div className="form-group manage-business-enable-tds">
                                                <label htmlFor="gst_toggle">With GST</label>
                                                <span>
                                                    <label className="switch">
                                                        <input
                                                            type="checkbox"
                                                            id="gst_toggle"
                                                            checked={isGstEnabled}
                                                            onChange={handleGstToggle}
                                                        />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className="form-group">
                                                <label>Invoice Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter First Name"
                                                    value={
                                                        formData.invoiceNumber || getNextInvoiceNumber({ datasource })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className="form-group">
                                                <label>
                                                    Customer Name
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <ul className="form-group-plus css-equal-heights">
                                                    <li>
                                                        <Select2
                                                            data={customeroptions}
                                                            options={{
                                                                placeholder: "Choose Customer",
                                                            }}
                                                            className={`form-select is-invalid`}
                                                            value={formData?.customerName}
                                                            onChange={(e) =>
                                                                handleCustomerChange({ fieldName: "customerName", setFormData, setValidation, value: e.target.value })
                                                            }
                                                        />
                                                        {!validation.customerName && (
                                                            <p className="error-message text-danger">
                                                                Please select a customer
                                                            </p>
                                                        )}
                                                    </li>

                                                    <li>
                                                        <Link
                                                            to="#"
                                                            className="btn btn-primary form-plus-btn"
                                                            onClick={openCustomerDetailsModal}
                                                        >
                                                            <FeatherIcon icon="plus-circle" />
                                                        </Link>
                                                        <Modal
                                                            className="add-invoice-add-customer-page"
                                                            title="Add Customer"
                                                            open={isCustomerDetailsModalOpen}
                                                            onCancel={closeCustomerDetailsModal}
                                                            footer={null}
                                                        >
                                                            <CustomerAddInvoiceModal
                                                                onCancel={closeCustomerDetailsModal}
                                                            />
                                                        </Modal>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className="form-group">
                                                <label>Invoice Date</label>
                                                <div className="cal-icon cal-icon-info">
                                                    <DatePicker
                                                        // className=" form-control"
                                                        className="datetimepicker form-control "
                                                        selected={formData.invoiceDate}
                                                        onChange={(date) =>
                                                            handleDateChange({ fieldName: "invoiceDate", date, formData, setFormData })
                                                        }
                                                        dateFormat="dd-MM-yyyy"
                                                        showTimeInput={false}
                                                    ></DatePicker>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className="form-group">
                                                <label>
                                                    Due Date<span className="text-danger">*</span>
                                                </label>
                                                <div className="cal-icon cal-icon-info">
                                                    <DatePicker
                                                        className={`datetimepicker form-control`}
                                                        selected={formData.dueDate}
                                                        onChange={(date) =>
                                                            handleDateChange({ fieldName: "dueDate", date, formData, setFormData })
                                                        }
                                                        dateFormat="dd-MM-yyyy"
                                                        showTimeInput={false}
                                                    ></DatePicker>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className="form-group">
                                                <label>
                                                    Reference No{" "}
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className={`form-control ${!validation.referenceNo ? "is-invalid" : ""
                                                        }`}
                                                    placeholder="Enter Phone Number"
                                                    value={formData.referenceNo}
                                                    onChange={(e) =>
                                                        handleInputChange("referenceNo", e.target.value)
                                                    }
                                                />
                                                {!validation.referenceNo && (
                                                    <div className="error-message text-danger">
                                                        please enter reference number
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className="form-group position-relative">
                                                <label>Payment Terms</label>
                                                <div className="input-group input-group-sm mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        aria-label="Sizing example input"
                                                        aria-describedby="inputGroup-sizing-sm"
                                                        value={formData.paymentTerms}
                                                        onChange={(e) =>
                                                            handlePaymentTermsChange(e.target.value)
                                                        }
                                                    />
                                                    <span
                                                        className="input-group-text"
                                                        id="inputGroup-sizing-sm"
                                                    >
                                                        days
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-12">
                                            <div className="form-group">
                                                <label>
                                                    Website <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${!validation.website.isValid ? "is-invalid" : ""
                                                        }`}
                                                    placeholder="Enter Website Address"
                                                    value={formData.website}
                                                    onChange={(e) =>
                                                        handlewebsiteChange("website", e.target.value)
                                                    }
                                                />
                                                {!validation.website.isValid && (
                                                    <div className="error-message text-danger">
                                                        {validation.website.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-item">
                                    <div className="card-table">
                                        <div className="card-body add-invoice">
                                            <div className="table-responsive">
                                                <table className="table table-center table-hover datatable">
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th>Product / Service</th>
                                                            <th>Price</th>
                                                            <th>Quantity</th>
                                                            <th>Discount</th>
                                                            {isGstEnabled && <th>Tax</th>}
                                                            <th>Amount</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    {formData.table.length > 0 && (
                                                        <tbody>
                                                            {formData.table.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{item.productName}</td>
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            name="re_invoice"
                                                                            value={item.price}
                                                                            className="form-control form-control-sm"
                                                                            style={{
                                                                                width: "130px",
                                                                                borderStyle: "dotted",
                                                                                borderWidth: "2px",
                                                                            }}
                                                                            onChange={(e) =>
                                                                                handleInputChange(
                                                                                    "price",
                                                                                    e.target.value,
                                                                                    index
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            name="re_invoice"
                                                                            value={item.quantity}
                                                                            className="form-control form-control-sm"
                                                                            style={{
                                                                                width: "130px",
                                                                                borderStyle: "dotted",
                                                                                borderWidth: "2px",
                                                                            }}
                                                                            onChange={(e) =>
                                                                                handleQuantityChange(
                                                                                    e,
                                                                                    index,
                                                                                    "quantity"
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            name="re_invoice"
                                                                            value={item.discount || ""}
                                                                            className="form-control form-control-sm"
                                                                            style={{
                                                                                width: "130px",
                                                                                borderStyle: "dotted",
                                                                                borderWidth: "2px",
                                                                            }}
                                                                            onChange={(e) =>
                                                                                handleDiscountChange(e, index)
                                                                            }
                                                                        />
                                                                    </td>
                                                                    {isGstEnabled && (
                                                                        <td>
                                                                            <select
                                                                                value={item.gstRate}
                                                                                onChange={(e) =>
                                                                                    handleGstRateChange(e, index)
                                                                                }
                                                                                className="form-control form-control-sm"
                                                                                style={{
                                                                                    width: "130px",
                                                                                    borderStyle: "dotted",
                                                                                    borderWidth: "2px",
                                                                                }}
                                                                            >
                                                                                {gstData.map((rate) => (
                                                                                    <option
                                                                                        key={rate._id}
                                                                                        value={rate.gstPercentageValue}
                                                                                    >
                                                                                        {rate.gstPercentageName}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </td>
                                                                    )}
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            name="re_invoice"
                                                                            value={item.totalAmount}
                                                                            className="form-control form-control-sm"
                                                                            style={{
                                                                                width: "130px",
                                                                                borderStyle: "dotted",
                                                                                borderWidth: "2px",
                                                                            }}
                                                                            onChange={(e) =>
                                                                                handleChangeTableField(
                                                                                    index,
                                                                                    "totalAmount",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>

                                                                    <td className="d-flex align-items-center">
                                                                        <button
                                                                            className="text-danger-light1"
                                                                            onClick={() =>
                                                                                handleDeleteItem(index)
                                                                            }
                                                                        >
                                                                            <span>
                                                                                <i class="fa-solid fa-trash-can"></i>
                                                                            </span>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    )}
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12">
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-12">
                                            <div className="form-group-bank">
                                                <div className="form-group">
                                                    <label>
                                                        Select Products{" "}
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="bank-3">
                                                        <Link
                                                            to="#"
                                                            style={{
                                                                display: "block",
                                                                border: "2px dotted",
                                                                width: "200%",
                                                                padding: "10px",
                                                                textDecoration: "none",
                                                            }}
                                                            onClick={() => {
                                                                showProductModal();
                                                            }}
                                                        >
                                                            <center>Select Products</center>
                                                        </Link>
                                                        {validation.productsSelected &&
                                                            !productsSelected && (
                                                                <div className="error-message text-danger mt-3 pt-2">
                                                                    {validation.productsSelected.message}
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-item border-0 p-0">
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-12">
                                            <div className="form-group-bank">
                                                <div className="form-group">
                                                    {/* <label>Select Bank</label> */}
                                                    <div className="bank-3">
                                                        <Link
                                                            className="text-danger-light"
                                                            to="#"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#bank_details"
                                                            onChange={(e) =>
                                                                handleBankChange("website", e.target.value)
                                                            }
                                                            onClick={() => setBankSelected(true)} // Set bankSelected to true when the link is clicked
                                                        >
                                                            <i className="fas fa-bank me-2" />
                                                            Select Bank
                                                        </Link>
                                                    </div>
                                                    {/* Add the error message for bank selection */}
                                                    {validation.bankSelected && !bankSelected && (
                                                        <div className="error-message text-danger mt-3 pt-2">
                                                            {validation.bankSelected.message}
                                                        </div>
                                                    )}
                                                    {selectedAccount && (
                                                        <div className="add-bank-details mt-3">
                                                            <h6>Account Details</h6>
                                                            <p>
                                                                <span>Bank Account Number: </span>
                                                                {selectedAccount.bankAccountNumber}
                                                            </p>
                                                            <p>
                                                                <span>IFSC Code: </span>
                                                                {selectedAccount.IFSCCode}
                                                            </p>
                                                            <p>
                                                                <span>Branch Name: </span>
                                                                {selectedAccount.branchName}
                                                            </p>
                                                            <p>
                                                                <span>Account Holder's Name: </span>
                                                                {selectedAccount.accountHoldersName}
                                                            </p>
                                                            <p>
                                                                <span>UPI ID: </span>
                                                                {selectedAccount.UPIID}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="form-group notes-form-group-info">
                                                    <label>Notes</label>
                                                    <textarea
                                                        className="form-control"
                                                        placeholder="Enter Notes"
                                                        value={formData.bankDetails.notes}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                bankDetails: {
                                                                    ...formData.bankDetails,
                                                                    notes: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group notes-form-group-info mb-0">
                                                    <label>Terms and Conditions</label>
                                                    <textarea
                                                        className="form-control"
                                                        placeholder="Enter Terms and Conditions"
                                                        value={formData.bankDetails.termsAndConditions}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                bankDetails: {
                                                                    ...formData.bankDetails,
                                                                    termsAndConditions: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-12">
                                            <div className="form-group-bank">
                                                <div className="row">
                                                    <div className="col-lg-4 col-md-12">
                                                        <div>
                                                            {showInput && (
                                                                <input
                                                                    type="text"
                                                                    placeholder=""
                                                                    value={
                                                                        formData.bankDetails.additionalCharges
                                                                    }
                                                                    onChange={(e) =>
                                                                        setFormData({
                                                                            ...formData,
                                                                            bankDetails: {
                                                                                ...formData.bankDetails,
                                                                                additionalCharges: e.target.value,
                                                                            },
                                                                        })
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="invoice-total-box">
                                                    <div className="invoice-total-inner">
                                                        <div className="status-toggle justify-content-between"></div>
                                                    </div>
                                                    {productsAdded && (
                                                        <div className="invoice-total-footer">
                                                            <h4>
                                                                Taxable Amount{" "}
                                                                <span>{taxableAmount.toFixed(2)}</span>
                                                            </h4>
                                                            <h4>
                                                                Total Discount ({totalDiscountPercentage}%){" "}
                                                                <span>{totalDiscount.toFixed(2)}</span>
                                                            </h4>
                                                            {isGstEnabled && (
                                                                <>
                                                                    <h4>
                                                                        Total Tax ({totalTaxPercentage}%){" "}
                                                                        <span>
                                                                            {isGstEnabled
                                                                                ? totalTax.toFixed(2)
                                                                                : "Exemption"}
                                                                        </span>
                                                                    </h4>

                                                                    <h4>
                                                                        CGST ({cgstTaxPercentage}%){" "}
                                                                        <span>{cgstTaxAmount.toFixed(2)}</span>
                                                                    </h4>
                                                                    <h4>
                                                                        SGST ({sgstTaxPercentage}%){" "}
                                                                        <span>{sgstTaxAmount.toFixed(2)}</span>
                                                                    </h4>
                                                                </>
                                                            )}
                                                            <h4>
                                                                Grand Total(INR){" "}
                                                                <span>{totalAmount.toFixed(2)}</span>
                                                            </h4>
                                                            {selectedCitys && (
                                                                <div>
                                                                    <h4>
                                                                        Currency ({selectedCurrency}){" "}
                                                                        <span>
                                                                            {grandTotalInSelectedCurrency}
                                                                        </span>
                                                                    </h4>
                                                                </div>
                                                            )}
                                                            <Button type="primary" className="primary-button" onClick={showModal}>
                                                                Select Currency
                                                            </Button>
                                                            <Modal
                                                                title="Select Currency"
                                                                open={isModalVisible}
                                                                onOk={handleOk}
                                                                onCancel={handleCancel}
                                                            >
                                                                <div className="row">
                                                                    <div className="col-lg-12 col-md-12 mt-4">
                                                                        <div className="form-group add-invoice-select-div">
                                                                            <label>Select a city:</label>
                                                                            <Select
                                                                                className="add-invoice-select"
                                                                                style={{ width: "100%" }}
                                                                                value={selectedCitys}
                                                                                onChange={handleCitysChange}
                                                                            >
                                                                                {currencyData.map((city) => (
                                                                                    <Option
                                                                                        key={city._id}
                                                                                        value={city.cityName}
                                                                                    >
                                                                                        {city.cityName}
                                                                                    </Option>
                                                                                ))}
                                                                            </Select>
                                                                            {/* <Select2
                                            className="add-invoice-select"
                                            style={{ width: "100%" }}
                                            defaultValue={selectedCitys} // Use defaultValue instead of value
                                            onSelect={handleCitysChange} // Use onSelect instead of onChange
                                            data={currencyData.map(city => ({ text: city.cityName, id: city._id }))} // Transform your data into Select2 format
                                          /> */}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12 col-md-12">
                                                                        <div className="form-group">
                                                                            <label>Currency:</label>
                                                                            <Input
                                                                                className="form-control"
                                                                                value={selectedCurrency}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12 col-md-12">
                                                                        <div className="form-group">
                                                                            <label>Currency Value:</label>
                                                                            <Input.TextArea
                                                                                className="form-control"
                                                                                value={currencyValue}
                                                                                onChange={
                                                                                    handleEditableCurrencyChange
                                                                                }
                                                                                autoSize={{
                                                                                    minRows: 2,
                                                                                    maxRows: 6,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Modal>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label>Signature Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Signature Name"
                                                        value={formData.bankDetails.signatureName}
                                                        onChange={(e) =>
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                bankDetails: {
                                                                    ...prevData.bankDetails,
                                                                    signatureName: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group mb-0">
                                                    <label>Signature Image</label>
                                                    <div className="form-group service-upload service-upload-info mb-0">
                                                        <span>
                                                            <FeatherIcon
                                                                icon="upload-cloud"
                                                                className="me-1"
                                                            />
                                                            Upload Signature
                                                        </span>
                                                        <input
                                                            type="file"
                                                            multiple=""
                                                            id="image_sign"
                                                            onChange={handleFileChange}
                                                        />
                                                        <div id="frames" />
                                                    </div>
                                                    {formData.bankDetails.signatureImage && (
                                                        <img
                                                            src={formData.bankDetails.signatureImage}
                                                            alt="Signature"
                                                            className="uploaded-signature"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="add-customer-btns text-end">
                                    <button
                                        type="reset"
                                        className="btn btn-primary cancel me-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                    >
                                        Submit
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

export default InvoiceForm