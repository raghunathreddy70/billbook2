import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
//import Data from "../assets/jsons/category";
import "../_components/antd.css";
import { Input, Pagination, Space, Table } from "antd";
import { toast } from 'react-toastify';
import { Button, Modal } from 'antd';
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import Select2 from "react-select2-wrapper";
import { DropIcon } from "../_components/imagepath";
import axios from "axios";
import Swal from "sweetalert2";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import useDeleteSales from "../invoices/customeHooks/useDeleteSales";
import { AddExpenseCatagoryData } from "./AddExpenseCatagoryData";

const ExpenseCategory = ({ setDownloadData, toggleTabsState, showContent }) => {
  const [updateCategories1, setUpdateCategories1] = useState(false);
  const { SearchData } = useFiltersSales();
  const { handleExpenseProductDelete } = useDeleteSales();
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  // const [dataSource, setDatasource] = useState([]);

  const [datasource, setDatasource] = useState([]);
  const [addCatagories1, setAddCatagories1] = useState(false);
  const [editCatagories1, seteditCatagories1] = useState(false);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: 'Date',
      value: "paymentDate",
    }
  ];
  const searchSelectDrop = [
    {
      title: 'Category Name',
      value: "expensecategoryName",
    },
  ]
  const [selectedDateVar, setSelectedDateVar] = useState("paymentDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("expensecategoryName");
  const [searchContent, setSearchContent] = useState(null);

  // filter function with customer name 
  const reversedDataSource = isFiltered ? [...filteredDatasource].reverse() : [...datasource].reverse();

  useEffect(() => {
    if (toggleTabsState === 1) {
      const fetchDownloadData = async () => {
        const data = isFiltered ? [...filteredDatasource].reverse() : [...datasource].reverse();
        let downloadableData = SearchData({ data: data, selectedVar: selectedSearchVar, searchValue: searchContent });
        setDownloadData(downloadableData)
      }
      fetchDownloadData();
    }
  }, [toggleTabsState, isFiltered, filteredDatasource, searchContent])


  const handleInputChange = (fieldName, value) => {
    const withoutTaxRegex = /^[a-zA-Z\s]*$/;
    let isValid = true;
    let message = '';
    if (fieldName === 'expensecategoryName') {
      isValid = withoutTaxRegex.test(value);
      message = 'Invalid value';
    }
    setEditingData({
      ...editingData,
      [fieldName]: value,
    });

    setValidation1({
      ...validation1,
      [fieldName]: { isValid, message },
    });
  };


  const validateFormData1 = (editingData) => {
    const validationErrors = {};
    if (!editingData.expensecategoryName) {
      validationErrors.expensecategoryName = { isdataValid: false, message: 'please enter valid name' };
    }
    return validationErrors;
  };



  const fetchexpensecategoryData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/ExpenseCat/expensecat");
      setDatasource(response.data);
      setFilteredDatasource(response.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchexpensecategoryData();
  }, []);

  const [editingData, setEditingData] = useState(null);
  const [validation1, setValidation1] = useState({
    expensecategoryName: { isValid: true, message: '' },
  })
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (record) => {
    setEditingData(record);
    setEditingId(record.id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = editingData._id;
    if (!editingData) {
      console.error('No data to update.');
      return;
    }

    const { expensecategoryName } = editingData;

    const updatedData = {
      expensecategoryName
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/api/ExpenseCat/expensecategoryedit/${id}`,
        updatedData
      );

      if (response.status === 200) {
        toast.success(" updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        fetchexpensecategoryData();
      } else {
        toast.error("Failed to update Category. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while updating the GST.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error('Error:', error);
    } finally {
      setUpdateCategories1(false);
    }
  };


  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      if (!id) {
        console.error('ID is null or undefined');
        return;
      }

      const response = await axios.delete(`http://localhost:8000/api/ExpenseCat/deleteexpensecategory/${id}`);
      if (response.status === 200) {
        toast.success("Successfully Deleted Category")
        fetchexpensecategoryData();
      } else {
        console.error('Failed to delete currency record. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred while deleting the currency record:', error);
    }
  };

  // edit update
  const [editcategoryid, setEditcategoryid] = useState("");

  const editcategorysidUpdate = (value) => {
    const validationErrors = validateFormData1(editingData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation1(prevValidation => ({
        ...prevValidation,
        ...validationErrors
      }));
      return;
    }
    setEditcategoryid(value);
    setUpdateCategories1(true);
    seteditCatagories1(false);
  }

  // delete update
  const [categorysid, setcategorysid] = useState("");

  const handleselectedcategoryidDelete = (value) => {
    setcategorysid(value);
  }
  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Category Name',
      dataIndex: 'expensecategoryName',
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <Link
            className=" btn-action-icon me-2"
            to="#"
            onClick={() => {
              handleEdit(record);
              seteditCatagories1(true);
            }}
          >
            <div className="bg-[#e1ffed] p-1 rounded">
              <FeatherIcon icon="edit" className="text-[#1edd6a] " />
            </div>
          </Link>
          <Link
            className=" btn-action-icon"
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#delete_modal"
            onClick={() => handleselectedcategoryidDelete(record._id)}
          >
            <div className=" bg-[#ffeded] p-1 rounded">
              <FeatherIcon icon="trash-2" className="text-[#ed2020]" />
            </div>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="button-list my-3 expense-add-category">
        <Link
          type="button"
          to="#"
          className="btn btn-primary addCategory-button 700:py-[8px] 700:text-[14px] 300:text-[13px] 700:px-[15px] 300:py-[4px] 300:px-[10px] "
          onClick={(e) => { e.preventDefault(); setAddCatagories1(true) }}
        >
          <i
            className="fa fa-plus-circle me-2"
            aria-hidden="true"
          />
          Add Category
        </Link>
      </div>

      {/* Table */}
      <div className="row my-3 mt-0" >
        <div className="col-sm-12">
          <div className=" card-table">
            <div className="card-body category invoiceList">
              <div className="table-responsive table-hover">
                <div className="table-filter  p-0">
                  {showContent && (
                    <SalesFilters datasource={datasource} reversedDataSource={reversedDataSource} searchContent={searchContent} searchSelectDrop={searchSelectDrop} selectedDateVar={selectedDateVar} selectedSearchVar={selectedSearchVar} setFilteredDatasource={setFilteredDatasource} setIsFiltered={setIsFiltered} setSearchContent={setSearchContent} setSelectedDateVar={setSelectedDateVar} setSelectedSearchVar={setSelectedSearchVar} />
                  )}
                </div>
                <Table
                  pagination={{
                    total: SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent }).length,
                    showTotal: (total, range) =>
                      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                    itemRender: itemRender,
                  }}
                  columns={columns}
                  dataSource={SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent })}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div >
      {/* /Table */}
      <AddExpenseCatagoryData
        visible={addCatagories1}
        onCancel={() => setAddCatagories1(false)}
        datasource={datasource}
        setDatasource={setDatasource}
        fetchexpensecategoryData={fetchexpensecategoryData}
      />
    
      < Modal
        className="add-bank-account-header-line add-godown-styles"
        title="Edit Category"
        to="#"
        onCancel={() => seteditCatagories1(false)}
        open={editCatagories1}
        footer={
          [
            <Button key="cancel" onClick={() => seteditCatagories1(false)}
              className="btn btn-secondary waves-effect me-2">
              Cancel
            </Button>,
            <Button key="submit" type="primary"
              className="btn btn-info waves-effect waves-light primary-button"
              onClick={editcategorysidUpdate}>
              Update
            </Button>,]}
      >
        <div className="row">
          <div className="col-md-12">
            <div className="">
              <div className="form-group-item border-0 pb-0 mb-0">
                <div className="row">
                  <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                      <label>
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${!validation1.expensecategoryName.isValid ? "is-invalid" : ""}`}
                        defaultValue="Advertising"
                        placeholder="Enter Title"
                        value={editingData?.expensecategoryName || ''}
                        onChange={(e) => handleInputChange('expensecategoryName', e.target.value)}
                      />
                      {!validation1.expensecategoryName.isValid && <div className="error-message text-danger">{validation1.expensecategoryName.message}</div>}

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal >

      < div
        className="modal custom-modal fade"
        id="delete_modal"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Category</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={(e) => handleDelete(e, categorysid)}
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
      </div >
      <Modal
        closable={false}
        onCancel={() => setUpdateCategories1(false)}
        open={updateCategories1}
        footer={null}
      >
        <div className="row">
          <div className="form-header">
            <h3 className="update-popup-buttons">Update Category</h3>
            <p>Are you sure want to update?</p>
          </div>
          <div className="modal-btn delete-action">
            <div className="row">
              <div className="col-6">
                <button
                  type="reset"
                  className="w-100 btn btn-primary paid-continue-btn"
                  onClick={() => handleUpdate(editcategoryid)}
                >
                  Update
                </button>
              </div>
              <div className="col-6">
                <button
                  type="submit"
                  onClick={() => setUpdateCategories1(false)}
                  className="w-100 btn btn-primary paid-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* <div
        className="modal custom-modal fade"
        id="update_modal"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Update Category</h3>
                <p>Are you sure want to update?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => handleUpdate(editcategoryid)}
                    >
                      Update
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
      </div> */}
    </>
  );
};
export default ExpenseCategory;
