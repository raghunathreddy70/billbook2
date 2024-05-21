import Papa from "papaparse";
import React, { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import "../_components/antd.css";
import { Input, Pagination, Space, Table, Tooltip } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import AddVendor from "./addVendor";
import axios from "axios";
import Swal from "sweetalert2";
import "jspdf-autotable";
import { toast } from "react-toastify";
import useHandleDownload from "../Hooks/useHandleDownload";
import { Button, Modal } from "antd";
import EditVendorModal from "./EditVendorModal";
import { Tool } from "feather-icons-react/build/IconComponents";
import { backendUrl } from "../backendUrl";
import "react-phone-number-input/style.css";
import { IoIosSearch } from "react-icons/io";
import AddvendorModal from "../purchase/AddvendorModal";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { FaRegFileAlt } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import Advitise from "../customers/Advitise";
import ViewButton from "../Buttons/ViewButton";
import { useSelector } from "react-redux";
import PricingPlan1 from "../PricingPlan/PricingPlan1";

const Vendors = () => {
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [addVendor1, setAddVendor1] = useState(false);
  const [editVendors1, setEditVendors1] = useState(false);
  const [editVendorConfirm, setEditVendorsConfirm] = useState(false);
  const [deleteVendorConfirm, setDeleteVendorsConfirm] = useState(false);
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [datasource, setDatasource] = useState([]);
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

  const [editingData, setEditingData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
  });
  const [validation1, setValidation1] = useState({
    name: { isValid: true, message: "" },
    email: { isValid: true, message: "" },
    phoneNumber: { isValid: true, message: "" },
    addressLine1: { isValid: true, message: "" },
    addressLine2: { isValid: true, message: "" },
  });

  const [editingId, setEditingId] = useState("");
  const [vendorData, setVendorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  console.log("editingId", editingId);

  const userData = useSelector((state) => state?.user?.userData)

  const handleEdit = (record) => {
    console.log("record", record);
    setEditingId(record);
    setEditingData(record);
    setEditVendors1(true);
  };
  console.log("edit", editingData);

  useEffect(() => {
    console.log("edit", editingData);
  }, [editingData, editingId]);

  useEffect(() => {
    fetchVendorsData(1);
  }, []);
  const fetchVendorsData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/addVendor/vendors/${userData?.data?._id}` 
      );
      const dataWithIds = response.data?.map((item, index) => ({
        ...item,
        id: index + 1
      }));
   
      console.log("totalpages", response.data.vendors?.length);
      setLoading(false);
      setTotalPages(response.data?.length)
      setDatasource(dataWithIds.reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorsData();
  }, [userData]);

  const handleCSVDownloadSet = () => {
    const csvData = downloadData.map((item) => ({
      "No.": item.id,
      Name: item.name,
      Phone: item?.phoneNumber,
      Email: item?.email,
    }));

    const headers = [
      { label: "No.", key: "id" },
      { label: "Name", key: "name" },
      { label: "Phone", key: "phoneNumber" },
      { label: "Email", key: "email" },
    ];
    handleCSVDownload({ csvData, headers });
  };

  const handlePDFDownloadSet = () => {
    const columns = ["No.", "Name", "Phone", "Email"];

    const rows = downloadData?.map((item) => [
      item.id,
      item?.name,
      item?.phoneNumber,
      item?.email,
    ]);
    handlePDFDownload({ columns, rows, heading: "Vendors" });
  };

  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const handleReset = () => {
    setSearchText("");
  };
  // const formatCount = (count) => {
  //   return count === 2500 ? "2500+" : count;
  // };
  // edit update
  const [editVendorid, setEditvendorid] = useState("");
  const [activeError, setActiveError] = useState(false);
  const editvendorsidUpdate = (value) => {
    const validationError = validationFormErrors(editingData);
    if (Object.keys(validationError).length > 0) {
      setValidation1((prevValidation) => ({
        ...prevValidation,
        ...validationError,
      }));
      return;
    }
    setEditVendorsConfirm(true);
    setEditvendorid(value);
  };

  console.log("vendorsid", vendorsid);

  // delete update
  const [vendorsid, setvendorsid] = useState("");
  const handleselectedvendoridDelete = (value) => {
    setvendorsid(value);
    setDeleteVendorsConfirm(true);
  };
  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      render: (text, record) => (
        <Link to={`/vendor-details/${record._id}`}>
          <h2 className="table-avatar">{record.id}</h2>
        </Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <Link to={`/vendor-details/${record._id}`}>
          <h2 className="table-avatar">{record.name}</h2>
        </Link>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => (
        <Link to={`/vendor-details/${record._id}`}>
          <h2 className="table-avatar">{record.phoneNumber}</h2>
        </Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <Link to={`/vendor-details/${record._id}`}>
          <h2 className="table-avatar">{record.email}</h2>
        </Link>
      ),
    },
    {
      title: "Address",
      dataIndex: "addressLine1",
      render: (text, record) => (

        <Link to={`/vendor-details/${record._id}`}>
          <h2 className="table-avatar">{record.addressLine1}</h2>
        </Link>
      ),
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <Link
            to={`/vendor-details/${record._id}`}
          className="btn btn-greys me-2 "
          >
           <i className="fa fa-eye me-1" /> View
          </Link>
        </div>
      ),
    },
  ];

  

  const validationFormErrors = (editingData) => {
    const validationError = {};
    if (!editingData.name) {
      validationError.name = { isValid: false, message: "please enter a name" };
    }
    if (!editingData.email) {
      validationError.email = {
        isValid: false,
        message: "please enter a email",
      };
    }
    if (!editingData.phoneNumber) {
      validationError.phoneNumber = {
        isValid: false,
        message: "please enter a phone Number",
      };
    }
    return validationError;
  };
  return (
    <>
      <div className={`main-wrapper customer-index ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper customer-details-parent-date">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-md-12">
                  <div className="content-page-header mb-3">
                    <h5>Vendors</h5>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="searchbar-filter">
                      <Input
                        prefix={<FaMagnifyingGlass />}
                        className="search-input"
                        placeholder="Search "
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{
                          width: 300,
                          marginBottom: 0,
                          padding: "6px 12px",
                          border: "1px solid #DCDDDD",
                          height: "40px",
                        }}
                      />
                    </div>
                    <div>
                      <div className="list-btn">
                        <ul className="filter-list">
                          <li className="">
                            <div className="add-customer-button">
                              <Link
                                to="#"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <RiDownloadCloud2Line />
                                Download
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

                          <li className="add-customer-button">
                            <Link
                              className=""
                              to="#"
                              onClick={() => setAddVendor1(true)}
                            >
                              < FaPlus />
                              Add Vendor
                              {/* <i className="fa fa-plus-circle " aria-hidden="true" /> */}
                            </Link>
                            <AddvendorModal
                              visible={addVendor1}
                              onCancel={() => setAddVendor1(false)}
                              fetchVendorsData={fetchVendorsData}
                              datasource={datasource}
                              setDatasource={setDatasource}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              <div className="row d-flex justify-content-between mb-5 mt-4">
                <div className="col-md-6 d-flex gap-2">
                  <div className="col-md-6">
                    <div className="total-count-customers-line ">
                      <div>
                        <h3>Total Customers</h3>
                        <p>{totalPages}</p>
                      </div>
                      <div className='SalesInvoice-cards-img' style={{ background: '#2D3748' }}>
                        <FaRegFileAlt />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="total-count-customers-line">
                      <div>
                        <h3>To Collect</h3>
                        <p>20000</p>
                      </div>
                      <div className='SalesInvoice-cards-img' style={{ background: '#2D3748' }}>
                        <IoCart />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-center gap-2 justify-content-end">


                </div>
              </div>
              <div className="row">

              </div>
              <div className="row customer-transction-data-change">
                <div className="col-sm-8">
                  <div className=" card-table">
                    <div className="card-body vendors">
                      <div className="table-responsive table-hover table-striped">
                        <Table
                          pagination={{
                            pageSize: 8,
                            total: datasource ? datasource.length : 0,
                            onChange: (page) => {
                              fetchVendorsData(page);
                            },
                            itemRender: itemRender,
                          }}
                          dataSource={datasource?.filter(
                            (record) =>
                              record?.name
                                ?.toLowerCase()
                                .includes(searchText.toLowerCase()) ||
                              (record?.phoneNumber &&
                                record.phoneNumber
                                  .toString()
                                  .includes(searchText))
                          )}
                          columns={columns}
                          loading={loading}
                          rowKey={(record) => record.id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 ">
                  <Advitise />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Vendors;
