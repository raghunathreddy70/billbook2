import { Button } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select2 from "react-select2-wrapper";
import { toast } from "react-toastify";

const AdjustStockModal = ({ productid, onCancel }) => {
  const userData = useSelector((state) => state?.user?.userData)
  const [productData, setProductData] = useState({});
  const [formData, setFormData] = useState({
    productID: productid,
   
    addcount: "Add",
    godown: "",
    quantity: 0,
    remarks: "",
  });

  console.log("formData", formData)

  const [categoryData, setCategoryData] = useState([]);
  const [currentStock, setCurrentStock] = useState(0);

  useEffect(() => {
    fetchProductData(productid);
    fetchCategoryData();
  }, [productid]);

  useEffect(() => {
    if (productData && productData.Godown) {
      const selectedGodown = productData.Godown.find(
        (godown) => godown.godownId === formData.godown
      );
      setCurrentStock(selectedGodown ? selectedGodown.stock : 0);
    }
  }, [productData, formData.godown]);

  const fetchProductData = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/addProduct/productsbyid/${productId}`
      );
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      if (userData?.data?._id) {
      const response = await axios.get(
        `http://localhost:8000/api/godown/godownlist/${userData?.data?._id}`
      );
      setCategoryData(response.data);
    }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const decrementCount = () => {
      setFormData({
        ...formData,
        addcount: "Reduce",
      });
    
  };

  const incrementCount = () => {
    setFormData({
      ...formData,
      addcount: "Add",
    });
  };

  const handleInputchange = async (fieldName, value) => {

    if (fieldName === "quantity") {
      value = parseInt(value);
    }

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const calculateFinalStock = () => {
    if (productData && formData.quantity !== null) {
      if (currentStock === 0) {
        return parseInt(formData.quantity);
      } else {
        return currentStock + parseInt(formData.quantity);
        
      }
    }
    return "";
  };

  const categoryOptions =
    categoryData &&
    categoryData.map((cat) => ({
      id: cat.godownId,
      text: cat.godownName,
    }));

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8000/api/addProduct/adjuststock/${productid}`,
        formData
      );

      console.log("Data updated successfully:", response.data);

      if(response.status === 200) {
        toast.success("Product Updated Succesfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        window.location.reload();
      }

    } catch (error) {
      console.error("Error updating data:", error);

      toast.success("Error updating data", {
        position: toast.POSITION.TOP_RIGHT,
      });
     
    }
  };



  return (
    <div className="row">
      <div className="col-lg-12 col-md-6 col-sm-12 mb-1">
        <div className="form-group manage-business-enable-tds">
          <div>
            <label>Item Name</label>
            {productData && (
              <p className="manage-business-e-invoicing-p">
                {productData.itemName}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <label>Add Or Reduce Stock</label>
          <div>
            <label className="custom_radio me-3">
              <input
                type="radio"
                name="payment"
                defaultChecked="true"
                onClick={incrementCount}
              />
              <span className="checkmark" /> Add(+)
            </label>
            <label className="custom_radio">
              <input type="radio" name="payment" onClick={decrementCount} />
              <span className="checkmark" /> Reduce(-)
            </label>
          </div>
        </div>
      </div>
      <div className="col-lg-12 col-md-6 col-sm-12">
        <div className="form-group">
          <label>Godown</label>
          <Select2
            className="w-100"
            data={categoryOptions}
            options={{
              placeholder: "None",
            }}
            value={formData.godown}
            onChange={(e) => handleInputchange("godown", e.target.value)}
          />
        </div>
      </div>
      <div className="col-lg-12 col-md-6 col-sm-12 mb-3">
        <div className="form-group manage-business-enable-tds">
          <div>
            <p>Current Stock Level</p>
            {productData?.Godown && (
              <p className="manage-business-e-invoicing-p">{currentStock}</p>
            )}
          </div>
        </div>
      </div>
      <div className="col-lg-12 col-md-6 col-sm-12">
        <div className="form-group">
          <label>Adjust quantity</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              placeholder="0"
              aria-describedby="basic-addon2"
              value={formData.quantity}
              onChange={(e) => handleInputchange("quantity", e.target.value)}
            />
            <span className="input-group-text blue-text" id="basic-addon2">
              PCS
            </span>
          </div>
        </div>
      </div>
      <div className="col-lg-12 col-md-6 col-sm-12 mb-3">
        <div className="form-group manage-business-enable-tds">
          <div>
            {formData.quantity && (
              <>
                <p>Final Stocks</p>
                <p className="manage-business-e-invoicing-p">
                  {calculateFinalStock()}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="form-group">
          <label>
            Remarks{" "}
            <span className="manage-business-e-invoicing-p">(optional)</span>
          </label>
          <div class="form-floating">
            <textarea
              class="form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea"
              value={formData.remarks}
              onChange={(e) => handleInputchange("remarks", e.target.value)}
            ></textarea>
            <label for="floatingTextarea">Comments</label>
          </div>
        </div>
      </div>
      <div className="modal-footer">
          {/* <Button onClick={handlecloseadjuststock} className="btn btn-secondary waves-effect me-2">
            Cancel
          </Button> */}
          <Button onClick={handleUpdate} type="primary" className="btn btn-info waves-effect waves-light primary-button">
            Update
          </Button>
        </div>
    </div>
  );
};

export default AdjustStockModal;
