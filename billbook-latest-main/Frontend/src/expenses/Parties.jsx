import Papa from 'papaparse';
import React, { useState, useEffect } from "react";
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
import AddVendor from '../vendors/addVendor';;
import axios from 'axios';
import Swal from 'sweetalert2';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import { Button, Modal } from 'antd';

import useHandleDownload from '../Hooks/useHandleDownload';
import { format } from 'date-fns';
import { AddPartiesData } from './AddPartiesData';

const Parties = () => {
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();

  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [addParty1, setAddParty1] = useState(false);
  const [editParty1, setEditParty1] = useState(false);
  console.log("datasource", datasource)
  const [formData, setFormData] = useState({
    partyName: "",
    phoneNumber: "",
  });
  const [validation, setValidation] = useState({
    partyName: { isValid: true, message: '' },
    phoneNumber: { isValid: true, message: '' },

  })
  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);

  useEffect(() => {
    if (toggleTabsState !== 1 && toggleTabsState !== 2 && toggleTabsState !== 3) {
      setToggleTabsState(0)
    }
  }, [toggleTabsState])

  useEffect(() => {
    let downloadableData = datasource;
    setDownloadData(downloadableData)
  }, [datasource])

  // download data in csv format code goes here 
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item, i) => ({
      "No.": i + 1,
      "Name": item?.partyName,
      "Phone": item?.phoneNumber,
    }));

    // Define CSV headers
    const headers = [
      { label: 'No.', key: 'expenseNumber' },
      { label: 'Name', key: 'partyName' },
      { label: 'Phone', key: 'phoneNumber' },
    ];

    handleCSVDownload({ csvData, headers })
  };
  // download data in csv format code goes here 



  // download data in pdf format code goes here 

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = ['No.', 'Name', 'Phone'];
    // Set up table rows
    const rows = downloadData.map((item, i) => [
      i + 1,
      item?.partyName,
      item?.phoneNumber,
      // Add more fields as needed
    ]);
    handlePDFDownload({ columns, rows, heading: 'Parties' })
  };

  // download data in pdf format code goes here 

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };


  const [editingData, setEditingData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [vendorData, setVendorData] = useState([]);

  const handleEdit = (record) => {
    setEditingData(record);
    setEditingId(record.id);
  };


  useEffect(() => {
    axios.get("http://localhost:8000/api/Parties/party")
      .then(response => {
        const dataWithIds = response.data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));

        setDatasource(dataWithIds);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  const handleInputChange = (fieldName, value) => {
    setEditingData(prevData => ({
      ...prevData,
      [fieldName]: value
    }));
  };
  // edit update
  const [editVendorid, setEditvendorid] = useState("");

  const editvendorsidUpdate = (value) => {
    setEditvendorid(value);
  }

  // delete update
  const [vendorsid, setvendorsid] = useState("");

  const handleselectedvendoridDelete = (value) => {
    setvendorsid(value);
  }

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "Name",
      dataIndex: "partyName",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              className=" btn-action-icon me-2"
              to="#"
              onClick={() => {
                handleEdit(record);
                setEditParty1(true);
              }}
            >
              <div className="bg-[#e1ffed] p-2 me-1  rounded">
                <FeatherIcon icon="edit" className="text-[#1edd6a] " />
              </div>
            </Link>

            <Link
              className=" btn-action-icon"
              to="#"
              onClick={() => handleDelete(record._id)}
            >
              <div className=" bg-[#ffeded] p-2 me-1  rounded">
                <FeatherIcon icon="trash-2" className="text-[#ed2020]" />
              </div>
            </Link>
          </div>
        </>
      ),
    },
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = editingData._id;
    if (!editingData) {
      console.error('No data to update.');
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/Parties/party/${id}`,
        editingData
      );

      if (response.status === 200) {
        setDatasource(prevDatasource =>

          prevDatasource.map(item => item.id === id ? editingData : item)
        );
        toast.success("Party updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        window.location.reload();

      } else {
        toast.error("Failed to update Party. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while updating the GST.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      window.location.reload();
      console.error('Error:', error);
    }
  };



  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error("ID is null or undefined");
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/api/Parties/deleteparty/${id}`
      );

      if (response.status === 204) {
        // Remove the deleted item from the datasource
        // setDatasource(prevDatasource => prevDatasource.filter(item => item.id !== id));
        console.log("deleted successfully")
        toast.success("Party deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        }); window.location.reload();
      } else {
        console.error("Failed to delete currency record. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while deleting the currency record:", error);
      toast.error("Error submitting data", {
        position: toast.POSITION.TOP_RIGHT,
      }); window.location.reload();
    }
  };


  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar active={7} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header ">
                <h5>Parties</h5>
                <div className="searchbar-filter">
                  <Input className="searh-input"
                    placeholder="Search by name or phone number"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300, marginBottom: 0, padding: "6px 12px", border: "none", boxShadow: "rgba(149, 157, 165, 0.2) 2px 2px 9px", height: '36px' }}
                  />
                  <Space>
                    <button onClick={handleReset} size="small" style={{ width: 90, padding: 7, background: "#ed2020", border: "none", boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)", borderRadius: 7, color: "#fff" }}>
                      Reset
                    </button>
                  </Space>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">

                    <li className="">
                      <div className="dropdown dropdown-action">
                        <Link
                          to="#"
                          className="btn-filters me-2 btn btn-primary"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span>
                            <FeatherIcon icon="download" />
                          </span>
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
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
                                CSV
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    {/* <CSVLink {...csvContent} id="csv-link" style={{ display: 'none' }}>
        Download CSV
      </CSVLink> */}
                    <li>
                      <Link
                        className="btn btn-primary"
                        to="#" onClick={() => setAddParty1(true)}
                      >
                        <i
                          className="fa fa-plus-circle "
                          aria-hidden="true"
                        />

                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Search Filter */}
            <div id="filter_inputs" className="card filter-card">
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>


                  <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Search Filter */}
            <div className="row">
              <div className="col-sm-12">
                <div className=" card-table">
                  <div className="card-body vendors">
                    <div className="table-responsive table-hover table-striped">
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
                          (record?.partyName?.toLowerCase().includes(searchText.toLowerCase())) ||
                          (record?.phoneNumber?.toString().includes(searchText))
                        )}
                        rowKey={(record) => record.id}
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddVendor
          setShow={setShow}
          show={show}
        //onAddVendor={handleAddVendor}
        />

        {/* <div className="modal custom-modal fade" id="add_vendor" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Parties</h4>
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
                  <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                      <label >Name<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${!validation.partyName.isValid ? "is-invalid" : ""}`}
                        placeholder="Enter Name"

                        value={formData.partyName}
                        onChange={(e) => handleInputForm('partyName', e.target.value)}
                      />
                      {!validation.partyName.isValid && (
                        <div className="error-message text-danger">{validation.partyName.message}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                      <label>Phone Number<span className="text-danger">*</span></label>
                      <input
                        type="Phonenumber"
                        className={`form-control ${!validation.phoneNumber.isValid ? "is-invalid" : ""}`}
                        placeholder="Enter Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputForm("phoneNumber", e.target.value)}
                      />
                      {!validation.phoneNumber.isValid && (
                        <div className="error-message text-danger">{validation.phoneNumber.message}</div>
                      )}
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
        </div> */}
        <AddPartiesData
          visible={addParty1}
          onCancel={() => setAddParty1(false)}
          datasource={datasource}
          setDatasource={setDatasource}
        />

        <Modal
          className="add-bank-account-header-line add-godown-styles"
          title="Edit Parties"
          onCancel={() => setEditParty1(false)}
          open={editParty1}
          footer={[
            <Button key="cancel" onClick={() => setEditParty1(false)}
              className="btn btn-secondary waves-effect me-2">
              Cancel
            </Button>,
            <Button key="submit" type="primary"
              className="btn btn-info waves-effect waves-light primary-button"
              data-bs-toggle="modal"
              data-bs-target="#edit_update_modal"
              onClick={editvendorsidUpdate}>
              Update
            </Button>,]}
        >
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <div className="form-group">
                <label >Name<span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${!validation.partyName.isValid ? "is-invalid" : ""}`}
                  placeholder="Enter Name"
                  value={editingData?.partyName || ''}
                  onChange={(e) => handleInputChange('partyName', e.target.value)}
                />

                {!validation.partyName.isValid && (
                  <div className="error-message text-danger">{validation.partyName.message}</div>
                )}
              </div>
            </div>

            <div className="col-lg-12 col-sm-12">
              <div className="form-group">
                <label>Phone Number<span className="text-danger">*</span></label>
                <input
                  type="number"
                  className={`form-control ${!validation.phoneNumber.isValid ? "is-invalid" : ""}`}
                  placeholder="Enter Phone Number"
                  value={editingData?.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
                {!validation.phoneNumber.isValid && (
                  <div className="error-message text-danger">{validation.phoneNumber.message}</div>
                )}
              </div>
            </div>

          </div>
        </Modal>
        {/* <div className="modal custom-modal fade" id="edit_vendor" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Edit Vendor</h4>
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
                  <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                      <label >Name<span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${!validation.partyName.isValid ? "is-invalid" : ""}`}
                        placeholder="Enter Name"
                        value={editingData?.partyName || ''}
                        onChange={(e) => handleInputChange('partyName', e.target.value)}
                      />

                      {!validation.partyName.isValid && (
                        <div className="error-message text-danger">{validation.partyName.message}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                      <label>Phone Number<span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className={`form-control ${!validation.phoneNumber.isValid ? "is-invalid" : ""}`}
                        placeholder="Enter Phone Number"
                        value={editingData?.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      />
                      {!validation.phoneNumber.isValid && (
                        <div className="error-message text-danger">{validation.phoneNumber.message}</div>
                      )}
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
                  data-bs-toggle="modal"
                  data-bs-target="#edit_update_modal"
                  className="btn btn-primary paid-continue-btn"
                  onClick={editvendorsidUpdate}
                >
                  Update
                </Link>
              </div>
            </div>
          </div>
        </div> */}

        <div
          className="modal custom-modal fade"
          id="delete_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Vendor</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                        onClick={() => handleDelete(vendorsid)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        // type="submit"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
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
                  <h3>Update Party</h3>
                  <p>Are you sure want to update?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                        onClick={() => handleUpdate(editVendorid)}
                      >
                        update
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

export default Parties;
