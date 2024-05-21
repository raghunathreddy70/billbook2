import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
//import Data from "../assets/jsons/category";
import "../_components/antd.css";
import { Input, Pagination, Space, Table, Tooltip } from "antd";
import { toast } from "react-toastify";
import { Button, Modal } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";
import Select2 from "react-select2-wrapper";
import { DropIcon } from "../_components/imagepath";
import axios from "axios";
import Swal from "sweetalert2";
import AddCategoryModal from "./AddCategoryModal";
import SalesFilters from "../invoices/filters/SalesFilters";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import { backendUrl } from "../backendUrl";
import { useSelector } from "react-redux";

const Category = ({
  // getProductsByCategory,
  // setDownloadData,
  // toggleTabsState,
  // setCategories,
  // showContent,
}) => {
  const [addCategory1, setAddCategory1] = useState(false);
  const [editCategory1, setEditCategory1] = useState(false);
  const [updateCategories1, setUpdateCategories1] = useState(false);
  const [deleteUpdateUnits1, setDeleteUpdateUnits1] = useState(false);
  const [searchContent, setSearchContent] = useState(null);
  const [menu, setMenu] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [categories, setCategories] = useState(null);
  const [showContent, setShowContent] = useState(false)
  const [toggleTabsState, setToggleTabsState] = useState(null)
  const [downloadData, setDownloadData] = useState(null)
  const [selectedSearchVar, setSelectedSearchVar] = useState("categoryName");
  const { SearchData } = useFiltersSales();

  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();



  useEffect(() => {
    if (toggleTabsState === 1) {
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
      title: "Category Name",
      value: "categoryName",
    },
  ];

  // console.log("getProductsByCategory", getProductsByCategory);

  const getProductsByCategory = (id) => {
    let found = datasource?.filter((item) => item?.itemCategory === id);
    return found?.length;
  };


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
          image: base64Image,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const userData = useSelector((state) => state?.user?.userData)
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchcategoryData(1);
  }, []);



  const fetchcategoryData = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/addCategory/categories/${userData?.data?._id}?page=${page}&pageSize=10`
      );
      setDatasource(response.data);
      setLoading(false);
      setTotalPages(response.data?.length);
      setCategories(response.data);
     
      setFilteredDatasource(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchcategoryData();
  }, [userData]);

  const [editingData, setEditingData] = useState({
    categoryName: "",
  });
  const [validationPage, setValidationPage] = useState({
    categoryName: { isValid: true, message: "" },
  });

  const handleInputChange = (fieldName, value) => {
    const withoutTaxRegex = /^[a-zA-Z\s]*$/;
    let isValid = true;
    let message = "";
    if (fieldName === "categoryName") {
      isValid = withoutTaxRegex.test(value);
      message = "Invalid value";
    }
    setEditingData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    setValidationPage({
      ...validationPage,
      [fieldName]: { isValid, message },
    });
  };
  const validateEditData = (editingData) => {
    const validationErrors = {};
    if (!editingData.categoryName) {
      validationErrors.categoryName = {
        isdataValid: false,
        message: "please enter valid category name",
      };
    }
    return validationErrors;
  };
  const [editingId, setEditingId] = useState(null);

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

    const { categoryName } = editingData;

    const updatedData = {
      categoryName,
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/api/addCategory/categoryedit/${id}`,
        updatedData
      );

      if (response.status === 200) {
        toast.success(" updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });

        fetchcategoryData();

        $("#edit_category").modal("hide");
      } else {
        toast.error("Failed to update Category. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while updating the Categories.", {
        position: toast.POSITION.TOP_RIGHT,
      });

      console.error("Error:", error);
    } finally {
      setUpdateCategories1(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error("ID is null or undefined");
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/api/addCategory/deletecategory/${id}`
      );
      if (response.status === 200) {
        toast.success("deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        fetchcategoryData();
      } else {
        toast.error("Failed to delete category record. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });

        console.error("Failed to delete category record. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the category record:", {
        position: toast.POSITION.TOP_RIGHT,
      });

      console.error(
        "An error occurred while deleting the category record:",
        error
      );
    } finally {
      setDeleteUpdateUnits1(false);
    }
  };

  // edit update
  const [editcategoryid, setEditcategoryid] = useState("");
  const editcategorysidUpdate = (value) => {
    const validationErrors = validateEditData(editingData);
    if (Object.keys(validationErrors).length > 0) {
      setValidationPage((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
    setUpdateCategories1(true);
    setEditCategory1(false);
    setEditcategoryid(value);
  };
  // delete update
  const [categorysid, setcategorysid] = useState("");

  const handleselectedcategoryidDelete = (value) => {
    setcategorysid(value);
  };
  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      render: (_, record) => <span>{record?.categoryName || "N/A"}</span>,
    },
    {
      title: "Total Products",
      dataIndex: "Total",
      render: (text, record) => (
        <p>{record?.length || 0}</p>
      ),
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
              setEditCategory1(true);
            }}
          >
           <EditButton/>
          </Link>

          <Link
            className=" btn-action-icon"
            to="#"
            onClick={() => {
              handleselectedcategoryidDelete(record._id);
              setDeleteUpdateUnits1(true);
            }}
          >
           <DeleteButton/>
          </Link>
        </div>
      ),
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
                <h5>Category</h5>

                <div className=" btn button-list">
                  {/* <Tooltip title="Add Category" placement="top"> */}
                    <Link
                      type="button"
                      className="btn btn-primary"
                      to="#"
                      onClick={() => setAddCategory1(true)}
                    >
                      <i
                        className="fa fa-plus-circle pr-2"
                        aria-hidden="true"
                      />
                      Add Category
                    </Link>
                  {/* </Tooltip> */}
                </div>
              </div>
              <AddCategoryModal
                visible={addCategory1}
                onCancel={() => setAddCategory1(false)}
                datasource={datasource}
                setDatasource={setDatasource}
              />
              {/* Table */}
              <div className="row">
                <div className="col-sm-12">
                  <div className=" card-table">
                    <div className="card-body category">
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
                              fetchcategoryData(page);
                            },
                            // total: SearchData({
                            //   data: reversedDataSource,
                            //   selectedVar: selectedSearchVar,
                            //   searchValue: searchContent,
                            // }).length,
                            // showTotal: (total, range) =>
                            //   `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            // showSizeChanger: true,
                            // onShowSizeChange: onShowSizeChange,
                            itemRender: itemRender,
                          }}
                          columns={columns}
                          dataSource={SearchData({
                            data: reversedDataSource,
                            selectedVar: selectedSearchVar,
                            searchValue: searchContent,
                          })}
                          loading={loading}
                          rowKey={(record) => record.id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Table */}

              <div
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
                              onClick={() => handleDelete(categorysid)}
                            >
                              Delete
                            </button>
                          </div>
                          <div className="col-6">
                            <button
                              type="submit"
                              data-bs-dismiss="modal"
                              className="w-100 btn btn-primary paid-cancel-btn delete-category"
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

              <Modal
                className="add-bank-account-header-line"
                title="Edit Category"
                onCancel={() => setEditCategory1(false)}
                open={editCategory1}
                footer={[
                  <Button
                    key="cancel"
                    onClick={() => setEditCategory1(false)}
                    className="btn btn-secondary waves-effect me-2"
                  >
                    Cancel
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    className="btn btn-info waves-effect waves-light primary-button"
                    onClick={editcategorysidUpdate}
                  >
                    Update
                  </Button>,
                ]}
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
                                className={`form-control ${
                                  !validationPage?.categoryName?.isValid
                                    ? "is-invalid"
                                    : ""
                                }`}
                                defaultValue="Advertising"
                                placeholder="Enter Title"
                                value={editingData?.categoryName || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "categoryName",
                                    e.target.value
                                  )
                                }
                              />
                              {!validationPage?.categoryName?.isValid && (
                                <div className="error-message text-danger">
                                  {validationPage?.categoryName?.message}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
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
                  <h3 className="update-popup-buttons">Delete Category</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="submit"
                        className="w-100 btn btn-primary paid-continue-btn"
                        onClick={() => handleDelete(categorysid)}
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
export default Category;
