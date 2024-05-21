
import axios from 'axios'
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
// import { Divider, Input, Select, Space, Button, Modal, Table } from "antd";
import Select2 from "react-select2-wrapper";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { backendUrl } from '../backendUrl';

const ExpenseAdd = ({onCancel,datasource,setDataSource}) => {

  // const selectAfter = (
  //     <Select defaultValue="without tax">
  //       <Option value="withtax">with tax</Option>
  //       <Option value="withouttax">without tax</Option>
  //     </Select>
  //   );

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
        isdataValid: false,
        message: "please enter a amount",
      };
    }
    return validationErrors;
  };

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
    gstTaxRate: "",
    HSNcode: "",
    ITCApplicable: "",
  });
  const [validation, setValidation] = useState({
    itemName: { isdataValid: true, message: "" },
    measuringUnit: true,
    purchasePrice: { isdataValid: true, message: "" },
  })
  const [measureUnit, setMeasureUnit] = useState([
    { id: "Kilogram", text: "Kilogram" },
    { id: "Gram", text: "Gram" },
    { id: "Milliliter", text: "Milliliter" },
    { id: "piece", text: "piece" },
    { id: "pack", text: "pack" },
    { id: "microgram", text: "microgram" },
    { id: "tonne", text: "tonne" },
  ]);

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
    onCancel(false);
    try {
      const response = await axios.post(
        `${backendUrl}/api/exproduct/expenseproducts`,
        formData
      );
      console.log("expenseProduct:", response.data);
      toast.success("Product Added successfully.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      fetchexpenseProductData();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("error submitting the data", {
        position: toast.POSITION.TOP_RIGHT,
      });
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
//expense added

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
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setValidation({
      ...validation,
      [fieldName]: { isdataValid, message },
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
      <form >
        <div className="row my-3">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="form-group">
              <label>
                Item Name{" "}
                <span className="accountprofilesettings-start-mark">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${!validation.itemName.isdataValid ? "is-invalid" : ""
                  }`}
                placeholder="item name"
                value={formData.itemName}
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
          {/* <div className="col-lg-6 col-md-6 col-sm-12">
        <form onSubmit={handleSubmit}>
          <div className="text-end">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>  
      </div> */}
        </div>
      </form>

        <div className="d-flex align-item-center justify-end">
          <button type="submit" className="btn btn-secondary waves-effect me-2" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-info waves-effect waves-light me-2" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>

  )
}

export default ExpenseAdd