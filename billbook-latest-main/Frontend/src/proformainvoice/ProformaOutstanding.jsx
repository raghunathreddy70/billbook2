import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import "../_components/antd.css";
import { Pagination, Table, Typography } from "antd";
import Data from "../assets/jsons/creditNotes";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import * as XLSX from 'xlsx';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
const { Text } = Typography;

const ProformaOutstanding = () => {

  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const handleDownloadFilteredData = () => {
    const filteredDataWorkbook = XLSX.utils.book_new();
    const filteredDataWorksheet = XLSX.utils.json_to_sheet(filteredDatasource);
    XLSX.utils.book_append_sheet(filteredDataWorkbook, filteredDataWorksheet, 'FilteredData');
    XLSX.writeFile(filteredDataWorkbook, 'filtered_data.xlsx');
  };

  const handleDownloadAllData = () => {
    const allDataWorkbook = XLSX.utils.book_new();
    const allDataWorksheet = XLSX.utils.json_to_sheet(datasource);
    XLSX.utils.book_append_sheet(allDataWorkbook, allDataWorksheet, 'AllData');
    XLSX.writeFile(allDataWorkbook, 'all_data.xlsx');
  };


  // filter function with customer name 
  const handleCustomerNameFilterChange = (e) => {
    const value = e.target.value;
    setCustomerNameFilter(value);

    const filteredData = filterData(datasource, dateRange, value, customerNameFilter);
    console.log(filterData)
    setFilteredDatasource(filteredData);
  };
  // Function to filter data based on date range and customer name
  const filterData = (data, dateRange, customerNameFilter) => {
    console.log(data, dateRange, customerNameFilter, 'hhhhhh')
    return data.filter((record) => {
      const invoiceDate = new Date(record.invoiceDate);
      const dateInRange =
        (!dateRange[0] || invoiceDate >= dateRange[0]) &&
        (!dateRange[1] || invoiceDate <= dateRange[1]);

      const customerNameMatch =
        typeof record?.customerName?.name === 'string' &&
        record.customerName.name.toLowerCase().includes(customerNameFilter.toLowerCase());

      return dateInRange && customerNameMatch;
    });
  };
  // filter function with customer name 

  const reversedDataSource = filteredDatasource ? [...filteredDatasource].reverse() : [];


  const handleDateRangeChange = (dates) => {
    setDateRange(dates);

    // Filter invoices based on the selected date range
    const filteredData = datasource.filter((record) => {
      const invoiceDate = new Date(record.invoiceDate);
      return invoiceDate >= dates[0] && invoiceDate <= dates[1];
    });

    setFilteredDatasource(filteredData);
  };
  const [showContent, setShowContent] = useState(false)
  const toggleContent = () => {
    setShowContent(!showContent)
  }
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const datasource = Data?.Data;
  console.log(datasource);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (text, record) => <Link to={`/proforma-details/${record._id}`}>{text}</Link>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Credit Notes ID",
      dataIndex: "Credit",
      render: (text, record) => (
        <Link to={`/proforma-details/${record._id}`} className="invoice-link">
          {text}
        </Link>
      ),
      sorter: (a, b) => a.Credit.length - b.Credit.length,
    },
    {
      title: "Customer",
      dataIndex: "Name",
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link to={`/proforma-details/${record._id}`} className="avatar avatar-sm me-2">
            <img
              className="avatar-img rounded-circle"
              src={record.Img}
              alt="User Image"
            />
          </Link>
          <Link to={`/proforma-details/${record._id}`}>
            {text} <span>{record.email}</span>
          </Link>
        </h2>
      ),
      sorter: (a, b) => a.Name.length - b.Name.length,
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      render: (text, record) => <Link to={`/proforma-details/${record._id}`}>{text}</Link>,
      sorter: (a, b) => a.Amount.length - b.Amount.length,
    },
    {
      title: "Payment Mode",
      dataIndex: "Payment",
      render: (text, record) => <Link to={`/proforma-details/${record._id}`}>{text}</Link>,
      sorter: (a, b) => a.Payment.length - b.Payment.length,
    },
    {
      title: "Created On",
      dataIndex: "Created",
      render: (text, record) => {
        const formattedDate = new Date(record.Created).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return (
          <Link to={`/proforma-details/${record._id}`}>
            <span>{formattedDate}</span>
          </Link>
        );
      },
      sorter: (a, b) => a.Created.length - b.Created.length,
    },
    {
      title: "Status",
      dataIndex: "StatusOverdue",
      render: (text, record) => (
        <Link to={`/proforma-details/${record._id}`}>
          <span className="badge bg-light-gray text-gray-light">{text}</span>
        </Link>
      ),
      sorter: (a, b) => a.StatusOverdue.length - b.StatusOverdue.length,
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              className="btn-action-icon me-2"
              to="#"
              download=""
            >
              <FeatherIcon icon="download" />
            </Link>
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="btn-action-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-right">
                <ul>
                  <li>
                    <Link className="dropdown-item" to={`/edit-credit-notes/${record.id}`}>
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
                  {/* <li>
                    <Link
                      className="dropdown-item"
                      to={`/credit-notes-details/${record.id}`}
                    >
                      <i className="far fa-eye me-2" />
                      View
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </>
      ),
      sorter: (a, b) => a.Action.length - b.Action.length,
    },
  ];
  

  return (
    <>
      {/* Table */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card-table">
            <div className="card-body creditNotes">
              <div className="table-responsive table-hover">
                <div className="table-filter">
                  {showContent && (
                    <div className="row">
                      <div className="col-md-6 my-2">
                        <RangePicker onChange={handleDateRangeChange} />

                        <input
                          type="text"
                          placeholder="Enter Customer Name"
                          value={customerNameFilter}
                          onChange={handleCustomerNameFilterChange}
                        />
                        {dateRange.length > 0 && (
                          <>
                            <Text>
                              Total Invoices after filter: {filteredDatasource.length}
                            </Text>
                            <Button onClick={handleDownloadFilteredData} style={{ marginLeft: 10 }} className="my-2">
                              Download Filtered Data
                            </Button>
                            <Button onClick={toggleContent} classNames="ResetButton" style={{ marginLeft: 10, background: "rgb(237, 32, 32)" }} className="my-2" >
                              {showContent ? 'Reset' : 'Filters'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                </div>
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
                    record?.Credit?.includes(searchText) ||
                    record?.Name
                      ?.toLowerCase().includes(searchText.toLowerCase()) ||
                    record?.email.toLowerCase().includes(searchText.toLowerCase())
                  )}
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
                <h3>Delete Credit Notes</h3>
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
    </>
  );
};

export default ProformaOutstanding;
