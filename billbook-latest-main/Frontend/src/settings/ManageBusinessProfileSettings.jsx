import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PiImageSquareThin } from "react-icons/pi";
import Select2 from "react-select2-wrapper";
import { useDispatch } from "react-redux";
import { FaStore } from "react-icons/fa6";
import { RiComputerFill } from "react-icons/ri";
import { Button, Image, Modal, Space, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { backendUrl } from "../backendUrl";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { useSelector } from "react-redux";
import CreateNewBusiness from "./CreateNewBusiness";
import { VerifyUser } from "../reducers/userReducer";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ManageBusinessProfileSettings = () => {
  const [deleteUpdateSettings1, setDeleteUpdateSettings1] = useState(false);

  const dispatch = useDispatch();

  const history = useHistory();

  const [open4, setOpen4] = useState(false);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  const [bgOptions, setbgOptions] = useState([
    { id: "Retailer", text: "Retailer" },
    { id: "Wholesale", text: "Wholesaler" },
    { id: "Distributor", text: "Distributor" },
    { id: "Manufacturer", text: "Manufacturer" },
    { id: "Services", text: "Services" },
  ]);
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
  const [isGSTRegistered, setIsGSTRegistered] = useState(true);

  const handleRadioChange = (event) => {
    setIsGSTRegistered(event.target.value === "yes");
  };

  const [previewOpen, setPreviewOpen] = useState(true);
  const [fileList, setFileList] = useState([]);

  const [formData, setFormData] = useState({
    _id: "",
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
    TotalRevenue: 0,
  });

  const handleInputForm = (fieldName, value) => {
    console.log("fieldName", fieldName);
    console.log("value", value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImage(reader.result);
      setFormData({ ...formData, profileImage: reader.result });
      // setFileList()
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const userData = useSelector((state) => state?.user?.userData);

  console.log("userData", userData);

  useEffect(() => {
    setFormData(userData?.data);
  }, [userData]);

  const handleFile1Change = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.onloadend = () => {
        const base64Img = reader.result;
        setSignatureImage(base64Img);
      };

      console.log("reader.readAsDataURL(file)", file);
      reader.readAsDataURL(file);
    }
  };

  const handledropdownChange = (fieldName, value, index) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const [businessCards, setBusinessCards] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

  const fetchBusinessDetails = async () => {
    try {
      dispatch(VerifyUser());

      if (userData) {
        setFormData(userData.data);
        setUploadedImage(userData.data.profileImage.url);
        setSignatureImage(userData.data.signatureImage.url);
      } else {
        console.error("Failed ");
      }
    } catch (error) {
      console.error("Error fetching business details", error);
    }
  };

  useEffect(() => {
    fetchBusinessDetails();
  }, []);

  const handleBusiness = (e) => {
    console.log("e.target.id", e.target.id);

    function setLocalStorage(data) {
      try {
        localStorage.setItem("currentBusiness_billBook", JSON.stringify(data));
      } catch (error) {
        localStorage.clear();
        setLocalStorage(data);
      }
    }

    setLocalStorage(e.target.id);

    dispatch(VerifyUser());
    window.scrollTo(0, 0);

    history.push("/index");
  };

  const handleDelete = async (e) => {
    try {
      console.log("this is ", e.target.id);
      const deleteBusiness = await axios.delete(
        `${backendUrl}/api/admin/deleteBusiness`,
        { data: formData }
      );
      fetchBusinessDetails();
    } catch (error) {
      console.error("Error deleting business:", error);
    } finally {
      setDeleteUpdateSettings1(false);
    }
  };

  const handleUpdateBusiness = async (e, id) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/admin/updateBusiness/${id}`,
        { ...formData, uploadedImage, signatureImage }
      );

      //setFormData(businessData);
      console.log("Business updated successfully:", response.data);
    } catch (error) {
      console.error("Error occurred while updating business:", error);
    }
  }

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div className={`main-wrapper`}>
      {/* <Sidebar /> */}
      <div className="page-wrapper Managebusiness-page">
        <div className="content container-fluid">
          <div className="page-header ">
            <div className="content-page-header pt-3" style={{ width: "90%" }}>
              <div className="BusinessSettings-title">
                <h6>Business Settings</h6>
                <p>Edit Your Company Settings And Information</p>
              </div>
              <div className="list-btn Manage-Business-Settings">
                {/* <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-primary"
                      to="#"
                      onClick={() => setOpen4(true)}
                      style={{ backgroundColor: "#cac5f0", color: "white" }}
                    >
                      Create New Business
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="btn btn-primary"
                      to="#"
                      onClick={(e) => handleUpdateBusiness(e, formData?._id)}
                      style={{ backgroundColor: "#cac5f0", color: "white" }}
                    >
                      Save Changes
                    </Link>
                  </li>
                </ul> */}
                <button onClick={() => setDeleteUpdateSettings1(true)} className="deleteBusiness">Delete Business</button>
              </div>
              <CreateNewBusiness
                open={open4}
                onCancel={() => setOpen4(false)}
                fetchBusinessDetails={fetchBusinessDetails}
                setBusinessCards={setBusinessCards}
                businessCards={businessCards}
              />
            </div>
          </div>
          <div className="row bg-white py-3 rounded ManageBusiness-content">
            <div className="col-md-11">
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12 mb-4">
                      {/* <div className="col-lg-4 col-md-6 col-6 col-sm-4 mb-3">
                        <div className="form-group">
                          {!uploadedImage && (
                            <>
  

                              <Upload listType="picture-card" maxCount={1} onChange={handleFileChange}>
                                {uploadButton}
                              </Upload>
                            </>
                          )}

                          {uploadedImage && (

                            <>
                              <Space
                                direction="horizontal"
                                style={{
                                  width: "100%",
                                }}
                                size="large"
                              >
                                <Upload listType="picture-card" maxCount={1} action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload">
                                  {uploadButton}
                                </Upload>
                              </Space>
                            </>
                          )}
                          {!uploadedImage && (
                            <div className="upload-image-manage-business-text">
                              <p className="upload-image-manage-business-p">
                                <button>Upload Image</button>
                              </p>
                            </div>
                          )}
                        </div>
                      </div> */}


                      <div className="row">
                        <div className="col-md-6 col-sm-6">
                          <div className="form-group">
                            <label>Business Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Name"
                              //   defaultValue="Hirola"
                              value={formData?.businessName}
                              onChange={(e) =>
                                handleInputForm("businessName", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6">
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
                                handleInputForm("businessType", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-6 col-sm-6">
                          <div className="form-group">
                            <label>Billing Address</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Your Address"
                              value={formData?.address}
                              onChange={(e) =>
                                handleInputForm("address", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Country</label>
                            <Select
                              options={Country.getAllCountries()}
                              getOptionLabel={(options) => {
                                return options["name"];
                              }}
                              getOptionValue={(options) => {
                                return options["name"];
                              }}
                              value={formData?.country}
                              onChange={(item) => handleInputForm("country", item)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>City</label>
                            <Select
                              options={City.getCitiesOfState(
                                formData?.state?.countryCode,
                                formData?.state?.isoCode
                              )}
                              getOptionLabel={(options) => {
                                return options["name"];
                              }}
                              getOptionValue={(options) => {
                                return options["name"];
                              }}
                              value={formData?.city}
                              onChange={(item) => handleInputForm("city", item)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>State / Province</label>
                            <Select
                              options={State?.getStatesOfCountry(
                                formData?.country?.isoCode
                              )}
                              getOptionLabel={(options) => {
                                return options["name"];
                              }}
                              getOptionValue={(options) => {
                                return options["name"];
                              }}
                              value={formData?.state}
                              onChange={(item) => handleInputForm("state", item)}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>
                              Postal Code <span className="text-danger"></span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Pincode"
                              value={formData?.pincode}
                              onChange={(e) =>
                                handleInputForm("pincode", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Business E-Mail</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email"
                              value={formData?.email}
                              onChange={(e) =>
                                handleInputForm("email", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Business Number</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Phone Number"
                              value={formData?.phone}
                              disabled
                              maxLength={10}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Industry Type</label>

                            <Select2
                              className="w-100"
                              data={industryOptions}
                              options={{ placeholder: "Choose your industry type" }}
                              value={formData?.industryType}
                              onChange={(e) =>
                                handleInputForm("industryType", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Business Registration Type</label>
                            <Select2
                              className="w-100"
                              data={brtOptions}
                              options={{
                                placeholder:
                                  "Choose your business registration type",
                              }}
                              value={formData?.registrationType}
                              onChange={(e) =>
                                handleInputForm("registrationType", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="form-group d-flex items-center gap-3 py-3">
                          <label style={{fontSize:"18px"}}>Are you GST Registered?</label>
                          <div className="">
                            <label  style={{fontSize:"18px"}} className="custom_radio me-3">
                              <input
                                type="radio"
                                name="payment"
                                value="no"
                                checked={!isGSTRegistered}
                                onChange={handleRadioChange}
                              />
                              <span className="checkmark" /> No
                            </label>
                            <label style={{fontSize:"18px"}} className="custom_radio me-3">
                              <input
                                type="radio"
                                name="payment"
                                value="yes"
                                checked={isGSTRegistered}
                                onChange={handleRadioChange}
                              />
                              <span  className="checkmark" /> Yes
                            </label>
                          </div>
                        </div>
                        {isGSTRegistered && (
                          <>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>GSTIN</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={formData?.gstNumber}
                                    onChange={(e) =>
                                      handleInputForm("gstNumber", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <label>Pan Number</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your pan number"
                                    value={formData?.PANNumber}
                                    onChange={(e) =>
                                      handleInputForm("PANNumber", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label>Terms and Conditions <span className="TermsandConditions">(Note: Details added below will be shown on your Invoice)</span> </label>
                                  <textarea
                                    placeholder="Enter Terms & Conditions"
                                    name=""
                                    id=""
                                    cols="70"
                                    rows="3"
                                    value={formData?.termsConditions}
                                    onChange={(e) =>
                                      handleInputForm("termsConditions", e.target.value)
                                    }
                                    className="px-2 py-3 shadow-for-textarea rounded-3"
                                    style={{ width: "100%" }}
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <div className="form-group">
                        <label>Total Revenue</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Total Revenue"
                          value={formData?.TotalRevenue}
                          onChange={(e) =>
                            handleInputForm("TotalRevenue", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <h2 className="uploadoptions">Upload Options</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group text-center flex justify-center gap-2">
                
                       <div>
                          <label class="custom-file-upload">
                            <input
                              type="file"
                              name=""
                              id=""
                              className=""
                              onChange={handleFile1Change}
                            />
                            <div className={signatureImage ? "upload-image-parent-withImage" : "upload-image-parent"}>
                              <img src={signatureImage ? signatureImage : "./newdashboard/gallery-add.png"} alt="" />
                 
                            </div>
                            {signatureImage ? "Update Your Buisness Image" : "Upload your Business Image"}
                          </label>
                          <p>Business Logo</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group text-center flex justify-center gap-2">
                
                       <div>
                          <label class="custom-file-upload">
                            <input
                              type="file"
                              name=""
                              id=""
                              className=""
                              onChange={handleFileChange}
                            />
                            <div className={uploadedImage ? "upload-image-parent-withImage" : "upload-image-parent"}>
                              <img src={uploadedImage ? uploadedImage : "./newdashboard/gallery-add.png"} alt="" />
                 
                            </div>
                            {uploadedImage ? "Update Your Buisness Image" : "Upload your Business Image"}
                          </label>
                          <p>Business Logo</p>
                        </div>
                      </div>
                    </div>
                  
                  </div>
                </div>
                <div className="saveBusiness-button-section">
                  <button>Save Settings</button>
                  <p>Other Business</p>
                  <div className="Sales-invoice-summery-dropdown" style={{marginBottom:"20px"}}>
                    <div class="Dashboard3one-dropdown-container">
                      <select
                        class="Dashboard3one-dropdown"
                        name="dashboard-dropdown"
                        id="dashboard-dropdown"
                      >
                        <option value="">Select Business</option>
                        {/* <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                    <option value="Option 4">Option 4</option> */}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div
                  onClick={() => setDeleteUpdateSettings1(true)}
                  className="manage-business-company-settings"
                >
                  <div className="">
                    <ul className="icons-list">
                      <li>
                        <i class="fa fa-trash" aria-hidden="true"></i>
                      </li>
                    </ul>
                  </div>
                  <div className="form-group mb-0">
                    <h6 id={formData?._id}>Delete Business</h6>

                    <p className="manage-business-e-invoicing-p">
                      Business will be permanently deleted
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="row" key={open4}>
              {userData?.AllBusiness && (
                <div key={open4}>
                  {userData?.AllBusiness?.map((item, index) => (
                    <div key={index}>
                      <h3>Business {index + 1}</h3>
                      <div
                        className="d-flex justify-content-between switch-content-button"
                        style={{ border: "1px solid #c7c9c8" }}
                      >
                        <p>Name: {Object.values(item)[0]}</p>
                        <button
                          id={Object.keys(item)[0]}
                          onClick={handleBusiness}
                        >
                          switch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Modal
            onCancel={() => setDeleteUpdateSettings1(false)}
            closable={false}
            open={deleteUpdateSettings1}
            footer={null}
          >
            <div className="form-header">
              <h3 className="update-popup-buttons">Delete Business</h3>
              <p>Are you sure want to delete?</p>
            </div>
            <div className="modal-btn delete-action">
              <div className="row">
                <div className="col-6">
                  <button
                    type="submit"
                    className="w-100 btn btn-primary paid-continue-btn"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="submit"
                    onClick={() => setDeleteUpdateSettings1(false)}
                    className="w-100 btn btn-primary paid-cancel-btn delete-category"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};
export default ManageBusinessProfileSettings;
