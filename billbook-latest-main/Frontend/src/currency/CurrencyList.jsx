import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import "../_components/antd.css";
import { Input, Pagination, Space, Table, Tooltip } from "antd";
import Data from "../assets/jsons/expenses";
import FeatherIcon from "feather-icons-react";
import { Button, Modal } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import { async } from "regenerator-runtime";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import useHandleDownload from "../Hooks/useHandleDownload";
import { format } from "date-fns";
import { backendUrl } from "../backendUrl";
import { IoIosSearch } from "react-icons/io";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import { useSelector } from "react-redux";

const CurrencyList = () => {
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const { id } = useParams();
  const [addCurrency1, setAddCurrency1] = useState(false);

  const [editingData, setEditingData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [currencyData, setcurrencyData] = useState([]);
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

  const handleEdit = (record) => {
    setEditingData(record);
    setEditingId(record.id);
  };
  const [editCurrency1, setEditCurrency1] = useState(false);
  const [cityName, setCityName] = useState();
  const [currency, setCurrency] = useState();
  const [currencyValue, setCurrencyValue] = useState();

  const [validation, setValidation] = useState({
    cityName: { isValid: true, message: "" },
  });
  const [validation1, setValidation1] = useState({
    currency: { isValid: true, message: "" },
  });
  const [validation2, setValidation2] = useState({
    currencyValue: { isValid: true, message: "" },
  });

  const handlecityName = (fieldName, value) => {
    const cityRegex = /^[a-zA-Z\s]*$/;

    // Validation logic
    const isValid = cityRegex.test(value);
    setCityName(value);
    setValidation({
      cityName: {
        isValid,
        message: isValid
          ? ""
          : "Invalid city name (only letters and spaces allowed)",
      },
    });
    setEditingData((prevData) => ({
      ...prevData,
      cityName: value,
    }));
  };

  const handlecurrency = (fieldName, value) => {
    const currencyCodeRegex = /^[a-sA-Z]{3}$/;
    // Validation logic
    const isValid = currencyCodeRegex.test(value);
    setCurrency(value);
    setValidation1({
      currency: {
        isValid,
        message: isValid ? "" : "Invalid currency (enter three currency type)",
        message: isValid ? "" : "Invalid currency (only values allowed)",
      },
    });
    setEditingData((prevData) => ({
      ...prevData,
      currency: value,
    }));
  };

  const handlecurrencyValue = (fieldName, value) => {
    const currencyValueRegex = /^[0-9\s]*$/;

    // Validation logic
    const isValid = currencyValueRegex.test(value);
    setCurrencyValue(value);
    setValidation2({
      currencyValue: {
        isValid,
        message: isValid ? "" : "Invalid currency (only values allowed)",
      },
    });

    setEditingData((prevData) => ({
      ...prevData,
      currencyValue: value,
    }));
  };

 

  const fetchcurrencyData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/AddCurrency/currency/${userData?.data?._id}`
      );
      setcurrencyData(response.data);
    } catch (error) {
      console.log("currencydata", currencyData);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchcurrencyData();
  }, [userData]);

  const [editCurrencyData, setEditCurrencyData] = useState("");

  const handleEditCurrencyData = (value) => {
    setEditCurrencyData(value);
    setEditCurrency1(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = editingData._id;
    if (!editingData) {
      console.error("No data to update.");
      return;
    }

    const { cityName, currency, currencyValue } = editingData;

    const updatedData = {
      cityName,
      currency,
      currencyValue,
    };

    try {
      const response = await axios.put(
        `${backendUrl}/api/AddCurrency/currencyedit/${id}`,
        updatedData
      );

      if (response.status === 200) {
        toast.success("Currency Added Succesfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        fetchcurrencyData();

        $("#edit_expenses").modal("hide");
        // window.location.reload();
      } else {
        toast.error("Failed to update Currency. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while updating the Currency.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      window.location.reload();
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error("ID is null or undefined");
        return;
      }

      const response = await axios.delete(
        `${backendUrl}/api/AddCurrency/deletecurrency/${id}`
      );
      if (response.status === 200) {
        fetchcurrencyData();
      } else {
        console.error("Failed to delete currency record. Please try again.");
      }
    } catch (error) {
      console.error(
        "An error occurred while deleting the currency record:",
        error
      );
    }
  };

  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);

  const [searchText, setSearchText] = useState("");

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const datasource = currencyData;

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };
  const [deleteUpdating, setDeleteUpdating] = useState("");
  const [Currencyid, setCurrencyid] = useState("");

  const handleselectedcurrencyidDelete = (value) => {
    setCurrencyid(value);
    setDeleteUpdating(true);
  };
  const confirmDeleteCurrency = async (id) => {
    try {
      if (!id) {
        console.error("ID is null or undefined");
        return;
      }

      const response = await axios.delete(
        `${backendUrl}/api/AddCurrency/deletecurrency/${id}`
      );

      if (response.status === 200) {
        // If deletion is successful, fetch the updated currency data
        fetchcurrencyData();
        // Optionally, you can display a success message
        toast.success("Currency deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.error("Failed to delete currency record. Please try again.");
        // Optionally, you can display an error message
        toast.error("Failed to delete currency record. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error(
        "An error occurred while deleting the currency record:",
        error
      );
      // Optionally, you can display an error message
      toast.error("An error occurred while deleting the currency record:", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const columns = [
    {
      title: "City Name",
      dataIndex: "cityName",
    },
    {
      title: "Currency",
      dataIndex: "currency",
    },
    {
      title: "Currency Value",
      dataIndex: "currencyValue",
    },

    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center gap-1">


            <Link
              className="btn-action-icon action-delete-icon"
              to="#"
              onClick={() => {
                handleEdit(record);
                setEditCurrency1(true);
              }}
            >
              <EditButton />
            </Link>

            <Modal
              className="add-bank-account-header-line"
              title="Edit Currency"
              onCancel={() => setEditCurrency1(false)}
              open={editCurrency1}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => setEditCurrency1(false)}
                  className="btn btn-secondary waves-effect me-2"
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  data-bs-toggle="modal"
                  data-bs-target="#edit_update_modal"
                  className="btn btn-info waves-effect waves-light primary-button"
                  onClick={handleEditCurrencyData}
                >
                  Update
                </Button>,
              ]}
            >
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>
                      Country Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${!validation.cityName.isValid ? "is-invalid" : ""
                        }`}
                      placeholder="Enter Country Name"
                      value={editingData?.cityName || ""}
                      onChange={(e) =>
                        handlecityName("cityName", e.target.value)
                      }
                    />
                    {!validation.cityName.isValid && (
                      <div className="error-message text-danger">
                        {validation.cityName.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>
                      Currency<span className="text-danger">*</span>
                    </label>
                    <input
                      className={`form-control ${!validation1.currency.isValid
                        ? "is-invalid"
                        : ""
                        }`}
                      type="text"
                      placeholder="Enter Currency Value"
                      value={editingData?.currency || ""}
                      onChange={(e) =>
                        handlecurrency("currency", e.target.value)
                      }
                    />
                    {!validation1.currency.isValid && (
                      <div className="error-message text-danger">
                        {validation1.currency.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>
                      Currency Value
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      className={`form-control ${!validation2.currencyValue.isValid
                        ? "is-invalid"
                        : ""
                        }`}
                      type="text"
                      placeholder="Enter Currency Value"
                      value={editingData?.currencyValue || ""}
                      onChange={(e) =>
                        handlecurrencyValue(
                          "currencyValue",
                          e.target.value
                        )
                      }
                    />
                    {!validation2.currencyValue.isValid && (
                      <div className="error-message text-danger">
                        {validation2.currencyValue.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Modal>

            <Link
              className="btn-action-icon action-delete-icon"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal"
              onClick={() =>
                handleselectedcurrencyidDelete(record._id)
              }
            >
              <DeleteButton />
            </Link>
          </div>

        </>
      ),
    },
  ];

  const validateFormData = () => {
    const validationErrors = {};

    if (!cityName) {
      validationErrors.cityName = {
        isValid: false,
        message: "Please enter a cityName",
      };
      console.error("Please enter a percentage");
    }

    if (!currency) {
      validationErrors.currency = {
        isValid: false,
        message: "Please enter a currency",
      };
      console.error("Please enter percentage value");
    }
    if (!currencyValue) {
      validationErrors.currencyValue = {
        isValid: false,
        message: "Please enter a currency value",
      };
      console.error("Please enter percentage value");
    }
    return validationErrors;
  };

  const userData = useSelector((state) => state?.user?.userData)


  const handlecurrencyData = async (e) => {
    e.preventDefault();

    const CurrencyData = {
      cityName,
      currency,
      currencyValue,
    };

    const validationErrors = validateFormData();
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      setValidation1((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      setValidation2((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/AddCurrency/currency`,
        {...CurrencyData, businessId : userData?.data?._id}
      );

      if (response.status === 201) {
        // Update the local state with the newly added currency
        setcurrencyData((prevData) => [...prevData, response.data]);
        toast.success("Currency added successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("Failed to add Currency. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while adding the currency.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error("Error:", error);
    } finally {
      setAddCurrency1(false);
    }
  };

  useEffect(() => {
    let downloadableData = datasource;
    setDownloadData(downloadableData);
  }, [datasource]);

  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "City Name": item?.cityName,
      Currency: item?.currency,
      "Currency Value": item?.currencyValue,
    }));

    // Define CSV headers
    const headers = [
      { label: "City Name", key: "cityName" },
      { label: "Currency", key: "currency" },
      { label: "Currency Value", key: "currencyValue" },
    ];
    // Add more he

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = ["City Name", "Currency", "Currency Value"];
    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.cityName,
      item?.currency,
      item?.currencyValue,
    ]);
    handlePDFDownload({ columns, rows, heading: "Currency" });
  };

  // download data in pdf format code goes here

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Currency</h5>
                <div className="searchbar-filter">
                  <Input
                    prefix={<IoIosSearch />}
                    className="searh-input"
                    placeholder="Search by name or phone number"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                      width: 300,
                      marginBottom: 0,
                      padding: "6px 12px",
                      border: "none",
                      boxShadow: "rgba(149, 157, 165, 0.2) 2px 2px 9px",
                    }}
                  />
                  {/* <Space>
                    <button onClick={handleReset} size="small" style={{ width: 90, padding: 7, background: "#ed2020", border: "none", boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)", borderRadius: 7, color: "#fff" }}>
                      Reset
                    </button>
                  </Space> */}
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    <li>
                      <Tooltip title="Add Currency" placement="top">
                        <Link
                          className="btn btn-primary"
                          type="primary"
                          to="#"
                          onClick={() => setAddCurrency1(true)}
                        >
                          <i
                            className="fa fa-plus-circle me-2"
                            aria-hidden="true"
                          />
                          Add Currency
                        </Link>
                      </Tooltip>

                      <Modal
                        className="add-bank-account-header-line"
                        title="Add Currency"
                        onCancel={() => setAddCurrency1(false)}
                        open={addCurrency1}
                        footer={[
                          <Button
                            key="cancel"
                            onClick={() => setAddCurrency1(false)}
                            className="btn btn-secondary waves-effect me-2"
                          >
                            Cancel
                          </Button>,
                          <Button
                            key="submit"
                            type="primary"
                            className="btn btn-info waves-effect waves-light primary-button"
                            onClick={handlecurrencyData}
                          >
                            Add Currency
                          </Button>,
                        ]}
                      >
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                Country Name<span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${!validation.cityName.isValid
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                placeholder="Enter Country Name"
                                value={cityName}
                                onChange={(e) =>
                                  handlecityName("name", e.target.value)
                                }
                              // onChange={handlecityName}
                              />
                              {!validation.cityName.isValid && (
                                <div className="error-message text-danger">
                                  {validation.cityName.message}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                Currency<span className="text-danger">*</span>
                              </label>
                              <input
                                className={`form-control ${!validation1.currency.isValid
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                type="text"
                                placeholder="Ex: INR"
                                value={currency}
                                onChange={(e) =>
                                  handlecurrency("currency", e.target.value)
                                }
                              />
                              {!validation1.currency.isValid && (
                                <div className="error-message text-danger">
                                  {validation1.currency.message}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                Currency Value
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className={`form-control ${!validation2.currencyValue.isValid
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                placeholder="Enter Currency Value"
                                value={currencyValue}
                                onChange={(e) =>
                                  handlecurrencyValue(
                                    "currencyValue",
                                    e.target.value
                                  )
                                }
                              />
                              {!validation2.currencyValue.isValid && (
                                <div className="error-message text-danger">
                                  {validation2.currencyValue.message}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Modal>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Table */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body purchase">
                    <div className="table-responsive table-hover">
                      <Table
                        pagination={{
                          total: datasource ? datasource.length : 0,

                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={datasource.filter(
                          (record) =>
                            record?.cityName
                              ?.toLowerCase()
                              .includes(searchText.toLowerCase()) ||
                            record?.currency
                              ?.toLowerCase()
                              .includes(searchText.toLowerCase())
                        )}
                        rowKey={(record) => record.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Table */}
          </div>
        </div>

        <AddVendor setShow={setShow} show={show} />

        <div
          className="modal custom-modal fade"
          id="delete_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Currency</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                        onClick={() => confirmDeleteCurrency(Currencyid)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        // type="submit"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal custom-modal fade"
          id="edit_update_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>update Currency</h3>
                  <p>Are you sure want to update?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                        onClick={() => handleUpdate(editCurrencyData)}
                      >
                        Update
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        // type="submit"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CurrencyList;
