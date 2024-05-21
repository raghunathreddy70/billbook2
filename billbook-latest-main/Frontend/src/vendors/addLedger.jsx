import React, { useEffect, useState } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import "../_components/antd.css";
import { Input, Pagination, Space, Table } from "antd";

import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import AddVendor from "./addVendor";
import DatePicker from "react-datepicker";
import axios from 'axios';
import Swal from 'sweetalert2';
import { backendUrl } from "../backendUrl";

const AddLedger = () => {
  const [menu, setMenu] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date: new Date(),
    reference: "",
    mode: "debit",
  });

  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  const [validation, setValidation] = useState({
    name: { isValid: true, message: '' },
    date: { isValid: true, message: '' },
    reference: { isValid: true, message: '' },
    // mode: { isValid: true, message: '' },
  })

  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/addLedger/ledger`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);

  const datasource = data;
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <>
          <h2 className="table-avatar">
            <Link to="/profile" className="avatar avatar-sm me-2">
              <img
                className="avatar-img rounded-circle"
                src={record.img}
                alt="User Image"
              />
            </Link>
            <Link to="/profile">
              {record.name} <span>{record.phone}</span>
            </Link>
          </h2>
        </>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      sorter: (a, b) => a.reference.length - b.reference.length,
    },
    {
      title: "Created",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Mode",
      dataIndex: "mode",
      render: (text, record) => (
        <div>
          {text === "credit" && (
            <span className="text-success-light">{text}</span>
          )}
          {text === "debit" && (
            <span className="text-danger-light">{text}</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="dropdown dropdown-action">
          <Link
            to="#"
            className=" btn-action-icon "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <ul>
              <li>
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#edit_ledger"
                >
                  <i className="far fa-edit me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_modal"
                >
                  <i className="far fa-trash-alt me-2" />
                  Delete
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ),
      sorter: (a, b) => a.action.length - b.action.length,
    },
  ];



  const handleInputForm = (fieldName, value) => {

    let isValid = true;
    let message = '';

    const nameRegex = /^[a-zA-Z\s]*$/;
    const referenceRegex = /^[0-9\s]*$/;
    // const modeRegex = /^\d$/;
    if (fieldName === 'name') {
      isValid = nameRegex.test(value);
      message = "Invalid name"
    } else if (fieldName === 'reference') {
      isValid = referenceRegex.test(value);
      message = "Invalid reference"
    } else if (fieldName === 'date') {
      isValid = value;
      message = ""
    }

    setFormData({
      ...formData,
      [fieldName]: value
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message }

    });


  };

  const validateFormData = (formData) => {
    const validationErrors = {};
    if (!formData.name) {
      validationErrors.name = { isValid: false, message: 'please enter a name' };
    }
    if (!formData.reference) {
      validationErrors.reference = { isValid: false, message: 'please enter a reference' };
    }
    if (!formData.date) {
      validationErrors.date = { isValid: false, message: 'please enter a date' };
    }
    return validationErrors;
  }
  const handleSubmit = async () => {
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation(prevValidation => ({
        ...prevValidation,
        ...validationErrors
      }));
      return;
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/addLedger/ledger`,
        formData
      );

      console.log('Data submitted successfully:', response.data);

      fetchData();

      // Show SweetAlert success notification
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Data submitted successfully.',
      });
    } catch (error) {
      console.error('Error submitting data:', error);

      // Show SweetAlert error notification
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error submitting the data. Please try again.',
      });
    }
  };
  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar active={3} />
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Ledger</h5>
                <div className="searchbar-filter">
                  <Input className="searh-input"
                    placeholder="Search by name or phone number"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300, marginBottom: 0, padding: "6px 12px", border: "none", boxShadow: "rgba(149, 157, 165, 0.2) 2px 2px 9px" }}
                  />
                  <Space>
                    <button onClick={handleReset} size="small" style={{ width: 90, padding: 7, background: "#ed2020", border: "none", boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)", borderRadius: 7, color: "#fff" }}>
                      Reset
                    </button>
                  </Space>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    <li>
                      <Link className="btn btn-filters w-auto popup-toggle">
                        <span className="me-2">
                          <FeatherIcon icon="filter" />
                        </span>
                        Filter{" "}
                      </Link>
                    </li>
                    <li>
                      <Link className="btn-filters" to="#">
                        <span>
                          <FeatherIcon icon="grid" />
                        </span>{" "}
                      </Link>
                    </li>
                    <li>
                      <Link className="active btn-filters" to="#">
                        <span>
                          <FeatherIcon icon="list" />
                        </span>{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="btn btn-primary"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add_ledger"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Create Ledger
                      </Link>
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
                  <div className="card-body ledger">
                    <div className="table-responsive table-striped table-hover">
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
                            record?.name
                              ?.toLowerCase()
                              .includes(searchText.toLowerCase()) ||
                            record?.reference?.includes(searchText) ||
                            record?.date?.toLowerCase().includes(searchText.toLowerCase())
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

        <AddVendor />

        {/* Add Ledger */}
        <div className="modal custom-modal fade" id="add_ledger" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Ledger</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Name<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${!validation.name.isValid ? "is-invalid" : ""}`}
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={(e) => handleInputForm('name', e.target.value)}
                      />
                      {!validation.name.isValid && (
                        <div className="error-message text-danger">{validation.name.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Date<span className="text-danger">*</span></label>
                      <div className="cal-icon cal-icon-info">
                        <DatePicker
                          className={`datetimepicker form-control ${!validation.date.isValid ? "is-invalid" : ""} `}
                          selected={formData.date}
                          onChange={(date) => handleInputForm('date', date)}
                        ></DatePicker>
                        {!validation.date.isValid && (
                          <div className="error-message text-danger">{validation.date.message}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Reference<span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className={`form-control ${!validation.reference.isValid ? "is-invalid" : ""}`}
                        placeholder="Enter Reference Number"
                        value={formData.reference}
                        onChange={(e) => handleInputForm('reference', e.target.value)}
                      />
                      {!validation.reference.isValid && (
                        <div className="error-message text-danger">{validation.reference.message}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group d-inline-flex align-center mb-0">
                      <label className="me-5 mb-0">Mode<span className="text-danger">*</span></label>
                      <div>
                        <label className="custom_radio me-3 mb-0">
                          <input
                            type="radio"
                            name="payment"
                            value="debit"
                            checked={formData.mode === "debit"}
                            onChange={() => setFormData({ ...formData, mode: "debit" })}
                          />
                          <span className="checkmark" /> Debit
                        </label>
                        <label className="custom_radio mb-0">
                          <input
                            type="radio"
                            name="payment"
                            value="credit"
                            checked={formData.mode === "credit"}
                            onChange={() => setFormData({ ...formData, mode: "credit" })}
                          />
                          <span className="checkmark" /> Credit
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  // data-bs-dismiss="modal"
                  className="btn btn-primary paid-continue-btn"
                  onClick={handleSubmit}
                >
                  Submit
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Ledger */}

        {/* Edit Ledger */}
        <div className="modal custom-modal fade" id="edit_ledger" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Edit Ledger</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="John Smith"
                        placeholder="Enter Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="19 Dec 2022"
                        placeholder="Select Date"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Reference</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={25689825}
                        placeholder="Enter Reference Number"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <label>Mode</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Credit"
                        placeholder="Enter Reference Number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </Link>
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-continue-btn"
                >
                  Update
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Edit Ledger */}

        {/* Delete Ledger */}
        <div
          className="modal custom-modal fade"
          id="delete_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Ledger</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="submit"
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
        {/* /Delete Ledger */}
      </div>
    </>
  );
};

export default AddLedger;
