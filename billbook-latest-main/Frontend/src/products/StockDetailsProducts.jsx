import React, { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import Select2 from "react-select2-wrapper";
import TextEditor from "./editor";
import { DropIcon } from "../_components/imagepath";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Table, Input, Space, Tooltip } from "antd";
// import Data from "../assets/jsons/datatables";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import axios from "axios";
import "../_components/antd.css";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import useHandleDownload from "../Hooks/useHandleDownload";
const StockDetailsProducts = ({ productid }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [downloadData, setDownloadData] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //search filter
  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };


  const [menu, setMenu] = useState(false);

  const toggleMobileMenu = () => {
    setMenu(!menu);
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
  const [dataSource, setDatasource] = useState([]);
  console.log("productId", productid);

  console.log("dataSource1", dataSource);
  useEffect(() => {
    const fetchProductReportDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/addProduct/productReport/${productid}`
        );
        setDatasource(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductReportDetails();
  }, [productid]);

  console.log("dataSourceproductreport", dataSource);



  const columns = [
    {
      title: "Date",
      dataIndex: "invoiceDate",
    },
    {
      title: "Transaction Type",
      dataIndex: "invoiceName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text, record) => {
        if (
          record.invoiceName === "Sales Invoice" ||
          record.invoiceName === "Purchase Return" ||
          record.invoiceName === "Debit Notes"
        ) {
          return <span>-{text}</span>;
        } else {
          return <span>{text}</span>;
        }
      },
    },
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
    },
    {
      title: "Closing Stock",
      dataIndex: "closingStock",
    },
  ];

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
    let downloadableData = dataSource;
    setDownloadData(downloadableData);
  }, [dataSource]);

  // useEffect(() => {
  //   if (toggleTabsState === 1) {
  //     setDownloadData(dataSource)
  //   }
  // }, [toggleTabsState])

  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      Date: item?.invoiceDate,
      // Code: item?.itemCode,
      // Category: getCategory(item?.itemCategory),
      // Units: item?.measuringUnit,
      "Transaction Type": item?.invoiceName,
      Quantity: item?.quantity,
      "Invoice Number": item.invoiceNumber,
      "Closing Stock": item?.closingStock,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Date", key: "invoiceDate" },
      { label: "Transaction Type", key: "invoiceName" },
      { label: "Quantity", key: "quantity" },
      { label: "Invoice Number", key: "invoiceNumber" },
      { label: "Closing Stock", key: "closingStock" },

      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = [
      "Date",
      "Transaction Type",
      "Quantity",
      "Invoice Number",
      "Closing Stock",
    ];
    // Set up table rows
    const rows = downloadData.map((item) => [
      item.invoiceDate,
      item?.invoiceName,
      item?.quantity,
      item?.invoiceNumber,
      item?.closingStock,
      // Add more fields as needed
    ]);

    handlePDFDownload({
      columns,
      rows,
      heading: "Stock Details Product",
    });
  };

  return (
    <>
      {/* stock details products start */}
      <div className="mt-3 d-flex">
        {/* <div className="searchbar-filter mb-4">
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
        </div> */}
        {/* <div className="list-btn ml-3">
          <ul className="filter-list">
            <div className="dropdown dropdown-action w-auto button-list">
              <Tooltip title="Download" placement="top">
                <Link
                  to="#"
                  className="btn-filters btn-primary mt-1 me-1"
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
          </ul>
        </div> */}
        {/* <div className="col-md-4 col-sm-12 expenses-search">
                    <RangePicker style={{height: "46px"}} />
                  </div> */}
        {/* <div className="col-lg-3 col-md-6 col-sm-12 m-2">
                    <div className="form-group">
                        <div className="list-btn">
                            <ul className="filter-list">
                                <li className="">
                                    <div className="dropdown dropdown-action w-auto">
                                        <Link
                                            to="#"
                                            className="btn-filters"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <span>
                                                
                                                <FeatherIcon icon="download" />
                                            </span>
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                            <ul className="d-block">
                                                <li>
                                                    <Link
                                                        className="d-flex align-items-center download-item"
                                                        to="#"
                                                        download=""
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
                                                    >
                                                        <i className="far fa-file-text me-2" />
                                                        CVS
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div> */}
      </div>
      <div className="card-table">
        <div className="card-body DataTable">
          <div className="table-responsive table-hover">
            <Table
              //  className="table table-stripped table-hover datatable"
              pagination={{
                total: dataSource.length,
                showTotal: (total, range) =>
                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                showSizeChanger: true,
                onShowSizeChange: onShowSizeChange,
                itemRender: itemRender,
              }}
              columns={columns}
              dataSource={dataSource}
              // dataSource={datasource.filter(
              //   (record) =>
              //     record?.name
              //       ?.toLowerCase()
              //       .includes(searchText.toLowerCase()) ||
              //     record?.position
              //       ?.toLowerCase()
              //       .includes(searchText.toLowerCase()) ||
              //     record?.office
              //       ?.toLowerCase()
              //       .includes(searchText.toLowerCase())
              // )}
            />
          </div>
        </div>
      </div>
      {/* stock details products end */}
    </>
  );
};

export default StockDetailsProducts;
