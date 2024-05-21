import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Checkbox, Dropdown, Input, Space, Table, Tooltip } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import { FaArrowUpLong, FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useHandleDownload from "../Hooks/useHandleDownload";
import "react-phone-number-input/style.css";
import AddCustomer from "./AddCustomer";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { FaRegFileAlt } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { RiDownloadCloud2Line } from "react-icons/ri";
import Advitise from "./Advitise";
import { useSelector } from "react-redux";

const Customer = () => {
  const userData = useSelector((state) => state?.user?.userData);
  const businessId = userData?.data?._id;
  const [menu, setMenu] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    GSTNo: "",
    PANNumber: "",
    billingAddress: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
    useShippingAddress: false,
    shippingAddress: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  console.log("customer", customer);

  const [CustomersData, setCustomersData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/addCustomer/customers/${userData?.data?._id}`
        );
        console.log("response3", response);
        const dataWithIds = response?.data?.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setCustomersData(dataWithIds.reverse());

        setTotalPages(response.data?.length);
        setDownloadData(dataWithIds);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const [counter, setCounter] = useState(0);

  console.log("Counter Value ", counter);
  useEffect(() => {
    fetchData();
  }, [userData]);

  console.log("CustomersData", CustomersData);

  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [downloadData, setDownloadData] = useState([]);
  useEffect(() => {
    let downloadableData = customer;
    setDownloadData(downloadableData);
  }, [customer]);
  // download data in csv format code goes here
  const handleCSVDownloadSet = () => {
    const csvData = downloadData.map((item) => ({
      "No.": item.id,
      Name: item.name,
      Phone: item?.phoneNumber,
      "Email ": item?.email,
      "PanNumber ": item?.PANNumber,
      "GstNO ": item?.GSTNo,
    }));
    // Define CSV headers
    const headers = [
      { label: "No.", key: "id" },
      { label: "Name", key: "name" },
      { label: "PhoneNumber", key: "PhoneNumber" },
      { label: "Email", key: "email" },
      { label: "PanNumber", key: "PanNumber" },
      { label: "GstNO", key: "GstNO" },
    ];
    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here
  // download data in pdf format code goes here
  const handlePDFDownloadSet = () => {
    const columns = ["No.", "Name", "Phone", "Email", "PanNumber", "GstNo"];

    const rows = downloadData.map((item) => [
      item.id,
      item?.name,
      item?.phoneNumber,
      item.email,
      item.PANNumber,
      item.GSTNo,
    ]);
    handlePDFDownload({ columns, rows, heading: "Vendors" });
  };

  const [modalVisible, setModalVisible] = useState(false);
  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      render: (text, record) => (
        <Link to={`/customer-details/${record._id}`}>
          <h2 className="table-avatar">{record.id}</h2>
        </Link>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/customer-details/${record._id}`}>
          <h2 className="table-avatar">{record.name}</h2>
        </Link>
      ),
    },

    {
      title: "Mobile Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text, record) => (
        <Link to={`/customer-details/${record._id}`}>
          <h2 className="table-avatar">{record.phoneNumber}</h2>
        </Link>
      ),
    },
    {
      title: "Balance",
      dataIndex: "openingBalance",
      key: "openingBalance",
      render: (text, record) => (
        <Link to={`/customer-details/${record._id}`}>
          <h2 className="table-avatar">{record.openingBalance}</h2>
        </Link>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <Link
            to={`/customer-details/${record._id}`}
            className="btn btn-greys me-2"
          >
            <i className="fa fa-eye me-1" /> View
          </Link>
        </div>
      ),
    },
  ];

  const [totalCustomers, setTotalCustomers] = useState(0);

  const formatCount = (count) => {
    return count === 2500 ? "2500+" : count;
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/customerCount1`,{
          params: { businessId }
        }
      );
      setTotalCustomers(response.data.customers.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {+
    fetchCustomers();
  }, [userData]);

  console.log("totalCustomer",totalCustomers)



  const fetchRevenue = async () => {
    if (!userData) {
      console.log("User data not available");
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/getTotalRevenue",
        { params: { businessId: userData?.data?._id } }
      );
      setTotalRevenue(response.data.revenue);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [userData]);     




  const history = useHistory();

  const items = [
    {
      label: (
        <div
          onClick={() => {
            history.push("/report/party-wise-outstanding");
          }}
        >
          Partywise Outstanding
        </div>
      ),
    },
    {
      label: (
        <div
          onClick={() => {
            history.push("/report/party-report-by-customer");
          }}
        >
          Item Report By Party
        </div>
      ),
    },
  ];

  return (
    <div className={`main-wrapper customer-index ${menu ? "slide-nav" : ""}`}>
      <div className="page-wrapper customer-details-parent-date">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-md-12">
                <div className="content-page-header mb-3">
                  <h5>Customers</h5>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="searchbar-filter">
                    <Input
                      prefix={<FaMagnifyingGlass />}
                      className="search-input"
                      placeholder="Search"
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
                              className=""
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
                            onClick={() => setModalVisible(true)}
                          >
                            <FaPlus />
                            Add Customer
                          </Link>
                          <AddCustomer
                            visible={modalVisible}
                            onCancel={() => setModalVisible(false)}
                            CustomersData={CustomersData}
                            setCustomersData={setCustomersData}
                            fetchData={fetchData}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-between mb-5 mt-4">
              <div className="col-md-6 d-flex gap-2">
                <div className="col-md-6">
                  <div className="total-count-customers-line ">
                    <div>
                      <h3>Total Customers</h3>
                      <p>{formatCount(totalCustomers)}</p>
                    </div>
                    <div
                      className="SalesInvoice-cards-img"
                      style={{ background: "#2D3748" }}
                    >
                      <FaRegFileAlt />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="total-count-customers-line">
                    <div>
                      <h3>To Collect</h3>
                      <p>{formatCount(totalRevenue)}</p>
                    </div>
                    <div
                      className="SalesInvoice-cards-img"
                      style={{ background: "#2D3748" }}
                    >
                      <IoCart />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center gap-2 justify-content-end"></div>
            </div>
            <div className="row"></div>

            <div className="row customer-transction-data-change date-page">
              <div className="col-sm-8">
                <div className=" card-table">
                  <div className="card-body vendors">
                    <div className="table-responsive table-hover table-striped">
                      <Table
                        pagination={{
                          pageSize: 8,
                          total: totalPages,
                          onChange: (page) => {
                            fetchData(page);
                          },
                          itemRender: itemRender,
                        }}
                        // dataSource={customers}
                        dataSource={
                          CustomersData &&
                          CustomersData?.filter(
                            (record) =>
                              record?.name
                                ?.toLowerCase()
                                .includes(searchText.toLowerCase()) ||
                              (record?.phoneNumber &&
                                record.phoneNumber
                                  .toString()
                                  .includes(searchText))
                          )
                        }
                        loading={loading}
                        columns={columns}
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
  );
};

export default Customer;
