import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Button, Modal, Tooltip } from "antd";
import { Table, DatePicker, Typography } from "antd";
import {
  itemRender,
} from "../_components/paginationfunction";
import axios from "axios";
import useFiltersSales from "./customeHooks/useFiltersSales";
import SalesFilters from "./filters/SalesFilters";
import useDeleteSales from "./customeHooks/useDeleteSales";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { PiTelegramLogoBold } from "react-icons/pi";
import { FaArrowDown } from "react-icons/fa6";

const InvoiceOutstanding = ({ setDownloadData, toggleTabsState, showContent, datasourceUnPaid, filteredDatasourceUnPaid }) => {
  const { SearchData } = useFiltersSales();
  const { handleDeleteInvoice } = useDeleteSales();
  const [datasource, setDatasource] = useState([])
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [searchContent, setSearchContent] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [invoiceListid, setInvoiceListid] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const confirmDeleteInvoice = (invoiceId) => {
    setInvoiceListid(invoiceId);
    setIsDeleteModalVisible(true);
  };
  const dateSelectDrop = [
    {
      title: 'Created On',
      value: "invoiceDate",
    },
    {
      title: 'Due Date',
      value: "dueDate",
    }
  ];
  const searchSelectDrop = [
    {
      title: 'Invoice No.',
      value: "invoiceNumber",
    },
    {
      title: 'Invoice To',
      value: "customerName?.name",
    },
    {
      title: 'Total Amount',
      value: "grandTotal",
    },
    {
      title: 'Balance',
      value: "balance",
    },
  ]
  const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("customerName?.name");

  // filter function with customer name 
  const reversedDataSource = isFiltered ? [...filteredDatasource].reverse() : [...datasource].reverse();

  useEffect(() => {
    if (toggleTabsState === 3) {
      const fetchDownloadData = async () => {
        const data = isFiltered ? [...filteredDatasource].reverse() : [...datasource].reverse();
        let downloadableData = SearchData({ data: data, selectedVar: selectedSearchVar, searchValue: searchContent });
        setDownloadData(downloadableData)
      }
      fetchDownloadData();
    }
  }, [toggleTabsState, isFiltered, filteredDatasource, searchContent])


  const handleselectedInvoiceListidDelete = (value) => {
    setInvoiceListid(value);
  }

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/addInvoice/invoices")
  //     .then((response) => {
  //       const paidInvoices = response.data.filter(
  //         (invoice) => invoice.invoiceStatus === "UNPAID"
  //       );
  //       setDatasource(paidInvoices);
  //       setFilteredDatasource(paidInvoices);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);



  useEffect(() => {
    if (datasourceUnPaid || filteredDatasourceUnPaid) {
      const paidInvoices = datasourceUnPaid.filter(
        (invoice) => invoice.invoiceStatus === "UNPAID"
      );
      setDatasource(paidInvoices);
      setFilteredDatasource(paidInvoices);
      return;
    }
  }, [datasourceUnPaid, filteredDatasourceUnPaid]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return { bg: "#a5f990", text: "#59904B" };
      case "UNPAID":
        return { bg: "#FBE7E7", text: "#C95C5C" };
      case "PARTIALLY PAID":
        return { bg: "#FBE7E7", text: "#C95C5C" };
      default:
        return { bg: "white", text: "#333" };
    }
  };

  const [checkedRecords, setCheckedRecords] = useState([]);

  const handleCheckboxChange = (index) => {
    const isChecked = checkedRecords.includes(index);
    if (isChecked) {
      setCheckedRecords(checkedRecords.filter(item => item !== index));
    } else {
      setCheckedRecords([...checkedRecords, index]);
    }
  };
  const columns = [
    {
      title:(
        <div>
          <input type="checkbox" />
        </div>
      ) ,
      dataIndex: "customerName",
      render: (customerName, record, index) => (
        <div>
          <input
            type="checkbox"
            checked={checkedRecords.includes(index)}
            onChange={() => handleCheckboxChange(index)}
          />
        </div>
      )
    },
    {
      title: "Client",
      dataIndex: "customerName",
      render: (customerName, record) => (
        <div className="d-flex gap-2 align-items-center" style={{ width: "220px" }}>
          <img className="userbadge" src="./newdashboard/userbadge.png" alt="" />
          <Link to={`/invoice-details/${record?._id}`}>
            {customerName?.name || "N/A"}
          </Link>
        </div>
      ),
    },
    {
      title: (
        <>
        <div className="flex gap-1 items-center">

          Status <FaArrowDown className="mt-1" />
        </div>
        </>
      ),
      dataIndex: "invoiceStatus",
      render: (text, record) => {
        const { bg, text: textColor } = getStatusColor(text);
        return (
          <span
            style={{
              backgroundColor: bg,
              color: textColor,
              padding: "5px 10px",
              borderRadius: "5px",
              width: "80px", // Adjust the width as needed
              display: "inline-block", // Ensures that width property works
            }}
          >
            <Link to={`/invoice-details/${record._id}`} style={{ marginRight: '5px', fontWeight: 600 }}>
              <span style={{ fontWeight: 600, fontSize: 20 }}>.</span>{text}
            </Link>
          </span>
        );
      },
    },
    {
      title: "Invoice No",
      dataIndex: "invoiceNumber",
      render: (text, record) => (
        <Link to={`/invoice-details/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Taxes",
      dataIndex: "grandTotal",
      render: (text, record) => (
        <Link to={`/invoice-details/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
      render: (text, record) => (
        <Link to={`/invoice-details/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "invoiceDate",
      render: (text, record) => (
        <Link to={`/invoice-details/${record._id}`}>
          {new Date(record.invoiceDate).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Link>
      ),
    },
    // {
    //   title: "Balance",
    //   dataIndex: "balance",
    //   render: (text, record) => (
    //     <Link to={`/invoice-details/${record._id}`}>{text}</Link>
    //   ),
    // },
    // {
    //   title: "Due Date",
    //   dataIndex: "dueDate",
    //   render: (text, record) => (
    //     <Link to={`/invoice-details/${record._id}`}>
    //       {new Date(record.dueDate).toLocaleDateString("en-GB", {
    //         year: "numeric",
    //         month: "2-digit",
    //         day: "2-digit",
    //       })}
    //     </Link>
    //   ),
    // },
    {

      title: 'Action',
      selector: row => row.action,
      sortable: true,
      render: (text, record, index) => <div key={index} className="dropdown dropdown-action salesinvoice-action-icon">
        <Link to="#" className="action-icon dropdown-toggle"  aria-expanded="false">
       <PiTelegramLogoBold className="telegramicon-sales" />
      </Link>
       <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <i className="fas fa-ellipsis-h telegramicon-sales"  />
      </Link>
        <div className="dropdown-menu dropdown-menu-right">
          <Link to={`/edit-invoice/${record._id}`} className="dropdown-item d-flex gap-1"><img src="./newdashboard/editicon.png" alt="" /><p>Edit</p></Link>
          <Link className="dropdown-item d-flex gap-1" to="/view-invoice"><img src="./newdashboard/copyicon.png" alt="" /><p>Copy</p></Link>
          <Link onClick={() => handleselectedInvoiceListidDelete(record._id)} className="dropdown-item d-flex gap-1" to="#"><img src="./newdashboard/deleteicon.svg" alt="" /><p>Delete</p></Link>
          <Link className="dropdown-item" to="#"><h5>Export to ..</h5></Link>
          <Link className="dropdown-item  d-flex gap-1" to="#"><img src="./newdashboard/importfile.png" alt="" /><p>XML</p></Link>
          <Link className="dropdown-item  d-flex gap-1" to="#"><img src="./newdashboard/importfile.png" alt="" /><p>JSON</p></Link>
        </div>
      </div>,
      width: "250px",

    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   render: (text, record) => (
    //     <>
    //       <div className="d-flex align-items-center">
    //         <Link
    //           className="btn-action-icon me-2"
    //           to={`/edit-invoice/${record._id}`}
    //         >
    //           <EditButton />
    //         </Link>
    //         <Link
    //           className="btn-action-icon"
    //           to="#"
    //           data-bs-toggle="modal"
    //           data-bs-target="#delete_modal1"
    //           onClick={() => handleselectedInvoiceListidDelete(record._id)}
    //         >
    //           <DeleteButton />
    //         </Link>
    //       </div>
    //     </>
    //   ),
    // },
  ];

  return (
    <>
      {/* Table */}
      <div className="row my-3 mt-0">
        <div className="col-sm-12">
          <div className="card-table">
            <div className="card-body invoiceList">
              <div className="table-responsive table-hover">
                <div className="table-filter p-0">

                  {showContent && (
                    <SalesFilters datasource={datasource} dateSelectDrop={dateSelectDrop} reversedDataSource={reversedDataSource} searchContent={searchContent} searchSelectDrop={searchSelectDrop} selectedDateVar={selectedDateVar} selectedSearchVar={selectedSearchVar} setFilteredDatasource={setFilteredDatasource} setIsFiltered={setIsFiltered} setSearchContent={setSearchContent} setSelectedDateVar={setSelectedDateVar} setSelectedSearchVar={setSelectedSearchVar} />
                  )}
                </div>
                <Table
                  pagination={{
                    total: SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent }).length,
                    showTotal: (total, range) =>
                      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger: true,
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
      </div>
      {/* /Table */}



      <div className="modal custom-modal fade" id="delete_modal3" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Invoice</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button type="reset" onClick={() => handleDeleteInvoice({ invoiceId: invoiceListid, setDatasource: setDatasource, datasource: datasource, setFilteredDatasource: setFilteredDatasource })} data-bs-dismiss="modal" className="w-100 btn btn-primary paid-continue-btn">
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

export default InvoiceOutstanding;
