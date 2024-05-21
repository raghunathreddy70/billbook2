import { Button, Modal } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Select2 from "react-select2-wrapper";
import { toast } from "react-toastify";
import { backendUrl } from "../backendUrl";
import { useDispatch, useSelector } from "react-redux";
import { VerifyUser } from "../reducers/userReducer";

const CreateNewBusiness = ({
  open,
  onCancel,
  fetchBusinessDetails,
  businessCards,
}) => {
  
  const userData = useSelector((state) => state?.user?.userData);
  const [brtOptions, setbrtOptions] = useState([
    { id: "Public limited company", text: "Public limited company" },
    { id: "Partnership firm", text: "Partnership firm" },
    { id: "One Person Company", text: "One Person Company" },
    { id: "Business not registered", text: "Business not registered" },
    { id: "Services", text: "Services" },
  ]);
  const [industryOptions, setIndustryOptions] = useState([
    { id: "Agriculture", text: "Agriculture" },
    { id: "Automobile", text: "Automobile" },
    { id: "Battery", text: "Battery" },
    { id: "Electronics", text: "Electronics" },
    { id: "Engineering", text: "Engineering" },
    { id: "Electrical Work", text: "Electrical Work" },
    { id: "Education", text: "Education" },
    { id: "Fitness", text: "Fitness" },
    { id: "Footwear", text: "Footwear" },
    { id: "Fruits and Vegetables", text: "Fruits and Vegetables" },
  ]);
  const [bgOptions, setbgOptions] = useState([
    { id: "Retailer", text: "Retailer" },
    { id: "Wholesale", text: "Wholesaler" },
    { id: "Distributor", text: "Distributor" },
    { id: "Manufacturer", text: "Manufacturer" },
    { id: "Services", text: "Services" },
  ]);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "",
    country: "",
    state: "",
    pincode: "",
    city: "",
    gstNumber: "",
    PANNumber: "",
    businessType: "",
    industryType: "",
    registrationType: "",
    termsConditions: "",
    signatureImage: null,
    profileImage: null,
  });

  const handleInputForm = (fieldName, value) => {
    console.log("fieldName", fieldName);
    console.log("value", value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDataMain = { ...userData.data };
    delete userDataMain?.profileImage;
    delete userDataMain?.signatureImage;
    delete userDataMain?.roleAccess;
    delete userDataMain?.adminId;
    delete userDataMain?.TotalRevenue;
    delete userDataMain?.userId;
    delete userDataMain?._id;
    delete userDataMain?.businessType;
    delete userDataMain?.industryType;
    delete userDataMain?.registrationType;
    delete userDataMain?.termsConditions;
    delete userDataMain?.signatureImage;
    delete userDataMain?.profileImage;
    delete userDataMain?.businessName;

    delete formData._id;

    const formDataMain = { ...formData, ...userDataMain };

    console.log("formDataMain", formDataMain);

    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/businessCreate`,
        formDataMain
      );
      console.log("Business created successfully:",response.data );


      function setLocalStorage(data) {
        try {
          localStorage.setItem("currentBusiness_billBook", JSON.stringify(data));
        } catch (error) {
          localStorage.clear();
          setLocalStorage(data);
        }
      }
      
      await setLocalStorage(response.data.newBID);

      dispatch(VerifyUser());
      toast.success("Business created successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      fetchBusinessDetails();
      onCancel(false);
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("Failed to create business!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  return (
    <Modal
      title="Create Business"
      centered
      open={open}
      onOk={() => setOpen4(false)}
      onCancel={onCancel}
      width={750}
      className="manageBusiness-settings-page-modal"
      style={{ borderRadius: "30px" }}
      footer={[
        <Button
          key="back"
          className="btn btn-secondary waves-effect"
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="btn btn-info waves-effect waves-light"
          onClick={handleSubmit}
        >
          Create
        </Button>,
      ]}
    >
      <div className="row mt-4">
        <div className="col-md-6 col-sm-12">
          <div className="form-group">
            <label>Business Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={formData?.businessName}
              onChange={(e) => handleInputForm("businessName", e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6 col-sm-12">
          <div className="form-group">
            <label>
              Business Type{" "}
              <span className="manage-business-e-invoicing-p">
                (Select multiple, if applicable)
              </span>
            </label>
            <Select2
              className="w-100"
              data={bgOptions}
              options={{ placeholder: "Choose your business type" }}
              value={formData?.businessType}
              onChange={(e) => {
                console.log("valueeeee", e.target.value);
                handleInputForm("businessType", e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="form-group">
            <label>Industry Type</label>
            <Select2
              className="w-100"
              data={industryOptions}
              options={{ placeholder: "Choose your industry type" }}
              value={formData?.industryType}
              onChange={(e) => handleInputForm("industryType", e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="form-group">
            <label>Incorporation Type</label>
            <Select2
              className="w-100"
              data={brtOptions}
              options={{
                placeholder: "Choose your business registration type",
              }}
              value={formData?.registrationType}
              onChange={(e) =>
                handleInputForm("registrationType", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default CreateNewBusiness;
