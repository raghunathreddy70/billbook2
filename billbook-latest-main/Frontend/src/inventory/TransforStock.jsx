import axios from "axios";
import React, { useEffect, useState } from "react";
import Select2 from "react-select2-wrapper";
import { Divider, Input, Select, Space, Button, Modal, Table, DatePicker } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const TransforStock = ({ selectedGodownData, onCancel, selectedProductId, selectedProductopeningStock }) => {
  console.log("selectedGodownData", selectedGodownData)
  const userData = useSelector((state) => state?.user?.userData)

  console.log("selectedProductId", selectedProductId)
  console.log("selectedProductopeningStockin", selectedProductopeningStock)

  const [formData, setFormData] = useState({
    selectedProductId: selectedProductId,
    date: new Date(),
    godown: "",
    godownId: selectedGodownData[0]?.godownId,
    quantity: null,
    godownName: "",
  });
  const [validation, setValidation] = useState({
    date: { isValid: true, message: "" },
    quantity: { isValid: true, message: "" },
    godownName: { isValid: true, message: "" },
  });

  const handleInputchange = (fieldName, value) => {
    const godownRegex = /^[a-zA-Z0-9\s,'.#-]+$/;
    const quantityRegex = /^[0-9]+$/;
    let isValid = true;
    let message = "";
    
    if (fieldName === "date") {
      isValid = value;
      message = "Invalid date";
    } else if (fieldName === "quantity") {
      // Check if the value is a non-negative integer
      if (value === "" || /^\d+$/.test(value)) {
        isValid = true;
        message = "";
      } else {
        isValid = false;
        message = "Invalid Quantity";
      }
    }
  
    // Only update the form data and validation if the value is valid
    if (isValid) {
      setFormData({
        ...formData,
        [fieldName]: value,
      });
    }
  
    // Update the validation message
    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };
  

  const validateFormData = (formData) => {
    const validationErrors = {};
    if (!formData.date) {
      validationErrors.date = {
        isValid: false,
        message: "please enter valid date",
      };
    }
    if (!formData.quantity) {
      validationErrors.quantity = {
        isValid: false,
        message: "please select a quantity",
      };
    }
    if (!formData.godownName) {
      validationErrors.godownName = {
        isValid: false,
        message: "please select a godown name",
      };
    }
    return validationErrors;
  };
  console.log("transfer stock", formData)

  const [godownList, setGodownList] = useState([])

  // const fetchGodownData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/godown/godownlist"
  //     );
  //     setGodownList(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchGodownData();
  // }, []);
  const fetchGodownData = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/godown/godownlist/${userData?.data?._id}`
        );
        setGodownList(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGodownData();
  }, [userData]);

  const GodownOptions = godownList.map((godown) => ({
    id: godown.godownId,
    text: godown.godownName,
  }));

  const handleDateChange = (fieldName, date) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: date
    }));
  }

  useEffect(() => {
    fetchProductData(selectedProductId);
  }, [selectedProductId]);

  useEffect(() => {
    if (godownproduct && godownproduct.Godown) {
      const selectedGodown = godownproduct.Godown.find(
        (godown) => godown.godownId === formData.godown
      );
      setCurrentStock(selectedGodown ? selectedGodown.stock : 0);
    }
  }, [godownproduct, formData.godown]);


  const [godownproduct, setGodownproduct] = useState([]);

  const fetchProductData = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/godown/productsbygodown/${productId}`
      );
      setGodownproduct(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }

    if (formData.quantity <= 0) {
      toast.error("Quantity must be greater than 0", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (formData.godownId === formData.godownName) {
      toast.error("Cannot transfer stock to the same godown", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return; 
    }

    if (formData.quantity > selectedProductopeningStock) {
      toast.error("Cannot transfer more than product stock", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return; 
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8000/api/godown/transforstock`,
        { formData }
      );
  
      console.log("Data updated successfully:", response.data);
  
      if (response.status === 200) {
        toast.success("Product Updated Succesfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  

  useEffect(() => {
    if (selectedGodownData && selectedGodownData.length > 0) {
      const godownName = selectedGodownData[0].godownName;
      setFormData((prevData) => ({
        ...prevData,
        godown: godownName,
      }));
    }
  }, [selectedGodownData]);



  const godownName = selectedGodownData[0].godownName;

  console.log("godownName", godownName)



  return (
    <div className="row">
      <div className="row">
        <div className="col-lg-12 col-md-6 col-sm-12">
          <div className="form-group">
            <label>
              Date<span className="text-danger">*</span>
            </label>
            <div className="cal-icon cal-icon-info">
              <DatePicker
                className="datetimepicker form-control"
                selected={formData.date}
                onChange={(date) => handleDateChange("date", date)}
                dateFormat="dd-MM-yyyy"
                showTimeInput={false}
              />
             
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-6 col-sm-12">
          <div className="mb-3 form-group">
            <label>Transfer From</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Transfer To"
              value={godownName}
              onChange={(e) => handleInputchange("godown", e.target.value)}
            />
          </div>
        </div>

      </div>
      <div className="col-lg-12 col-md-6 col-sm-12">
        <div className="mb-3 form-group">
          <label>Set Quantity <span className="text-danger">*</span></label>
          <input
            type="number"
            className={`form-control ${!validation.quantity.isValid
                ? "is-invalid"
                : ""
              }`}
            id="field-2"
            placeholder="Enter Transfer From"
            value={formData.quantity}
            // min={1}
            onChange={(e) => handleInputchange("quantity", e.target.value)}
          />
          {!validation.quantity.isValid && (
            <div className="error-message text-danger">
              {validation.quantity.message}
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3 form-group">
            <label>Transfer To <span className="text-danger">*</span></label>
            <Select2
              data={GodownOptions}
              className={`form-select w-100 is-invalid`}
              options={{
                placeholder: "Enter state",
              }}
              value={formData.godownName}
              onChange={(e) => handleInputchange("godownName", e.target.value)}
            />
            {!validation.godownName.isValid && (
              <div className="error-message text-danger">
                {validation.godownName.message}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="modal-footer godown-list-modal-footer">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary waves-effect me-2"
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-info waves-effect waves-light"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>

  );
};

export default TransforStock;
