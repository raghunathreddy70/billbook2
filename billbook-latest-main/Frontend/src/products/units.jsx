import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import FeatherIcon from "feather-icons-react";
// import Data from "../assets/jsons/units";
import "../_components/antd.css";
import { Button, Modal, Tooltip } from "antd";
import { Input, Pagination, Space, Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { AddUnitsModal } from "./AddUnitsModal";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import DeleteButton from "../Buttons/DeleteButton";
import EditButton from "../Buttons/EditButton";
import { useSelector } from "react-redux";
import { backendUrl } from "../backendUrl";

const Units = ({ toggleTabsState, showContent, setDownloadData }) => {
  const { SearchData } = useFiltersSales();
  // console.log("unitName",unitData)
  const [addUnits1, setAddUnits1] = useState(false);
  const [editUnits1, setEditUnits1] = useState(false);
  const [deleteUpdateUnits1, setDeleteUpdateUnits1] = useState(false);
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [editUpdateUnits1, setEditUpdateUnits1] = useState(false);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [selectedSearchVar, setSelectedSearchVar] = useState("categoryName");
  const [searchContent, setSearchContent] = useState(null);
  const [datasource, setDatasource] = useState([]);

  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    if (toggleTabsState === 2) {
      const fetchDownloadData = async () => {
        const data = isFiltered
          ? [...filteredDatasource].reverse()
          : [...datasource].reverse();
        let downloadableData = SearchData({
          data: data,
          selectedVar: selectedSearchVar,
          searchValue: searchContent,
        });

        setDownloadData(downloadableData);
      };
      fetchDownloadData();
    }
  }, [toggleTabsState, isFiltered, filteredDatasource, searchContent]);

  const searchSelectDrop = [
    {
      title: "Unit Name",
      value: "unitName",
    },
    {
      title: "Short Name",
      value: "shortName",
    },
  ];

  const [validationpage, setValidationpage] = useState({
    unitName: { isValid: true, message: "" },
    shortName: { isValid: true, message: "" },
  });

  const validateEditData = (editingData) => {
    const validationErrors = {};

    if (!editingData.unitName) {
      validationErrors.unitName = {
        isdataValid: false,
        message: "please enter valid unit name",
      };
    }
    if (!editingData.shortName) {
      validationErrors.shortName = {
        isdataValid: false,
        message: "please enter valid short name",
      };
    }
    return validationErrors;
  };

  const [unitdata, setUnitData] = useState([]);

  const userData = useSelector((state) => state?.user?.userData)
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchUnitData(1);
  }, [userData]);
  const fetchUnitData = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/Unit/getunits/${userData?.data?._id}?page=${page}&pageSize=10`
      );
      setDatasource(response.data);
      setLoading(false);
      setTotalPages(response.data?.length);
      setUnitData(response.data);
      setFilteredDatasource(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitData();
  }, [userData]);

  const [editingData, setEditingData] = useState({
    unitName: "",
    shortName: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currencyData, setcurrencyData] = useState([]);

  const handleEdit = (record) => {
    setEditingData(record);
    setEditingId(record.id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = editingData._id;
    if (!editingData) {
      console.error("No data to update.");
      return;
    }
    const { unitName, shortName } = editingData;
    const updatedData = {
      unitName,
      shortName,
    };
    try {
      const response = await axios.put(
        `http://localhost:8000/api/Unit/unitedit/${id}`,
        updatedData
      );
      if (response.status === 200) {
        toast.success(" updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });

        fetchUnitData();

        $("#edit_unit").modal("hide");
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
      setEditUpdateUnits1(false);
    }
  };

  const handleInputChange = (fieldName, value) => {
    const withoutTaxRegex = /^[a-zA-Z\s]*$/;
    let isValid = true;
    let message = "";
    if (fieldName === "unitName") {
      isValid = withoutTaxRegex.test(value);
      message = "Invalid value";
    }
    if (fieldName === "shortName") {
      isValid = withoutTaxRegex.test(value);
      message = "Invalid value";
    }
    setEditingData({
      ...editingData,
      [fieldName]: value,
    });

    setValidationpage({
      ...validationpage,
      [fieldName]: { isValid, message },
    });
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error("ID is null or undefined");
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/api/Unit/deleteunit/${id}`
      );
      if (response.status === 200) {
        toast.success("Deleted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });

        fetchUnitData();
      } else {
        toast.error("Failed to delete units record. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Failed to delete units record. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the units record.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error(
        "An error occurred while deleting the units record:",
        error
      );
    } finally {
      setDeleteUpdateUnits1(false);
    }
  };
  //update units
  const [editUnitid, setEditunitsid] = useState("");

  const editUnitsIdUpdate = (value) => {
    const validationErrors = validateEditData(editingData);
    if (Object.keys(validationErrors).length > 0) {
      setValidationpage((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
    setEditUpdateUnits1(true);
    setEditunitsid(value);
    setEditUnits1(false);
  };
  //delete units
  const [deleteUnitid, setDeleteunitsid] = useState("");

  const editDeleteIdUpdate = (value) => {
    setDeleteunitsid(value);
  };
  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      render: (text, record, index) => index + 1,
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Unit Name",
      dataIndex: "unitName",
      sorter: (a, b) => a.unitName.length - b.unitName.length,
    },
    {
      title: "Short Name",
      dataIndex: "shortName",
      sorter: (a, b) => a.shortName.length - b.shortName.length,
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <div className="d-flex align-items-center gap-1">
          <Link
            className=" btn-action-icon me-2"
            to="#"
            onClick={() => {
              handleEdit(record);
              setEditUnits1(true);
            }}
          >
           <EditButton/>
          </Link>
          <Link
            className=" btn-action-icon"
            to="#"
            onClick={() => {
              editDeleteIdUpdate(record._id);
              setDeleteUpdateUnits1(true);
            }}
          >
            <DeleteButton/>
          </Link>
        </div>
      ),
      sorter: (a, b) => a.Action.length - b.Action.length,
    },
  ];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header ">
                <h5>Units</h5>
             
              <div className="btn button-list">
                <Tooltip title="Add Unit" placement="top">
                  <Link
                    type="button"
                    className="btn btn-primary"
                    to="#"
                    onClick={() => setAddUnits1(true)}
                    // data-bs-toggle="modal"
                    // data-bs-target="#add_unit"
                  >
                    <i
                      className="fa fa-plus-circle pr-2"
                      aria-hidden="true"
                      // onClick={handleunitData}
                    />
                    Add Unit
                  </Link>
                </Tooltip>
                <AddUnitsModal
                  visible={addUnits1}
                  onCancel={() => setAddUnits1(false)}
                  datasource={datasource}
                  setDatasource={setDatasource}
                />
              </div>
              </div>
              {/* Table */}
              <div className="row">
                <div className="col-sm-12">
                  <div className="card-table">
                    <div className="card-body units">
                      <div className="table-responsive table-hover">
                        {showContent && (
                          <SalesFilters
                            datasource={datasource}
                            reversedDataSource={reversedDataSource}
                            searchContent={searchContent}
                            searchSelectDrop={searchSelectDrop}
                            selectedSearchVar={selectedSearchVar}
                            setFilteredDatasource={setFilteredDatasource}
                            setIsFiltered={setIsFiltered}
                            setSearchContent={setSearchContent}
                            setSelectedSearchVar={setSelectedSearchVar}
                          />
                        )}
                        <Table
                          pagination={{
                            pageSize: 10,
                            total: totalPages,
                            onChange: (page) => {
                              fetchUnitData(page);
                            },
                            // total: SearchData({
                            //   data: reversedDataSource,
                            //   selectedVar: selectedSearchVar,
                            //   searchValue: searchContent,
                            // }).length,
                            // showTotal: (total, range) =>
                            //   `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            // showSizeChanger: true,
                          }}
                          loading={loading}
                          columns={columns}
                          dataSource={SearchData({
                            data: reversedDataSource,
                            selectedVar: selectedSearchVar,
                            searchValue: searchContent,
                          })}
                          // dataSource={datasource.filter(
                          //   (record) =>
                          //     record?.shortName
                          //       ?.toLowerCase()
                          //       .includes(searchText.toLowerCase()) ||
                          //     record?.unitName
                          //       ?.toLowerCase()
                          //       .includes(searchText.toLowerCase()) ||
                          //     (record?.Total && record.Total.includes(searchText))
                          // )}
                          rowKey={(record) => record.Id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Table */}

              <Modal
                className="add-bank-account-header-line"
                title="Edit Units"
                onCancel={() => setEditUnits1(false)}
                open={editUnits1}
                footer={[
                  <Button
                    key="cancel"
                    onClick={() => setEditUnits1(false)}
                    className="btn btn-secondary waves-effect me-2"
                  >
                    Cancel
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    className="btn btn-info waves-effect waves-light primary-button"
                    onClick={editUnitsIdUpdate}
                  >
                    Update
                  </Button>,
                ]}
              >
                <div className="row">
                  <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                      <label>Name </label>
                      <input
                        type="text"
                        className={`form-control ${
                          !validationpage?.unitName?.isValid ? "is-invalid" : ""
                        }`}
                        defaultValue="Kilogram"
                        placeholder="Enter Title"
                        value={editingData?.unitName || ""}
                        onChange={(e) =>
                          handleInputChange("unitName", e.target.value)
                        }
                      />
                      {!validationpage?.unitName?.isValid && (
                        <div className="error-message text-danger">
                          {validationpage?.unitName?.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                      <label>Symbol</label>
                      <input
                        type="text"
                        className={`form-control ${
                          !validationpage?.shortName?.isValid
                            ? "is-invalid"
                            : ""
                        }`}
                        defaultValue="Slug"
                        placeholder="Enter Slug"
                        value={editingData?.shortName || ""}
                        onChange={(e) =>
                          handleInputChange("shortName", e.target.value)
                        }
                      />
                      {!validationpage?.shortName?.isValid && (
                        <div className="error-message text-danger">
                          {validationpage?.shortName?.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Modal>

              <Modal
                onCancel={() => setEditUpdateUnits1(false)}
                closable={false}
                open={editUpdateUnits1}
                footer={null}
              >
                <div className="form-header">
                  <h3 className="update-popup-buttons">Update Units</h3>
                  <p>Are you sure want to update?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        className="w-100 btn btn-primary paid-continue-btn"
                        onClick={() => handleUpdate(editUnitid)}
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
              </Modal>

              <Modal
                onCancel={() => setDeleteUpdateUnits1(false)}
                closable={false}
                open={deleteUpdateUnits1}
                footer={null}
              >
                <div className="form-header">
                  <h3 className="update-popup-buttons">Delete Units</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="submit"
                        className="w-100 btn btn-primary paid-continue-btn"
                        onClick={() => handleDelete(deleteUnitid)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="submit"
                        onClick={() => setDeleteUpdateUnits1(false)}
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
      </div>
    </>
  );
};

export default Units;
