
import axios from 'axios'
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
// import { Divider, Input, Select, Space, Button, Modal, Table } from "antd";
import Select2 from "react-select2-wrapper";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {Modal } from 'antd';
import { backendUrl } from '../backendUrl';
const ExpenseEdit = ({ expenseProductID, onCancel,datasource,setDataSource }) => {
  const [updateExpenseProducts1, setUpdateExpenseProducts1] = useState(false);
  console.log(" edit expenseProductID", expenseProductID)
  // edit update
  const [editexpenseProUpdateid, setEditexpenseProUpdateid] = useState("");
  const editExpenseProductidUpdate = (value) => {
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
    setUpdateExpenseProducts1(true);
    onCancel(false);
    setEditexpenseProUpdateid(value);
  }
  
  const validateFormData = (formData) => {
    const validationErrors = {};
    if (!formData?.itemName) {
      validationErrors.itemName = {
        isdataValid: false,
        message: "please enter a item Name",
      };
    }
    if (!formData.measuringUnit) {
      validationErrors.measuringUnit = false;
      console.error("Please select a party Name");
    }
    if (!formData.purchasePrice) {
      validationErrors.purchasePrice = {
        isValid: false,
        message: "please enter a amount",
      };
    }
    return validationErrors;
  };

  const fetchexpenseProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/exproduct/exproducts`);
      setDataSource(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchexpenseProductData();
  }, []);

  const [validation, setValidation] = useState({
    itemName: { isdataValid: true, message: "" },
    measuringUnit: true,
    purchasePrice: { isdataValid: true, message: "" },
  })


  const [itcapplicableoptions, setitcapplicableoptions] = useState([
    { id: 1, text: "Eligible" },
    { id: 2, text: "Ineligible" },
    { id: 3, text: "Ineligible Others" },
  ]);

  const [formData, setFormData] = useState({
    itemTypeproduct: "",
    purchasePrice: "",
    itemName: "",
    gstTaxRate: "",
    measuringUnit: "",
    HSNcode: "",
    ITCApplicable: "",
  });

  console.log("formData", formData)

  const [measureUnit, setMeasureUnit] = useState([
    { id: "Kilogram", text: "Kilogram" },
    { id: "Gram", text: "Gram" },
    { id: "Milliliter", text: "Milliliter" },
    { id: "piece", text: "piece" },
    { id: "pack", text: "pack" },
    { id: "microgram", text: "microgram" },
    { id: "tonne", text: "tonne" },
  ]);



  const [editingData, setEditingData] = useState(null);
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    const fetchExproductDetails = async (expenseProductID) => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/exproduct/exproducts/${expenseProductID}`
        );
        console.log("response", response.data)
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
      }
    };

    fetchExproductDetails(expenseProductID);
  }, [expenseProductID]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = expenseProductID;
    if (!id) {
      console.error('No data to update.');
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/exproduct/expenseproductedit/${id}`,
        formData
      );

      console.log("expenseProduct:", response.data);
      toast.success("Product Updated successfully.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      fetchexpenseProductData();
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("error in updating the data.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setUpdateExpenseProducts1(false);
    }
  };



  const [gstData, setGstData] = useState([]);

  const fetchGstData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/addgst/gst`);
      setGstData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGstData();
  }, []);


  console.log("gstData", gstData);

  const gstOptions = gstData.map((gst) => ({
    id: gst._id,
    text: gst.gstPercentageName,
  }));

  const handleInputChange = (fieldName, value) => {
    if (value) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        measuringUnit: true,
      }));
    }
    let isdataValid = true;
    let message = "";
    const numberRegex = /^\d+$/;
    if (fieldName === "purchasePrice") {
      isdataValid = numberRegex.test(value);
      message = "Invalid purchasePrice";
    }
    setValidation({
      ...validation,
      [fieldName]: { isdataValid, message },
    });
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const [serviceFilter, setServiceFilter] = useState(false);

  const changeHandle = (fieldName, value) => {
    const withoutTaxRegex = /^[a-zA-Z\s]*$/;
    let isdataValid = true;
    let message = "";
    if (fieldName === "itemName") {
      isdataValid = withoutTaxRegex.test(value);
      message = "Invalid value";
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isdataValid, message },
    });

  };

  return (
    <div className="ant-modal-content-addexpense-child">
      <form onSubmit={handleSubmit}>
        <div className="row my-3">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>
                Item Name{" "}
                <span className="accountprofilesettings-start-mark">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${!validation?.itemName?.isdataValid ? "is-invalid" : ""}`}
                placeholder="item name"
                value={formData?.itemName}
                onChange={(e) => changeHandle("itemName", e.target.value)}
              />
              {!validation.itemName.isdataValid && (
                <div className="error-message text-danger">
                  {validation.itemName.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>
                Item Type{" "}
                <span className="accountprofilesettings-start-mark">*</span>
              </label>
              <div className="">
                <label className="custom_radio me-3">
                  <input
                    type="radio"
                    // name="payment"
                    defaultChecked="true"
                    onClick={() => setServiceFilter()}
                    // value={formData.itemTypeproduct}
                    onChange={(e) =>
                      handleInputChange("itemTypeproduct", e.target.value)
                    }
                  />
                  <span className="checkmark" /> Product
                </label>
                <label className="custom_radio">
                  <input
                    type="radio"
                    name="payment"
                    onClick={() => setServiceFilter(!serviceFilter)}
                  />
                  <span className="checkmark" /> Service
                </label>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>Purchase Price</label>
              <input
                type="text"
                className={`form-control ${!validation.purchasePrice.isdataValid ? "is-invalid" : ""
                  }`}
                // addonAfter={selectAfter}
                // defaultValue="0"
                // className="form-control"
                value={formData.purchasePrice}
                onChange={(e) =>
                  handleInputChange("purchasePrice", e.target.value)
                }
              />
              {!validation.purchasePrice.isdataValid && (
                <div className="error-message text-danger">
                  {validation.purchasePrice.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>Measuring Unit</label>
              <Select2
                className={`form-select is-invalid w-100`}
                data={measureUnit}
                options={{
                  placeholder: "None",
                }}
                value={formData.measuringUnit}
                onChange={(e) =>
                  handleInputChange("measuringUnit", e.target.value)
                }
              />
              {!validation?.measuringUnit && (
                <p className="error-message text-danger">
                  Please select a measuringUnit
                </p>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>HSN</label>
              <input
                type="text"
                className="form-control"
                placeholder="18189"
                value={formData.HSNcode}
                onChange={(e) =>
                  handleInputChange("HSNcode", e.target.value)
                }
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>GST Tax Rate(%)</label>
              <Select2
                className="w-100"
                data={gstOptions}
                options={{
                  placeholder: "None",
                }}
                value={formData.gstTaxRate}
                onChange={(e) =>
                  handleInputChange("gstTaxRate", e.target.value)
                }
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>ITC Applicable</label>
              <Select2
                className="w-100"
                data={itcapplicableoptions}
                options={{
                  placeholder: "None",
                }}
                value={formData.ITCApplicable}
                onChange={(e) =>
                  handleInputChange("ITCApplicable", e.target.value)
                }
              />
            </div>
          </div>

        </div>
      </form>
      <div className='d-flex align-item-center justify-end'>
        <button
          // type="submit"
          className="btn btn-info waves-effect waves-light me-2"
          onClick={editExpenseProductidUpdate}
        >
          Save changes
        </button>

        <button
          // type="submit"
          className="btn btn-secondary waves-effect me-2"
        >
          Cancel
        </button>
      </div>

      <Modal
        closable={false}
        onCancel={() => setUpdateExpenseProducts1(false)}
        open={updateExpenseProducts1}
        footer={null}
      >
        <div className="row">
          <div className="form-header">
            <h3 className="update-popup-buttons">Update Expenses Products</h3>
            <p>Are you sure want to update?</p>
          </div>
          <div className="modal-btn delete-action">
            <div className="row">
              <div className="col-6">
                <button
                  type="reset"
                  className="w-100 btn btn-primary paid-continue-btn"
                  onClick={() => handleSubmit(editexpenseProUpdateid)}
                >
                  Update
                </button>
              </div>
              <div className="col-6">
                <button
                  type="submit"
                  onClick={() => setUpdateExpenseProducts1(false)}
                  className="w-100 btn btn-primary paid-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

    </div>
    
  )
}

export default ExpenseEdit