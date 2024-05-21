import Papa from "papaparse";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { DropIcon } from "../_components/imagepath";
import "../_components/antd.css";
import Select2 from "react-select2-wrapper";
import { Input, Steps, Form, Radio } from "antd";
import DatePicker from "react-datepicker";
import { Button, Modal } from "antd";
import axios from "axios";
import "jspdf-autotable";
import useHandleDownload from "../Hooks/useHandleDownload";
import { toast } from "react-toastify";
import AddCategoryModal from "./AddCategoryModal";
import { AddUnitsModal } from "./AddUnitsModal";
import AddGst from "../Gst/AddGst";
import { useSelector } from "react-redux";

const { Step } = Steps;

const EditItemProductModal = ({ visible, onCancel, productid }) => {
  const [datasource, setDatasource] = useState([]);
  const [addGst, setAddGst] = useState(false);
  const [addUnits1, setAddUnits1] = useState(false);
  const [addCategory1, setAddCategory1] = useState(false);
  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);


  useEffect(() => {
    if (
      toggleTabsState !== 1 &&
      toggleTabsState !== 2 &&
      toggleTabsState !== 3
    ) {
      setToggleTabsState(0);
    }
  }, [toggleTabsState]);

  useEffect(() => {
    let downloadableData = datasource;
    setDownloadData(downloadableData);
  }, [datasource]);

  const productformData = {
    category: "product",
    itemTypeproduct: "",
    itemTypeservice: "",
    itemCategory: "",
    taxType: "With Tax",
    taxpurchaseType: "With Tax",
    itemName: "",
    salesPrice: "",
    gstTaxRate: "",
    MRP: "",
    measuringUnit: "",
    itemCode: "",
    HSNcode: "",
    godown: "",
    openingStock: "",
    lowStockQuantity: "",
    addingDate: new Date(),
    productDescription: "",
    productImage: {
      url: "",
      public_id: "",
    },
    purchasePrice: "",
    serviceName: "",
    serviceCode: "",
    purchaseProduct: 0,
    salesProduct: 0,
    Godown: [],
  };

  const [formData, setFormData] = useState(productformData);
  console.log("formData", formData)

  const userData = useSelector(state => state?.user?.userData)

  const [validation, setValidation] = useState({
    itemName: { isdataValid: true, message: "" },
  });

  const changeHandle = (fieldName, value) => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]*$/;
    let isdataValid = true;
    let message = "";
    if (fieldName === "itemName") {
      isdataValid = alphanumericRegex.test(value);
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

  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);

  const [imageURL, setImageURL] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setImageURL(base64Image);
        setFormData({
          ...formData,
          productImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };


  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      addingDate: date,
    });
  };

  // Categories Data
  const [categoryData, setCategoryData] = useState([]);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/addcategory/categories"
      );
      setCategoryData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  console.log("categoryData", categoryData);

  const categoryOptions = categoryData.map((cat) => ({
    id: cat._id,
    text: cat.categoryName,
  }));

  const [unitsdata, setUnitsdata] = useState([]);
  // Units Data
  const [measureUnit, setMeasureUnit] = useState([]);

  const unitsOptions = measureUnit.map((unit) => ({
    id: unit._id,
    text: unit.unitName,
  }));

  const fetchUnitData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/Unit/getunits"
      );
      setMeasureUnit(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUnitData();
  }, []);

  const UnitsOptions = measureUnit.map((cat) => ({
    id: cat._id,
    text: cat.unitName,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/addProduct/products"
        );

        const dataWithIds = response.data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));

        setDatasource(dataWithIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };
  console.log("products", datasource);

  // delete update
  const [deleteProduct, setDeleteProduct] = useState("");

  const DeleteUpdateProductID = (value) => {
    setDeleteProduct(value);
  };
  const validateFormData = (formData, category) => {
    const validationErrors = {};

    if (category === "product") {
      if (!formData.itemName) {
        validationErrors.itemName = {
          isdataValid: false,
          message: "Please enter a valid name",
        };
      }
    }

    return validationErrors;
  };

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

    try {
      const response = await axios.put(
        `http://localhost:8000/api/addProduct/productedit/${productid}`,
        formData
      );

      console.log("Data updated successfully:", response.data);

      toast.success("Product Updated Succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      fetchProductData();
      setRender(true);
      setFormData(productformData);
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error updating data", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      onCancel(false);
    }
  };

  const changeServiceButton = () => { };

  const [gstData, setGstData] = useState([]);

  const fetchGstData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/addgst/gst");
      setGstData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGstData();
  }, []);

  const gstOptions = gstData.map((gst) => ({
    id: gst._id,
    text: gst?.gstPercentageName,
  }));

  const [LowStockErrMsg, setLowStockErrMsg] = useState(null);

  const handleInputChange = (fieldName, value) => {
    if (fieldName === "lowStockQuantity") {
      if (parseFloat(value) > parseFloat(formData.openingStock)) {
        setLowStockErrMsg("Value Greater Than Product Stock");

        return;
      } else {
        setLowStockErrMsg(null);
      }
    }
    if (fieldName === "lowStockQuantity") {
      const regex = /^\d+(\.\d*)?$/;

      console.log("formData.openingStock -01", value);
      if (value.trim().length > 0 && !regex.test(value)) {
        return;
      }
    }

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const [GodownList, setGodownList] = useState([]);

  console.log("GodownList", GodownList.length);

  const [GodownOptions, setGodownOptions] = useState(null);
  const fetchGodownData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/godown/godownlist"
      );
      setGodownList(response.data);
      const godownOptions = response.data.map((godown) => ({
        id: godown.godownId,
        text: godown.godownName,
      }));

      setGodownOptions(godownOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGodownData();
  }, [userData]);

  //
  // steps form code goes here
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [category, setCategory] = useState("product");

  console.log("currentStep", currentStep);

  const nextStep = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = (values) => {
    console.log("Form values:", values);
  };
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCurrentStep(0);
    setFormData({
      ...formData,
      category: newCategory,
    });

    setCategory(newCategory);
  };

  const handleNext = () => {
    form
      .validateFields()
      .then(() => {
        nextStep();
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const [godownEnabled, setGodownEnabled] = useState(false);
  const [showFields, setShowFields] = useState(false);

  const handleGodownToggle = () => {
    setFormData({ ...formData, Godown: [] });
    setEntries([]);
    setDisabledGodown(null);
    setGodownEnabled(!godownEnabled);
    setFormData({ ...formData, openingStock: 0 });
  };

  const [MRPEnabled, setMRPEnabled] = useState(false);

  const [purchasepriceEnable, setPurchaseoriceEnable] = useState(false);

  const [GodownOptionsMain, setGodownOptionsMain] = useState(GodownOptions);

  useEffect(() => {
    setGodownOptionsMain(GodownOptions);
  }, [GodownOptions]);

  console.log("GodownOptionsMain", GodownOptionsMain);

  const handleMRPToggle = () => {
    setMRPEnabled(!MRPEnabled);
  };

  const handlePurchasePrice = () => {
    setPurchaseoriceEnable(!purchasepriceEnable);
  };

  const handleLowStockToggle = () => {
    setShowLowStockField(!showLowStockField);
  };

  const [measureunitEnabled, setMeasureunitEnabled] = useState(false);

  const [entries, setEntries] = useState([]);
  console.log("Entries", entries);

  // Function to handle adding new entries
  const addEntry = () => {
    const newEntry = {
      godownId: "",
      stock: "",
    };
    setEntries([...entries, newEntry]);
  };

  const [FilteredGodown, setFilteredGodown] = useState([]);

  const [disabledGodown, setDisabledGodown] = useState(null);
  const [ReducedOpenStock, setReducedOpenStock] = useState(null);

  useEffect(() => {
    setFormData({ ...formData, openingStock: ReducedOpenStock });
  }, [ReducedOpenStock]);

  const handleEntryInputChange = (index, fieldName, value) => {
    console.log("fieldName", fieldName);

    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [fieldName]: value,
    };
    setEntries(updatedEntries);

    if (fieldName === "stock") {
      const sum = updatedEntries.reduce(
        (acc, entry) => acc + (Number(entry.stock) || 0),
        0
      );

      setReducedOpenStock(sum);
    }

    const disabled = updatedEntries.map((entry) => entry.godownId);
    setDisabledGodown(disabled);

    // Update the formData using the previous state
    setFormData((prevFormData) => ({
      ...prevFormData,
      Godown: updatedEntries,
    }));
  };

  // Only trigger when the length of entries changes

  const handleMeasureunitToggle = () => {
    setMeasureunitEnabled(!measureunitEnabled);
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/addProduct/productsbyid/${productid}`
      );
      console.log("productbyid", response.data);
      setFormData(response.data);
      console.log("product data in modal", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productid]);

  useEffect(() => {
    if (formData && formData.purchasePrice) {
      setFormData({
        ...formData,
        purchasePrice: formData.purchasePrice,
      });
    }
    setPurchaseoriceEnable(true);
  }, []);


  // useEffect(() => {
  //   if (formData && formData.Godown && formData.Godown.length < 0) {
  //     setGodownEnabled(true);
  //   }
  // }, []);

  return (
    <>
      <Modal
        className="add-bank-account-header-line"
        title="Edit Item"
        onCancel={onCancel}
        visible={visible}
        width={1000}
        centered
        footer={[
          <Button
            key="cancel"
            className="btn btn-secondary waves-effect me-2"
            onClick={() => onCancel(false)}
          >
            Cancel
          </Button>,
          category === "product" && currentStep === 2 && (
            <Button
              key="submit"
              type="primary"
              className="btn btn-info waves-effect waves-light primary-button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ),
          category === "service" && (
            <Button
              key="submit"
              type="primary"
              className="btn btn-info waves-effect waves-light primary-button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ),
          category === "product" && currentStep > 0 && (
            <Button
              key="prev"
              className="btn btn-info waves-effect waves-light primary-button"
              onClick={prevStep}
            >
              Previous
            </Button>
          ),
          category === "product" && currentStep < 2 && (
            <Button
              key="next"
              type="primary"
              className="btn btn-info waves-effect waves-light primary-button"
              onClick={handleNext}
            >
              Next
            </Button>
          ),
        ]}
      >
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="row ">
                <>
                  <div className="">
                    <Radio.Group
                      onChange={handleCategoryChange}
                      value={formData?.category}
                    >
                      {formData?.category === "product" ? (
                        <Radio.Button value="product">Product</Radio.Button>
                      ) : (
                        <Radio.Button value="service">Service</Radio.Button>
                      )}
                    </Radio.Group>

                  </div>
                  <div className="row mt-5">
                    <div className="col-md-3">
                      <Steps current={currentStep} direction="vertical">
                        {category === "product" ? (
                          <>
                            <Step
                              className="items-center flex justify-center"
                              title="Basic Details"
                            />
                            <Step title="Stock Details" />
                            <Step title="Other Fields" />
                          </>
                        ) : (
                          <>
                            <Step title="Service Details" />
                          </>
                        )}
                      </Steps>
                    </div>

                    <div className="col-md-9">
                      <Form form={form} onFinish={handleFinish}>
                        {category === "product" && currentStep === 0 && (
                          <div className="mb-3 row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>
                                  Item Name{" "}
                                  <span className="accountprofilesettings-start-mark">
                                    *
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  className={`form-control ${!validation.itemName.isdataValid
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                  placeholder="item name"
                                  value={formData?.itemName}
                                  onChange={(e) =>
                                    changeHandle("itemName", e.target.value)
                                  }
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
                                  Category <span className="text-danger"></span>
                                </label>
                                <ul
                                  className="form-group-plus css-equal-heights"
                                  style={{ width: "100%" }}
                                >
                                  <li style={{ width: "82%" }}>
                                    <Select2
                                      className={`form-select is-invalid`}
                                      data={categoryOptions}
                                      options={{
                                        placeholder: "select category",
                                      }}
                                      value={formData?.itemCategory}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "itemCategory",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      className="btn btn-primary form-plus-btn"
                                      onClick={() => setAddCategory1(true)}
                                    >
                                      <FeatherIcon icon="plus-circle" />
                                    </Link>

                                    <AddCategoryModal
                                      visible={addCategory1}
                                      onCancel={() => setAddCategory1(false)}
                                      datasource={categoryData}
                                      setDatasource={setCategoryData}
                                    />
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>
                                  GST Tax Rate(%)
                                  <span className="text-danger"></span>
                                </label>
                                <ul
                                  className="form-group-plus css-equal-heights"
                                  style={{ width: "100%" }}
                                >
                                  <li style={{ width: "82%" }}>
                                    <Select2
                                      className={`form-select is-invalid`}
                                      data={gstOptions}
                                      options={{
                                        placeholder: "select gst",
                                      }}
                                      value={formData?.gstTaxRate}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "gstTaxRate",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      className="btn btn-primary form-plus-btn"
                                      onClick={() => setAddGst(true)}
                                    >
                                      <FeatherIcon icon="plus-circle" />
                                    </Link>

                                    <AddGst
                                      visible={addGst}
                                      onCancel={() => setAddGst(false)}
                                      gstData={gstData}
                                      setGstData={setGstData}
                                    />
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>
                                  Measuring Unit{" "}
                                  <span className="accountprofilesettings-start-mark"></span>
                                </label>
                                <ul
                                  className="form-group-plus css-equal-heights"
                                  style={{ width: "100%" }}
                                >
                                  <li style={{ width: "82%" }}>
                                    <Select2
                                      className={`form-select is-invalid`}
                                      data={UnitsOptions}
                                      options={{
                                        placeholder: "select units",
                                      }}
                                      value={formData?.measuringUnit}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "measuringUnit",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      className="btn btn-primary form-plus-btn"
                                      onClick={() => setAddUnits1(true)}
                                    >
                                      <FeatherIcon icon="plus-circle" />
                                    </Link>
                                    <AddUnitsModal
                                      visible={addUnits1}
                                      onCancel={() => setAddUnits1(false)}
                                      datasource={measureUnit}
                                      setDatasource={setMeasureUnit}
                                    />
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>
                                  Sales Price{" "}
                                  <span className="accountprofilesettings-start-mark"></span>
                                </label>
                                <div className="input-group">
                                  <input
                                    type="number"
                                    placeholder="Ex:200"
                                    className={"form-control"}
                                    aria-label="Text input with dropdown button"
                                    value={formData?.salesPrice}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "salesPrice",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-outline-secondary dropdown-toggle"
                                      type="button"
                                      id="taxTypeDropdown"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      {formData?.taxType === "With Tax"
                                        ? "With Tax"
                                        : "Without Tax"}
                                    </button>
                                    <ul
                                      className="dropdown-menu"
                                      aria-labelledby="taxTypeDropdown"
                                    >
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={() =>
                                            handleInputChange(
                                              "taxType",
                                              "With Tax"
                                            )
                                          }
                                        >
                                          With Tax
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={() =>
                                            handleInputChange(
                                              "taxType",
                                              "Without Tax"
                                            )
                                          }
                                        >
                                          Without Tax
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>Opening Stock</label>

                                <input
                                  type="text"
                                  className={`form-control`}
                                  placeholder="200"
                                  value={formData?.openingStock}
                                  disabled={
                                    formData?.Godown?.length > 0 &&
                                    godownEnabled
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      "openingStock",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="form-group row align-items-center">
                              <label className="col-sm-4 col-form-label">
                                Enable Purchase Price
                              </label>
                              <div className="col-sm-8">
                                <label className="form-check form-switch">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={purchasepriceEnable}
                                    onChange={handlePurchasePrice}
                                  />
                                  <span className="form-check-label"></span>
                                </label>
                              </div>
                            </div>

                            {purchasepriceEnable && (
                              <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>
                                    Purchase Price{" "}
                                    <span className="accountprofilesettings-start-mark"></span>
                                  </label>
                                  <div className="input-group">
                                    <input
                                      type="number"
                                      placeholder="Ex:200"
                                      className={"form-control"}
                                      aria-label="Text input with dropdown button"
                                      value={formData?.purchasePrice}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "purchasePrice",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {category === "product" && currentStep === 1 && (
                          <div className="row mb-3">
                            <div className="col-lg-6 col-md-6 col-sm-6">
                              <div className="form-group">
                                <label>Item Code </label>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ex:118KJUY"
                                    aria-describedby="basic-addon2"
                                    value={formData?.itemCode}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "itemCode",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                              <div className="form-group">
                                <label>HSN Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="18189"
                                  value={formData?.HSNcode}
                                  onChange={(e) =>
                                    handleInputChange("HSNcode", e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>As Of Date</label>
                                <div className="cal-icon cal-icon-info">
                                  <DatePicker
                                    selected={selectedDate}
                                    value={formData?.addingDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd-mm-yyyy"
                                    showTimeInput={false}
                                    className="datetimepicker form-control"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="form-group">
                                <label>Description</label>

                                <div class="form-floating">
                                  <textarea
                                    class="form-control"
                                    placeholder="Leave a comment here"
                                    id="floatingTextarea"
                                    value={formData?.productDescription}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "productDescription",
                                        e.target.value
                                      )
                                    }
                                  ></textarea>
                                  <label for="floatingTextarea">Comments</label>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12 col-sm-12">
                              <div className="form-group mb-0 pb-0">
                                <label>Image</label>
                                <div className="form-group service-upload mb-0">
                                  <span>
                                    <img src={DropIcon} alt="upload" />
                                  </span>
                                  <h6 className="drop-browse align-center">
                                    Drop your files here or
                                    <span className="text-primary ms-1">
                                      browse
                                    </span>
                                  </h6>
                                  <p className="text-muted">
                                    Maximum size: 50MB
                                  </p>
                                  <input
                                    type="file"
                                    multiple=""
                                    id="image_sign"
                                    onChange={handleFileChange}
                                  />
                                  {imageURL && (
                                    <div>
                                      <img
                                        src={imageURL}
                                        alt="Selected Image"
                                        style={{
                                          maxWidth: "100%",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* {category === "product" && currentStep === 2 && (
                          <div className="row">
                            <div className="form-group row align-items-center">
                              <label className="col-sm-4 col-form-label">
                                Enable Godown
                              </label>
                              <div className="col-sm-8">
                                <label className="form-check form-switch">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={godownEnabled}
                                    onChange={handleGodownToggle}
                                  />
                                  <span className="form-check-label"></span>
                                </label>
                              </div>
                            </div>
                            {godownEnabled && (
                              <>
                                {entries?.map((entry, index) => (
                                  <div className="row" key={index}>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                      <div className="form-group">
                                        <label htmlFor={`godown-${index}`}>
                                          Select Godown
                                        </label>
                                        <select
                                          id={`godown-${index}`}
                                          className="form-select"
                                          value={entry.godownId}
                                          onChange={(e) =>
                                            handleEntryInputChange(
                                              index,
                                              "godownId",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">
                                            Select a godown
                                          </option>
                                          {GodownOptionsMain.map((option) => (
                                            <option
                                              key={option.id}
                                              value={option.id}
                                              disabled={disabledGodown?.includes(
                                                option.id
                                              )}
                                            >
                                              {option.text}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                      <div className="form-group">
                                        <label
                                          htmlFor={`openingStock-${index}`}
                                        >
                                          Opening Stock
                                        </label>
                                        <input
                                          type="text"
                                          id={`openingStock-${index}`}
                                          className="form-control opening-stock-editproduct"
                                          value={entry.stock}
                                          onChange={(e) =>
                                            handleEntryInputChange(
                                              index,
                                              "stock",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}

                              
                                <div
                                  className={`text-end ${entries.length > 0 &&
                                    entries[entries.length - 1].godownId.trim()
                                      .length <= 0 &&
                                    "hidden"
                                    } ${GodownList?.length ===
                                    disabledGodown?.length && "hidden"
                                    }`}
                                >
                                  <button
                                    className="btn btn-primary flex  gap-2 items-center"
                                    onClick={addEntry}
                                  >
                                    <i className="fa fa-plus"></i> Add Godown
                                  </button>
                                </div>
                              </>
                            )}

                            <div className="form-group row align-items-center">
                              <label className="col-sm-4 col-form-label">
                                Enable Low stock quantity
                              </label>
                              <div className="col-sm-8">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="lowStockToggle"
                                    checked={showLowStockField}
                                    onChange={handleLowStockToggle}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="lowStockToggle"
                                  ></label>
                                </div>
                              </div>
                              {showLowStockField && (
                                <div className="form-group mt-3">
                                  <label>Low Stock Quantity</label>
                                  <div className="input-group ">
                                    
                                    <input
                                      className="form-control low-stock-quantity"
                                      type="text"
                                      name="lowStockQuantity"
                                      value={formData?.lowStockQuantity}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "lowStockQuantity",
                                          e.target.value
                                        )
                                      }
                                      placeholder="PCS"
                                    />
                                  </div>
                                  {LowStockErrMsg && (
                                    <div className="text-red-400 text-sm">
                                      {LowStockErrMsg}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="form-group row align-items-center">
                              <label className="col-sm-4 col-form-label">
                                Enable MRP
                              </label>
                              <div className="col-sm-8">
                                <label className="form-check form-switch">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={MRPEnabled}
                                    onChange={handleMRPToggle}
                                  />
                                  <span className="form-check-label"></span>
                                </label>
                              </div>
                            </div>
                            {MRPEnabled && (
                              <>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                  <div className="form-group">
                                    <label>MRP</label>
                                    <Input
                                      className="opening-stock-editproduct"
                                      value={formData?.MRP}
                                      onChange={(e) =>
                                        handleInputChange("MRP", e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )} */}

                        {category === "service" && currentStep === 0 && (
                          <div className="mb-3 row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>Service Name</label>
                                <span className="accountprofilesettings-start-mark">
                                  *
                                </span>
                                <input
                                  type="text"
                                  className={`form-control ${validation &&
                                    validation.serviceName &&
                                    !validation.serviceName.isdataValid
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                  placeholder="Service name"
                                  value={formData?.serviceName}
                                  onChange={(e) =>
                                    changeHandle("serviceName", e.target.value)
                                  }
                                />
                                {validation &&
                                  validation.serviceName &&
                                  !validation.serviceName.isdataValid && (
                                    <div className="error-message text-danger">
                                      {validation.serviceName.message}
                                    </div>
                                  )}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>Category</label>
                                <ul
                                  className="form-group-plus css-equal-heights"
                                  style={{ width: "100%" }}
                                >
                                  <li style={{ width: "82%" }}>
                                    <Select2
                                      className={"form-select"}
                                      data={categoryOptions}
                                      options={{
                                        placeholder: "Select category",
                                      }}
                                      value={formData?.itemCategory}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "itemCategory",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      className="btn btn-primary form-plus-btn"
                                      onClick={() => setAddCategory1(true)}
                                    >
                                      <FeatherIcon icon="plus-circle" />
                                    </Link>
                                    <AddCategoryModal
                                      visible={addCategory1}
                                      onCancel={() => setAddCategory1(false)}
                                      datasource={categoryData}
                                      setDatasource={setCategoryData}
                                    />
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>
                                  Sales Price{" "}
                                  <span className="accountprofilesettings-start-mark"></span>
                                </label>
                                <div className="input-group">
                                  <input
                                    type="number"
                                    placeholder="Ex:200"
                                    className={"form-control"}
                                    aria-label="Text input with dropdown button"
                                    value={formData?.salesPrice}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "salesPrice",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-outline-secondary dropdown-toggle"
                                      style={{
                                        backgroundColor: "#2f08e8ba",
                                        color: "white",
                                      }}
                                      type="button"
                                      id="taxTypeDropdown"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      {formData?.taxType === "With Tax"
                                        ? "With Tax"
                                        : "Without Tax"}
                                    </button>
                                    <ul
                                      className="dropdown-menu"
                                      aria-labelledby="taxTypeDropdown"
                                    >
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={() =>
                                            handleInputChange(
                                              "taxType",
                                              "With Tax"
                                            )
                                          }
                                        >
                                          With Tax
                                        </a>
                                      </li>
                                      <li>
                                        <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={() =>
                                            handleInputChange(
                                              "taxType",
                                              "Without Tax"
                                            )
                                          }
                                        >
                                          Without Tax
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>
                                  GST Tax Rate(%)
                                  <span className="text-danger"></span>
                                </label>
                                <ul
                                  className="form-group-plus css-equal-heights"
                                  style={{ width: "100%" }}
                                >
                                  <li style={{ width: "82%" }}>
                                    <Select2
                                      className={`form-select is-invalid`}
                                      data={gstOptions}
                                      options={{
                                        placeholder: "select gst",
                                      }}
                                      value={formData?.gstTaxRate}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "gstTaxRate",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      className="btn btn-primary form-plus-btn"
                                      onClick={() => setAddGst(true)}
                                    >
                                      <FeatherIcon icon="plus-circle" />
                                    </Link>

                                    <AddGst
                                      visible={addGst}
                                      onCancel={() => setAddGst(false)}
                                      gstData={gstData}
                                      setGstData={setGstData}
                                    />
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-6">
                              <div className="form-group">
                                <label>Service Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="18189"
                                  value={formData?.serviceCode}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "serviceCode",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12">
                              <div className="form-group">
                                <label>As Of Date</label>
                                <div className="cal-icon cal-icon-info">
                                  <DatePicker
                                    selected={selectedDate}
                                    value={formData?.addingDate}
                                    onChange={handleDateChange}
                                    dateFormat="dd-mm-yyyy"
                                    showTimeInput={false}
                                    className="datetimepicker form-control"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-group row align-items-center">
                              <label className="col-sm-4 col-form-label">
                                Enable Measuring Unit
                              </label>
                              <div className="col-sm-8">
                                <label className="form-check form-switch">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={measureunitEnabled}
                                    onChange={handleMeasureunitToggle}
                                  />
                                  <span className="form-check-label"></span>
                                </label>
                              </div>
                            </div>
                            {measureunitEnabled && (
                              <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>
                                    Measuring Unit{" "}
                                    <span className="accountprofilesettings-start-mark"></span>
                                  </label>
                                  <ul
                                    className="form-group-plus css-equal-heights"
                                    style={{ width: "100%" }}
                                  >
                                    <li style={{ width: "82%" }}>
                                      <Select2
                                        className={`form-select is-invalid`}
                                        data={UnitsOptions}
                                        options={{
                                          placeholder: "select units",
                                        }}
                                        value={formData?.measuringUnit}
                                        onChange={(e) =>
                                          handleInputChange(
                                            "measuringUnit",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </li>
                                    <li>
                                      <Link
                                        to="#"
                                        className="btn btn-primary form-plus-btn"
                                        onClick={() => setAddUnits1(true)}
                                      >
                                        <FeatherIcon icon="plus-circle" />
                                      </Link>
                                      <AddUnitsModal
                                        visible={addUnits1}
                                        onCancel={() => setAddUnits1(false)}
                                        datasource={measureUnit}
                                        setDatasource={setMeasureUnit}
                                      />
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Form>
                    </div>
                  </div>
                </>
              </div>
            </div>{" "}
          </div>{" "}
        </div>
      </Modal>
    </>
  );
};

export default EditItemProductModal;
