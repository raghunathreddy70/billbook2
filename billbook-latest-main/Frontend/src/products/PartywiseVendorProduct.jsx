import React, { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import Select2 from "react-select2-wrapper";
import TextEditor from "./editor";
import { DropIcon } from "../_components/imagepath";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Table, Input, Space, Tooltip } from "antd";
import Data from "../assets/jsons/datatables";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import "../_components/antd.css";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import useHandleDownload from "../Hooks/useHandleDownload";
import axios from "axios";

const PartyWiseVendorProduct = ({ productid }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [downloadData, setDownloadData] = useState([]);


  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  const [menu, setMenu] = useState(false);
  const [datasource3, setDatasource3] = useState([])

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

const [vendor, setVendor] = useState([])

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/addVendor/vendors"
      );
      setVendor(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log("vendor", vendor)

  


  // useEffect(() => {
    const fetchProductReportDetails = async (productid) => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/addProduct/productReportbyvendor/${productid}`
        );
        setDatasource3(response.data);
        console.log("response partywise", response)
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
  // }, [productid]);

  useEffect(() => {
    if(productid) {
      fetchProductReportDetails(productid)
    }
  }, [productid]);

  console.log("datasource3", datasource3);

  const columns = [
    {
      title: "Party Name",
      dataIndex: "name", 
      // sorter: (a, b) => a.customerId.length - b.customerId.length,
      render: (name, record) => {
        const vendorName = vendor.find(
          (ven) => ven.vendorId === record.vendorId
        );
        return vendorName ? vendorName.name : "Unknown";
      },
    },
    {
      title: "Purchase Quantity",
      dataIndex: "products",
      render: (products) =>
        products.reduce((total, product) => total + product.quantity, 0),
      sorter: (a, b) =>
        a.products.reduce((total, product) => total + product.quantity, 0) -
        b.products.reduce((total, product) => total + product.quantity, 0),
    },
    {
      title: "Purchase Amount",
      dataIndex: "products",
      render: (products) =>
        products.reduce((total, product) => total + product.purAmount, 0),
      sorter: (a, b) =>
        a.products.reduce((total, product) => total + product.purAmount, 0) -
        b.products.reduce((total, product) => total + product.purAmount, 0),
    },
  ];


  const [toggleTabsState, setToggleTabsState] = useState(0);

  useEffect(() => {
    if (toggleTabsState !== 1 && toggleTabsState !== 2 && toggleTabsState !== 3) {
      setToggleTabsState(0)
    }
  }, [toggleTabsState])


  useEffect(() => {
    let downloadableData = datasource3;
    // let data=searchText;
    setDownloadData(downloadableData)
  }, [datasource3])
  // useEffect(()=>{
  //   let filterData = searchText;
  //   setDownloadData(filterData)
  // },[searchText])

  // useEffect(() => {
  //   if (toggleTabsState === 1) {
  //     setDownloadData(dataSource)
  //   }
  // }, [toggleTabsState])

  const handleCSVDownloadSet = () => {

    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "Party Name": item?.name,
      "Sales Quantity": item?.position,
      "Sales Amount": item?.office,
      "Purchase Quantity": item?.age,
      "Purchase Amount": item?.startDate,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Party Name", key: "name" },
      { label: "Sales Quantity", key: "position" },
      { label: "Sales Amount", key: "office" },
      { label: "Purchase Quantity", key: "age" },
      { label: "Purchase Amount", key: "startDate" },
      // Add more headers as needed
    ];


    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here

  const handlePDFDownloadSet = () => {

    // Set up table columns
    const columns = [
      "Party Name",
      "Sales Quantity",
      "Sales Amount",
      "Purchase Quantity",
      "Purchase Amount",
    ];
    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.name,
      item?.position,
      item?.office,
      item?.age,
      item?.startDate,
      // Add more fields as needed
    ]);

    handlePDFDownload({
      columns,
      rows,
      heading: "Party wise Product"
    });
  };



  // download data in pdf format code goes here
  return (
    <>
      <div className="d-flex mt-3">
        <div className="searchbar-filter mb-4">
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
        <div className="list-btn ml-3">
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
                    {/* <i className="fe fe-download" /> */}
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
        </div>
        
      </div>

      
      <div className="card-table">
        <div className="card-body DataTable">
          <div className="table-responsive table-hover">
            <Table
              columns={columns}
              dataSource={datasource3}
              pagination={{
                showTotal: (total, range) =>
                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
              }}
            />
          </div>
        </div>
      </div>
      {/* partywise report products end */}
    </>
  );
};

export default PartyWiseVendorProduct;
