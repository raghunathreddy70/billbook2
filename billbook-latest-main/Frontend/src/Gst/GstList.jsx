import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Input, Pagination, Space, Table, Tooltip } from "antd";
import Data from "../assets/jsons/expenses";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import { Button, Modal } from "antd";
import AddGst from "./AddGst";

import useHandleDownload from "../Hooks/useHandleDownload";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import { useSelector } from "react-redux";

const GstList = () => {
  const [editGst1, setEditGst1] = useState(false);
  const [addGst, setAddGst] = useState(false);
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const { id } = useParams();
  const [editingData, setEditingData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const userData = useSelector((state) => state?.user?.userData);

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
    setEditGst1(true);
  };

  const [gstData, setGstData] = useState([]);

  const [gstPercentageName, setGstPercentageName] = useState();

  const [gstPercentageValue, setGstPercentageValue] = useState();

  const [validation, setValidation] = useState({
    gstPercentageName: { isValid: true, message: "" },
  });
  const [validation1, setValidation1] = useState({
    gstPercentageValue: { isValid: true, message: "" },
  });

  const handleGstPercentageName = (fieldName, value) => {
    const percentageRegex = /^(100(\.0{1,2})?|\d{1,2}(\.\d{1,2})?)%?$/;
    const isValid = percentageRegex.test(value);

    setGstPercentageName(value);
    setValidation({
      gstPercentageName: {
        isValid,
        message: isValid ? "" : "Invalid (only letters and spaces allowed)",
      },
    });

    setEditingData((prevData) => ({
      ...prevData,
      gstPercentageName: value,
    }));
  };

  const handleGstPercentageValue = (fieldName, value) => {
    const percentagevalueRegex = /^\d+$/;

    const isValid = percentagevalueRegex.test(value);
    setGstPercentageValue(value);
    setValidation1({
      gstPercentageValue: {
        isValid,
        message: isValid ? "" : "Invalid (only values allowed)",
      },
    });

    setEditingData((prevData) => ({
      ...prevData,
      gstPercentageValue: value,
    }));
  };

  const confirmDeleteGst = async (id) => {
    try {
      if (!id) {
        console.error("ID is null or undefined");
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/api/addgst/deletegst/${id}`
      );

      if (response.status === 200) {
        fetchGstData();

        toast.success("GST deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.error("Failed to delete GST record. Please try again.");

        toast.error("Failed to delete GST record. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("An error occurred while deleting the GST record:", error);

      toast.error("An error occurred while deleting the GST record:", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    
  };
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchGstData(1);
  }, []);

  const fetchGstData = async (page) => {
    try {
      if(userData?.data?._id)
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/addgst/gst/${userData?.data?._id}?page=${page}&pageSize=10`);
      setGstData(response.data);
      setLoading(false);
      setTotalPages(response.data?.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchGstData();
  }, [userData]);

  console.log("firstfirst", gstData)

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = editingData?._id;
    console.log(id);
    if (!editingData) {
      console.error("No data to update.");
      return;
    }

    const { gstPercentageName, gstPercentageValue } = editingData;

    const updatedData = {
      gstPercentageName,
      gstPercentageValue,
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/api/addgst/gst/${id}`,
        updatedData
      );

      if (response.status === 200) {
        toast.success("Gst Added Succesfully", {
          position: toast.POSITION.TOP_RIGHT,
        });

        fetchGstData();
      } else {
        toast.error("Failed to update GST. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while updating the GST.", {
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
        `http://localhost:8000/api/addgst/deletegst/${id}`
      );
      if (response.status === 200) {
        fetchGstData();
      } else {
        console.error("Failed to delete GST record. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while deleting the GST record:", error);
    }
  };



  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const datasource = gstData;

  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };
  //edit gst
  const [editgstid, setEditGstid] = useState("");

  // toast.success("Gst Updated Succesfully", {
  //   position: toast.POSITION.TOP_RIGHT,
  // });
  // const handleeditgstidDelete = (value) => {
  //   // setEditGstid(value);
  //   console.log(value)

  //   // window.location.reload();
  //   // $("#edit_expenses").modal("hide");
  // };
  console.log(editgstid);
  //delete gst
  const [gstid, setGstid] = useState("");

  const handleselectedgstidDelete = (value) => {
    setGstid(value);
  };


  const [editCashBankid, setEditCashBankid] = useState("");

  const editUpdateCashBank = (value) => {
    setEditCashBankid(value);
    // setEditCashBank1(false);
    setEditGst1(false);

  };
  
  const columns = [
    {
      title: "Gst Percentage Name",
      dataIndex: "gstPercentageName",
    },
    {
      title: "Gst Percentage Value",
      dataIndex: "gstPercentageValue",

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
                
              }}
            >
              <EditButton />
            </Link>

            <Modal
              className="add-bank-account-header-line"
              title="Edit Gst"
              onCancel={() => setEditGst1(false)}
              open={editGst1}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => setEditGst1(false)}
                  className="btn btn-secondary waves-effect me-2"
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#edit_gst_modal"
                  onClick={editUpdateCashBank}
                  className="btn btn-info waves-effect waves-light primary-button"
                >
                  Update
                </Button>,
              ]}
            >
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>
                      Percentage Value
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${!validation1.gstPercentageValue.isValid
                        ? "is-invalid"
                        : ""
                        }`}
                      placeholder="Enter Percentage Value"
                      value={editingData?.gstPercentageValue || ""}
                      onChange={(e) =>
                        handleGstPercentageValue(
                          "gstPercentageValue",
                          e.target.value
                        )
                      }
                    />
                    {!validation1.gstPercentageValue.isValid && (
                      <div className="error-message text-danger">
                        {validation1.gstPercentageValue.message}
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
              onClick={() => handleselectedgstidDelete(record._id)}
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

    if (!gstPercentageName) {
      validationErrors.gstPercentageName = {
        isValid: false,
        message: "Please enter a percentage",
      };
      console.error("Please enter a percentage");
    }

    if (!gstPercentageValue) {
      validationErrors.gstPercentageValue = {
        isValid: false,
        message: "Please enter a percentage value",
      };
      console.error("Please enter percentage value");
    }
    return validationErrors;
  };

  useEffect(() => {
    let downloadableData = datasource;
    setDownloadData(downloadableData);
  }, [datasource]);

  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "Gst Percentage Name": item?.gstPercentageName,
      "Gst Percentage Value": item?.gstPercentageValue,
    }));

    // Define CSV headers
    const headers = [
      { label: "Gst Percentage Name", key: "gstPercentageName" },
      { label: "Gst Percentage Value", key: "gstPercentageValue" },
    ];
    // Add more he

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = ["Gst Percentage Name", "Gst Percentage Value"];
    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.gstPercentageName,
      item?.gstPercentageValue,
    ]);
    handlePDFDownload({ columns, rows, heading: "GST" });
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
                <h5>GST</h5>
                <div className="searchbar-filter">
                  <Input
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
                  <Space>
                    <button
                      onClick={handleReset}
                      size="small"
                      style={{
                        width: 90,
                        padding: 7,
                        background: "#ed2020",
                        border: "none",
                        boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
                        borderRadius: 7,
                        color: "#fff",
                      }}
                    >
                      Reset
                    </button>
                  </Space>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    <li className="">
                      <div className="dropdown dropdown-action">
                        <Tooltip title="Download" placement="top">
                          <Link
                            to="#"
                            className="btn-filters me-2"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <span>
                              <FeatherIcon icon="download" />
                            </span>
                          </Link>
                        </Tooltip>

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
                    <li>
                      <div className="list-btn">
                        <ul className="filter-list">
                          <li>
                            <Tooltip title=" Add GST" placement="top">
                              <Link
                                className="btn btn-primary"
                                type="primary"
                                to="#"
                                onClick={() => setAddGst(true)}
                              >
                                <i
                                  className="fa fa-plus-circle me-2"
                                  aria-hidden="true"
                                />
                                Add Gst
                              </Link>
                            </Tooltip>
                          </li>
                        </ul>
                      </div>
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
                          pageSize: 10,
                          total: totalPages,
                          onChange: (page) => {
                            fetchGstData(page);
                          },
                          // total: datasource ? datasource.length : 0,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={datasource.filter((record) =>
                          record?.gstPercentageName?.includes(searchText)
                        )}
                        loading={loading}
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
                        onClick={() => handleDelete(gstid)}
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

        <div
          className="modal custom-modal fade"
          id="edit_gst_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Edit Gst</h3>
                  <p>Are you sure want to edit?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                        onClick={() => handleUpdate(editCashBankid)}
                      >
                        update
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
export default GstList;
