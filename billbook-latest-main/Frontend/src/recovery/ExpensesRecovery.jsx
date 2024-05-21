
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import "../_components/antd.css";
import Data from "../assets/jsons/expenses";
import FeatherIcon from "feather-icons-react";
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import { Input, Pagination, Space, Table } from "antd";
import { search } from "../_components/imagepath";
const ExpensesRecovery = () => {

  const [currencyOptions, setcurrencyOptions] = useState([
    { id: 1, text: "0" },
    { id: 2, text: "1" },
    { id: 3, text: "2" },
    { id: 4, text: "3" },
  ]);

  const [currencyOptions1, setcurrencyOptions1] = useState([
    { id: 1, text: "Bank Fee and Charges" },
    { id: 2, text: "Employee Salaries & Advances" },
    { id: 3, text: "Bank Fee and Charges" },
    { id: 4, text: "Employee Salaries & Advances" },
  ]);

  const [isEnabled, setIsEnabled] = useState(false);

  const handleCheckboxChange = () => {
    setIsEnabled(!isEnabled);
  };
  const [formData, setFormData] = useState({
    expenseId: '',
    reference: '',
    amount: '',
    mode: '',
    expenseDate: '',
    paymentStatus: '',
    attachment: '',

  })
  const [validation, setValidation] = useState({
    expenseId: { isValid: true, message: '' },
    reference: { isValid: true, message: '' },
    amount: { isValid: true, message: '' },
    mode: { isValid: true, message: '' },
    expenseDate: { isValid: true, message: '' },
    paymentStatus: { isValid: true, message: '' },
    attachment: { isValid: true, message: '' },
  })

  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [searchText, setSearchText] = useState("");

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const [product, setProduct] = useState([
    { id: 1, text: "Select Payment Mode" },
    { id: 2, text: "Cash" },
    { id: 3, text: "Cheque" }
  ]);

  const [payment, setPayment] = useState([
    { id: 1, text: "Select Payment Status" },
    { id: 2, text: "Paid" },
    { id: 3, text: "Payment" },
    { id: 4, text: "Pending" }
  ]);

  const datasource = Data?.Data;
  console.log(datasource);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "Id",
      sorter: (a, b) => a.Id.length - b.Id.length,
    },
    {
      title: "Expense Number",
      dataIndex: "ExpenseID",
      sorter: (a, b) => a.ExpenseID.length - b.ExpenseID.length,
    },
    {
      title: "Expense Number",
      dataIndex: "Reference",
      sorter: (a, b) => a.Reference.length - b.Reference.length,
    },
    {
      title: "Party Name",
      dataIndex: "Amount",
      sorter: (a, b) => a.Amount.length - b.Amount.length,
    },

    {
      title: "Category",
      dataIndex: "Payment",
      sorter: (a, b) => a.Payment.length - b.Payment.length,
    },
    {
      title: "Amount",
      dataIndex: "Notes",
      sorter: (a, b) => a.Notes.length - b.Notes.length,
    },
  ];

  const handleAttachmentForm = (e) => {
    const fileList = e.target.value;
    console.log(fileList);
    setFormData([...formData, ...fileList]);
  }
  const handleInputForm = (fieldName, value) => {
    let isValid = true;
    let message = '';

    const numberRegex = /^\d+$/;

    if (fieldName === 'expenseId') {
      isValid = numberRegex.test(value);
      message = 'Invalid expense Id'
    }
    else if (fieldName === 'reference') {
      isValid = numberRegex.test(value);
      message = 'Invalid Reference numder'
    }
    else if (fieldName === 'amount') {
      isValid = numberRegex.test(value);
      message = 'Invalid amount'
    } else if (fieldName === 'mode') {
      isValid = value;
      message = 'Invalid mode'
    } else if (fieldName === 'expenseDate') {
      isValid = value;
      message = 'Invalid expenseDate'
    }

    setFormData({
      ...formData,
      [fieldName]: value
    });
    setValidation({
      ...validation,
      [fieldName]: { isValid, message }

    });
  }
  const validateFormData = (formData) => {
    const validationErrors = {};
    if (!formData.expenseId) {
      validationErrors.expenseId = { isValid: false, message: 'please enter a expense id' };
    }
    if (!formData.reference) {
      validationErrors.reference = { isValid: false, message: 'please enter a reference number' };
    } if (!formData.amount) {
      validationErrors.amount = { isValid: false, message: 'please enter a amount' };
    } if (!formData.mode) {
      validationErrors.mode = { isValid: false, message: 'please enter a mode' };
    } if (!formData.expenseDate) {
      validationErrors.expenseDate = { isValid: false, message: 'please enter a expense date' };
    }
    if (!formData.paymentStatus) {
      validationErrors.paymentStatus = { isValid: false, message: 'please enter a payment Status' };
    }
    return validationErrors;
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);

    if (Object.keys(validationErrors).length > 0) {
      setValidation(prevValidation => ({
        ...prevValidation,
        ...validationErrors
      }));
      return;
    }

  }
  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar active={20} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                {/* <h5>Expenses</h5> */}
                {/* <div className="searchbar-filter">
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
                </div> */}
                {/* <div className="list-btn">
                  <ul className="filter-list"> */}
                {/* <li>
                      <Link className="btn btn-filters w-auto popup-toggle"
                        onClick={() => setShow(!show)}
                      >
                        <span className="me-2">
                          <FeatherIcon icon="filter" />
                        </span>
                        Filter{" "}
                      </Link>
                    </li>
                    <li>
                      <Link className="btn-filters" to="#" data-bs-toggle="modal" data-bs-target="#con-close-modal">
                        <span>
                          <FeatherIcon icon="settings" />
                        </span>{" "}
                      </Link>
                    </li> */}
                {/* <li>
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
                    </li> */}
                {/* <li>
                      <Link
                        className="btn btn-primary"
                        to="/add-expenses"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Expenses
                      </Link>
                    </li>
                  </ul>
                </div> */}
              </div>
              <div className="table-filter">
                <div className="row">
                  <div className="col-md-4 expenses-search">
                    <div className="top-nav-search m-0">
                      <form className="m-0">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search here"
                          style={{ height: "46px" }}
                        />
                        <button className="btn" type="submit">
                          <img src={search} alt="img" />
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12 expenses-search">
                    <RangePicker style={{ height: "46px" }} />
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="form-group">
                      <Select2
                        className="w-100"
                        data={currencyOptions1}
                        options={{
                          placeholder: "All Expenses Categories",
                        }}
                      />
                    </div>
                  </div>
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
                        dataSource={datasource.filter((record) =>
                          record?.Amount?.includes(searchText) ||
                          record?.Reference
                            ?.includes(searchText) ||
                          record?.ExpenseID?.toLowerCase().includes(searchText.toLowerCase()) ||
                          record?.Attachment?.toLowerCase().includes(searchText.toLowerCase())
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


        <div className="modal custom-modal fade" id="edit_expenses" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Edit Expenses</h4>
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
                      <label>Expense ID</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="EXP-148061"
                        placeholder="Enter Name"
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
                    <div className="form-group">
                      <label>Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="1,54,220"
                        placeholder="Select Date"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Cash"
                        placeholder="Enter Payment Mode"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Expense Date</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="29 Jan 2022"
                        placeholder="Enter Expense Date"
                      />
                    </div>
                  </div>
                  {/* <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Cash"
                        placeholder="Enter Payment Mode"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Attachment</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Attachment"
                        placeholder="Enter Attachment Number"
                      />
                    </div>
                  </div> */}
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <label>Notes</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Notes"
                        placeholder="Enter Notes Number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </a>
                <a
                  href="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-continue-btn"
                >
                  Update
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="modal custom-modal fade" id="delete_modal" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Expenses</h3>
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

      </div>
    </>
  );
};
export default ExpensesRecovery;
