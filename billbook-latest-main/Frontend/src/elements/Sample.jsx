import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import Select2 from "react-select2-wrapper";
import "../_components/antd.css";
import axios from "axios";
import Swal from "sweetalert2";
import TransforStock from "./TransforStock";
import { Modal, Table, Button, Tooltip, Select } from "antd";
import useHandleDownload from "../Hooks/useHandleDownload";
import { toast } from "react-toastify";
import AddGodown from "./AddGodown";

const GodownList = () => {
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [addGodown1, setAddGodown1] = useState(false);
  const [editGodownList1, setEditGodownList1] = useState(false);
  const [updateGodownListModal1, setUpdateGodownListModal1] = useState(false);
  const [deleteGodownListModal1, setDeleteGodownListModal1] = useState(false);
  const [transferStock, setTransferStock] = useState(false);
  const [isTransferEnabled, setIsTransferEnabled] = useState(false);

  const [GodownList, setGodownList] = useState([]);
  const [selectedGodown, setSelectedGodown] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedGodownProducts, setSelectedGodownProducts] = useState([]);
  console.log("selectedGodownProducts", selectedGodownProducts);
  const [godownproduct, setGodownproduct] = useState([]);

  console.log("selectedGodownProducts", selectedGodownProducts);
  const [formData, setFormData] = useState({
    date: new Date(),
    godownName: "",
    godownStreetAddress: "",
    placeofsupply: "",
    godownPincode: "",
    godownCity: "",
  });

  console.log("formData", formData);

  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [States, setStates] = useState([
    { id: "Andhra Pradesh", text: "Andhra Pradesh" },
    { id: "Arunachal Pradesh", text: "Arunachal Pradesh" },
    { id: "Assam", text: "Assam" },
    { id: "Bihar", text: "Bihar" },
    { id: "Chhattisgarh", text: "Chhattisgarh" },
    { id: "Goa", text: "Goa" },
    { id: "Gujarat", text: "Gujarat" },
    { id: "Haryana", text: "Haryana" },
    { id: "Himachal Pradesh", text: "Himachal Pradesh" },
    { id: "Jharkhand", text: "Jharkhand" },
    { id: "Karnataka", text: "Karnataka" },
    { id: "Kerala", text: "Kerala" },
    { id: "Madhya Pradesh", text: "Madhya Pradesh" },
    { id: "Maharashtra", text: "Maharashtra" },
    { id: "Manipur", text: "Manipur" },
    { id: "Meghalaya", text: "Meghalaya" },
    { id: "Mizoram", text: "Mizoram" },
    { id: "Nagaland", text: "Nagaland" },
    { id: "Odisha", text: "Odisha" },
    { id: "Punjab", text: "Punjab" },
    { id: "Rajasthan", text: "Rajasthan" },
    { id: "Sikkim", text: "Sikkim" },
    { id: "Tamil Nadu", text: "Tamil Nadu" },
    { id: "Telangana", text: "Telangana" },
    { id: "Tripura", text: "Tripura" },
    { id: "Uttar Pradesh", text: "Uttar Pradesh" },
    { id: "Uttarakhand", text: "Uttarakhand" },
    { id: "West Bengal", text: "West Bengal" },
  ]);

  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);

  const handleSelectGodown = (value) => {
    setSelectedGodown(value);
    const selectedGodown = GodownList.find(
      (godown) => godown.godownId === value
    );
    if (selectedGodown) {
      setSelectedGodownProducts(selectedGodown.Products);
    } else {
      setSelectedGodownProducts([]);
    }
  };

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };
  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [datasource, setDatasource] = useState([]);

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
    let downloadableData = selectedGodownProducts;
    setDownloadData(downloadableData);
    console.log("selectedGodownProductssxdcfvgbhn", selectedGodownProducts);
  }, [selectedGodownProducts]);

  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item, index) => ({
      "No.": index + 1,
      "Item name": item?.itemName,
      "Item code": item?.itemCode,
      "Stock Qty": item?.openingStock,
      "Stock Value": item.stockValue,
      "Selling Price": item?.salesPrice,
      "Purchase Price": item?.purchasePrice,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "No.", key: "id" },
      { label: "Item name", key: "itemName" },
      { label: "Item code", key: "itemCode" },
      { label: "Stock Qty", key: "openingStock" },
      { label: "Stock Value", key: "stockValue" },
      { label: "Selling Price", key: "salesPrice" },
      { label: "Purchase Price", key: "purchasePrice" },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = [
      "No.",
      "Item name",
      "Item code",
      "Stock Qty",
      "Stock Value",
      "Selling Price",
      "Purchase Price",
    ];
    // Set up table rows
    const rows = downloadData.map((item, index) => [
      index + 1,
      item?.itemName,
      item?.itemCode,
      item?.openingStock,
      item.stockValue,
      item?.salesPrice,
      item?.purchasePrice,
      // Add more fields as needed
    ]);
    handlePDFDownload({ columns, rows, heading: "Godown Management" });
  };

  const columns = [
    {
      title: "Item name",
      dataIndex: "itemName",
    },
    {
      title: "Item code",
      dataIndex: "itemCode",
    },

    {
      title: "Stock Qty",
      dataIndex: "openingStock",
    },
    {
      title: "Stock Value",
      dataIndex: "stockValue",
    },
    {
      title: "Selling Price",
      dataIndex: "salesPrice",
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [deleteGodownList3, setDeleteGodownUpdateList3] = useState("");

  const handleDeleteGodownListUpdate = (value) => {
    setDeleteGodownUpdateList3(value);
    setDeleteGodownListModal1(true);
  };
  const hasSelected = selectedRowKeys.length > 0;

  const fetchGodownData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/godown/godownlist"
      );
      setGodownList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGodownData();
  }, []);

  console.log("GodownList", GodownList);

  useEffect(() => {
    if (selectedGodown) {
      const products = godownproduct.filter(
        (product) => product.godown === selectedGodown
      );
      setFilteredProducts(products);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedGodown, godownproduct]);

  const [selectedGodownData, setSelectedGodownData] = useState(null);
  console.log("selectedGodownData Main", selectedGodownData);
  const [selectedformData, setSelectedFormData] = useState({
    godownName: "",
    godownStreetAddress: "",
    placeofsupply: "",
    godownPincode: "",
    godownCity: "",
  });

  useEffect(() => {
    if (selectedGodown) {
      const fetchSelectedGodownData = async (selectedgodown) => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/godown/godownbyid/${selectedgodown}`
          );
          // fetchGodownData();
          setSelectedGodownData(response.data);
          const data = response.data[0];
          setSelectedFormData({
            godownName: data.godownName,
            godownStreetAddress: data.godownStreetAddress,
            placeofsupply: data.placeofsupply,
            godownPincode: data.godownPincode,
            godownCity: data.godownCity,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchSelectedGodownData(selectedGodown);
    }
  }, [selectedGodown]);

  const [selectedvalidation, setSelectedValidation] = useState({
    godownName: { isValid: true, message: "" },
    godownStreetAddress: { isValid: true, message: "" },
    placeofsupply: { isValid: true, message: "" },
    godownPincode: { isValid: true, message: "" },
    godownCity: { isValid: true, message: "" },
  });

  const changeSelectedInputForm = (fieldName, value) => {
    const nameRegex = /^[a-zA-Z0-9\s'-]+$/;
    const addressRegex = /^[a-zA-Z0-9\s,'.#-]+$/;
    const cityRegex = /^[a-zA-Z\s'-]+$/;
    const pincodeRegex = /^\d{6}$/;
    let isValid = true;
    let message = "";
    if (fieldName === "godownName") {
      isValid = nameRegex.test(value);
      message = "Invalid godown name";
    }
    if (fieldName === "godownStreetAddress") {
      isValid = addressRegex.test(value);
      message = "Invalid godown Streetaddress";
    }
    if (fieldName === "placeofsupply") {
      isValid = value;
      message = "Invalid godown Streetaddress";
    }
    if (fieldName === "godownPincode") {
      isValid = pincodeRegex.test(value);
      message = "Invalid godown pincode";
    }
    if (fieldName === "godownCity") {
      isValid = cityRegex.test(value);
      message = "Invalid godown city";
    }
    setSelectedFormData({
      ...selectedformData,
      [fieldName]: value,
    });

    setSelectedValidation({
      ...selectedvalidation,
      [fieldName]: { isValid, message },
    });
  };

  const validateSelectedFormData = (selectedformData) => {
    const validationErrors = {};
    if (!selectedformData.godownName) {
      validationErrors.godownName = {
        isValid: false,
        message: "please enter valid godown name",
      };
    }
    return validationErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateSelectedFormData(selectedformData);
    if (Object.keys(validationErrors).length > 0) {
      setSelectedValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/godown/updategodown/${selectedGodown}`,
        { selectedformData }
      );

      if (response.status === 200) {
        toast.success(" updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        fetchGodownData();
        // window.location.reload();
      } else {
        toast.error("Failed to update units. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while updating the Units.", {
        position: toast.POSITION.TOP_RIGHT,
      });

      console.error("Error:", error);
    } finally {
      setUpdateGodownListModal1(false);
    }
  };

  // delete godown code starts here
  const handledeletegodown = async (e) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/godown/deletegodown/${selectedGodown}`
      );

      if (response.status === 200) {
        toast.success("Godown Deleted Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        fetchGodownData();
        window.location.reload();
      } else {
        toast.error("Failed to Delete Godown. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while deleting the Godown.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Error:", error);
    } finally {
      setDeleteGodownListModal1(false);
    }
  };

  const [EditGodownList3, seteditGodownUpdateList3] = useState("");

  const handleEditFormUpdate = (value) => {
    const validationErrors = validateSelectedFormData(selectedformData);
    if (Object.keys(validationErrors).length > 0) {
      setSelectedValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
    setUpdateGodownListModal1(true);
    seteditGodownUpdateList3(value);
    setEditGodownList1(false);
  };

  const handlecloseadjuststock = () => {
    setTransferStock(false);
  };

  console.log("godownproductx", godownproduct);

  godownproduct.forEach((item) => {
    const productid = item.productId;
    console.log("productidgodown:", productid);
  });

  console.log("selectedProductId", selectedProductId);
  const [selectedProductopeningStock, setSelectedProductopeningStock] =
    useState([]);

  console.log("selectedProductopeningStock", selectedProductopeningStock);

  const handleRowSelect = (record) => {
    console.log("record", record);
    setSelectedRowKey(record.productId);
    setSelectedProductId(record.productId);
    setSelectedProductopeningStock(record.openingStock);
    setIsTransferEnabled(true);
  };

  const handleClearRowSelection = () => {
    setSelectedRowKey(null);
    setIsTransferEnabled(false);
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <h3 className="py-3">Godown Management</h3>
              <div className="content-page-header ">
                <div className="form-group  godown-dropdown-select">
                  <Select
                    className="w-100"
                    placeholder="Choose godown"
                    value={selectedGodown}
                    onChange={handleSelectGodown}
                  >
                    {GodownList.map((godown) => (
                      <Option key={godown.godownId} value={godown.godownId}>
                        {godown.godownName}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    <div className="button-list me-2">
                      <button
                        type="button"
                        className={`btn btn-primary waves-effect waves-light mt-1 me-1 ${
                          isTransferEnabled ? "enabled" : ""
                        }`}
                        disabled={!isTransferEnabled}
                        onClick={() => setTransferStock(true)}
                      >
                        Transfer Stock
                      </button>
                    </div>

                    <div className="button-list me-2">
                      {/* Responsive modal */}
                      <li className="me-2 button-godown-list-edge">
                        {/* Responsive modal */}
                        {/* <Tooltip title="Add Godown" placement="top"> */}
                        <Link
                          type="button"
                          className="btn btn-primary"
                          to="#"
                          onClick={() => setAddGodown1(true)}
                        >
                          Create Godown
                        </Link>
                        {/* </Tooltip> */}
                        <AddGodown
                          visible={addGodown1}
                          onCancel={() => setAddGodown1(false)}
                          GodownList={GodownList}
                          setGodownList={setGodownList}
                          fetchGodownData={fetchGodownData}
                        />
                      </li>
                    </div>

                    <li className="">
                      <div className="dropdown dropdown-action">
                        <Link
                          to="#"
                          className="btn-filters"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span>
                            <FeatherIcon icon="download" />
                          </span>
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                          <ul className="d-block">
                            <li>
                              <Link
                                className="d-flex align-items-center download-item"
                                to="#"
                                download=""
                                onClick={handlePDFDownloadSet}
                              >
                                <i className="far fa-file-pdf me-2" />
                                PDF
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="d-flex align-items-center download-item"
                                to="#"
                                download=""
                                onClick={handleCSVDownloadSet}
                              >
                                <i className="far fa-file-text me-2" />
                                CVS
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Table */}
            <div className="row godown-edit-delete-box">
              <div className="content-page-header ">
                <div className="col">
                  {selectedGodownData && selectedGodownData.length > 0 ? (
                    <>
                      {selectedGodownData &&
                        selectedGodownData.length > 0 &&
                        selectedGodownData.map((godown) => (
                          <>
                            <h5>{godown.godownName}</h5>
                            <p>
                              {godown.godownStreetAddress},
                              {godown.placeofsupply}
                            </p>
                          </>
                        ))}
                    </>
                  ) : (
                    <>
                      <h4>Select a Godown</h4>
                    </>
                  )}
                </div>

                <div className="list-btn">
                  <ul className="filter-list">
                    <div className="button-list me-2">
                      <button
                        type="button"
                        className="btn edit-button-line  waves-effect waves-light mt-1 me-1"
                        onClick={() => {
                          setEditGodownList1(true);
                        }}
                      >
                        <i class="fa-regular fa-pen-to-square"></i>
                      </button>
                    </div>
                    <div className="button-list me-2">
                      {/* Responsive modal */}
                      <button
                        type="button "
                        className="btn  edit-button-line waves-effect waves-light mt-1 me-1"
                        onClick={() => {
                          handleDeleteGodownListUpdate(true);
                        }}
                      >
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </ul>
                </div>
              </div>
              <div className="col-sm-12 godown-data-selection-table">
                <div>
                  <div
                    style={{
                      marginBottom: 16,
                    }}
                  ></div>
                  <Table
                    rowSelection={{
                      onSelect: handleRowSelect,
                      selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
                      onChange: (selectedRowKeys) => {
                        if (selectedRowKeys.length === 0) {
                          handleClearRowSelection();
                        }
                      },
                    }}
                    columns={columns}
                    dataSource={selectedGodownProducts}
                    rowKey={(record) => record.productId}
                  />
                </div>
              </div>
            </div>

            <Modal
              onCancel={() => setDeleteGodownListModal1(false)}
              closable={false}
              open={deleteGodownListModal1}
              footer={null}
            >
              <div className="form-header">
                <h3 className="update-popup-buttons">Delete Godown</h3>
                <p>Are you sure want to Delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => handledeletegodown(deleteGodownList3)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      // type="submit"
                      onClick={() => setDeleteGodownListModal1(false)}
                      className="w-100 btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              onCancel={() => setUpdateGodownListModal1(false)}
              closable={false}
              open={updateGodownListModal1}
              footer={null}
            >
              <div className="form-header">
                <h3 className="update-popup-buttons">Update Godown Details</h3>
                <p>Are you sure want to update?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => handleUpdate(EditGodownList3)}
                    >
                      Update
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      // type="submit"

                      className="w-100 btn btn-primary paid-cancel-btn"
                      onClick={() => setUpdateGodownListModal1(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              className="add-bank-account-header-line"
              title="Edit Godown"
              onCancel={() => setEditGodownList1(false)}
              open={editGodownList1}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => setEditGodownList1(false)}
                  className="btn btn-secondary waves-effect me-2"
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  className="btn btn-info waves-effect waves-light primary-button"
                  onClick={handleEditFormUpdate}
                  disabled={
                    !selectedvalidation.godownName.isValid ||
                    !selectedvalidation.godownPincode.isValid
                  }
                >
                  Update
                </Button>,
              ]}
            >
              <div className="row">
                <div className="col-lg-12 col-md-6 col-sm-12">
                  <div className="mb-3 form-group">
                    <label>
                      Godown Name{" "}
                      <span className="accountprofilesettings-start-mark">
                        *
                      </span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        !selectedvalidation.godownName.isValid
                          ? "is-invalid"
                          : ""
                      }`}
                      id="field-1"
                      placeholder="Ex. Main FCD Godown"
                      value={selectedformData.godownName}
                      onChange={(e) =>
                        changeSelectedInputForm("godownName", e.target.value)
                      }
                    />
                    {!selectedvalidation.godownName.isValid && (
                      <div className="error-message text-danger">
                        {selectedvalidation.godownName.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-12 col-md-6 col-sm-12">
                  <div className="mb-3 form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      className={`form-control `}
                      id="field-2"
                      value={selectedformData.godownStreetAddress}
                      placeholder="Enter Street Address"
                      onChange={(e) =>
                        changeSelectedInputForm(
                          "godownStreetAddress",
                          e.target.value
                        )
                      }
                    />
                    {/* {!selectedvalidation.godownStreetAddress.isValid && (
                      <div className="error-message text-danger">
                        {selectedvalidation.godownStreetAddress.message}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label>Place of Supply</label>
                    <Select2
                      data={States}
                      onChange={(e) =>
                        changeSelectedInputForm("placeofsupply", e.target.value)
                      }
                      className={`form-select w-100 is-invalid`}
                      options={{
                        placeholder: "Enter state",
                      }}
                      value={selectedformData.placeofsupply}
                    />
                    {/* {!selectedvalidation.placeofsupply.isValid && (
                      <div className="error-message text-danger">
                        {selectedvalidation.placeofsupply.message}
                      </div>
                    )} */}
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        changeSelectedInputForm("godownPincode", e.target.value)
                      }
                      value={selectedformData.godownPincode}
                      className={`form-control`}
                      placeholder="Ex.560038"
                    />
                    {/* {!selectedvalidation.godownPincode.isValid && (
                      <div className="error-message text-danger">
                        {selectedvalidation.godownPincode.message}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3 form-group">
                    <label>City</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        changeSelectedInputForm("godownCity", e.target.value)
                      }
                      value={selectedformData.godownCity}
                      className={`form-control`}
                      id="field-4"
                      placeholder="Boston"
                    />
                    {/* {!selectedvalidation.godownCity.isValid && (
                      <div className="error-message text-danger">
                        {selectedvalidation.godownCity.message}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              className="add-bank-account-header-line"
              title="Adjust Stock Quantity"
              onCancel={handlecloseadjuststock}
              open={transferStock}
              footer={null}
            >
              <TransforStock
                onCancel={handlecloseadjuststock}
                selectedProductId={selectedProductId}
                selectedProductopeningStock={selectedProductopeningStock}
                selectedGodownData={selectedGodownData}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default GodownList;
