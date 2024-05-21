import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Button, Modal, Tooltip } from "antd";
import { Table, DatePicker, Typography } from "antd";
import { itemRender } from "../_components/paginationfunction";
import axios from "axios";
import useFiltersSales from "./customeHooks/useFiltersSales";
import SalesFilters from "./filters/SalesFilters";
import useDeleteSales from "./customeHooks/useDeleteSales";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const Invoiceoverdue = ({ setDownloadData, toggleTabsState, showContent, datasourceUnPaid, filteredDatasourceUnPaid }) => {

  const { SearchData } = useFiltersSales();
  const { handleDeleteInvoice } = useDeleteSales();
  const [datasource, setDatasource] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [searchContent, setSearchContent] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const confirmDeleteInvoice = (invoiceId) => {
    setInvoiceListid(invoiceId);
    setIsDeleteModalVisible(true);
  };
  const dateSelectDrop = [
    {
      title: "Created On",
      value: "invoiceDate",
    },
    {
      title: "Due Date",
      value: "dueDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Invoice No.",
      value: "invoiceNumber",
    },
    {
      title: "Invoice To",
      value: "customerName?.name",
    },
    {
      title: "Total Amount",
      value: "grandTotal",
    },
    {
      title: "Balance",
      value: "balance",
    },
  ];
  const [selectedDateVar, setSelectedDateVar] = useState("invoiceDate");
  const [selectedSearchVar, setSelectedSearchVar] =
    useState("customerName?.name");
  const [dateRange, setDateRange] = useState([]);

  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();

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

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "#33B469";
      case "UNPAID":
        return "#ed2020";
      case "PARTIALLY PAID":
        return "#f9dc0b";
      default:
        return "white";
    }
  };

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/api/addInvoice/invoices")
  //     .then((response) => {
  //       const paidInvoices = response.data.filter(
  //         (invoice) => invoice.invoiceStatus === "PARTIALLY PAID"
  //       );
  //       setDatasource(paidInvoices);
  //       setFilteredDatasource(paidInvoices);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);



  const [invoiceListid, setInvoiceListid] = useState("");
  const handleselectedInvoiceListidDelete = (value) => {
    setInvoiceListid(value);
  };

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "invoiceNumber",
      render: (text, record) => (
        <Link to={`/invoice-details/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Invoice To",
      dataIndex: "customerName",
      render: (customerName, record) => (
        <Link to={`/invoice-details/${record._id}`}>
          {customerName?.name || "N/A"}
        </Link>
      ),
    },
    {
      title: "Created On",
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
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
      render: (text, record) => (
        <Link to={`/invoice-details/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (text, record) => (
        <Link to={`/invoice-details/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text, record) => (
        <Link to={`/invoice-details/${record._id}`}>
          {new Date(record.dueDate).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "invoiceStatus",
      sorter: (a, b) => a.invoiceStatus.localeCompare(b.invoiceStatus),
      render: (text) => (
        <span
          style={{
            backgroundColor: getStatusColor(text),
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              className="btn-action-icon me-2"
              to={`/edit-invoice/${record._id}`}
            >
              <div className="bg-[#e1ffed] p-1 rounded">
                <FeatherIcon icon="edit" className="text-[#1edd6a] " />
              </div>
            </Link>
            <Link
              className="btn-action-icon"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal2"
              onClick={() => handleselectedInvoiceListidDelete(record._id)}
            >
              <div className=" bg-[#ffeded] p-1 rounded">
                <FeatherIcon icon="trash-2" className="text-[#ed2020]" />
              </div>
            </Link>
          </div>
        </>
      ),
    },
  ];

  const handleDownloadSingleData = (record) => {
    const singleDataWorkbook = XLSX.utils.book_new();
    const singleDataWorksheet = XLSX.utils.json_to_sheet([record]);
    XLSX.utils.book_append_sheet(
      singleDataWorkbook,
      singleDataWorksheet,
      "SingleData"
    );
    XLSX.writeFile(singleDataWorkbook, "single_data.xlsx");
  };

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
                    <SalesFilters
                      datasource={datasource}
                      dateSelectDrop={dateSelectDrop}
                      reversedDataSource={reversedDataSource}
                      searchContent={searchContent}
                      searchSelectDrop={searchSelectDrop}
                      selectedDateVar={selectedDateVar}
                      selectedSearchVar={selectedSearchVar}
                      setFilteredDatasource={setFilteredDatasource}
                      setIsFiltered={setIsFiltered}
                      setSearchContent={setSearchContent}
                      setSelectedDateVar={setSelectedDateVar}
                      setSelectedSearchVar={setSelectedSearchVar}
                    />
                  )}
                </div>
                <Table
                  pagination={{
                    total: SearchData({
                      data: reversedDataSource,
                      selectedVar: selectedSearchVar,
                      searchValue: searchContent,
                    }).length,
                    showTotal: (total, range) =>
                      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger: true,
                    itemRender: itemRender,
                  }}
                  columns={columns}
                  dataSource={SearchData({
                    data: reversedDataSource,
                    selectedVar: selectedSearchVar,
                    searchValue: searchContent,
                  })}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Table */}

      <div className="modal custom-modal fade" id="delete_modal2" role="dialog">
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
                    <button
                      type="reset"
                      onClick={() =>
                        handleDeleteInvoice({
                          invoiceId: invoiceListid,
                          setDatasource: setDatasource,
                          datasource: datasource,
                          setFilteredDatasource: setFilteredDatasource,
                        })
                      }
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

export default Invoiceoverdue;
