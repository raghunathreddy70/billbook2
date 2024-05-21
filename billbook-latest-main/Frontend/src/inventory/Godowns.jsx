import { Table } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import { Link } from "react-router-dom";
import AddGodown from "./AddGodown";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import useHandleDownload from "../Hooks/useHandleDownload";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { RiDownloadCloud2Line } from "react-icons/ri";
import Advitise from "../customers/Advitise";
import { PiTelegramLogoBold } from "react-icons/pi";

const Godowns = () => {
  const [downloadData, setDownloadData] = useState([]);
  const [GodownList, setGodownList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(false);
  const userData = useSelector((state) => state?.user?.userData)
  const fetchGodownData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/godown/godownlist/${userData?.data?._id}`
      );
      setGodownList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGodownData();
  }, [userData]);

  console.log("GodownList", GodownList);

  const columns = [
    {
      title: "Godown Name",
      dataIndex: "godownName",
    },
    {
      title: "GodownAddress",
      dataIndex: "godownStreetAddress",
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record, index) => (
        <div className="d-flex gap-2 align-items-center">
          <div className="d-flex align-items-center">
            <Link
              to={`/godown-view/${record._id}`}
              className="btn btn-greys me-2"
            >
              <i className="fa fa-eye me-1" /> View
            </Link>
          </div>
          <div key={index} className="dropdown dropdown-action salesinvoice-action-icon-godown ">

            <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-ellipsis-h telegramicon-sales" />
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to={`/edit-invoice/${record._id}`} className="dropdown-item d-flex gap-1">
                <img src="./newdashboard/editicon.png" alt="" />
                <p>Edit</p>
              </Link>
              <Link onClick={() => handleselectedInvoiceListidDelete(record._id)} className="dropdown-item d-flex gap-1" to="#">
                <img src="./newdashboard/deleteicon.svg" alt="" />
                <p>Delete</p>
              </Link>

            </div>
          </div>
        </div>
      ),
    },
  ];

  const [addGodown1, setAddGodown1] = useState(false);
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = [
      "No.",
      "Item name",
      "Item code",
      "Stock Qty",
      "Stock Value",
      "Selling Price",
      "Purchase Price",
    ];
    // Set up table rows
    const rows = downloadData.map((item, index) => [
      index + 1,
      item?.itemName,
      item?.itemCode,
      item?.openingStock,
      item.stockValue,
      item?.salesPrice,
      item?.purchasePrice,
      // Add more fields as needed
    ]);
    handlePDFDownload({ columns, rows, heading: "Godown Management" });
  };

  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item, index) => ({
      "No.": index + 1,
      "Item name": item?.itemName,
      "Item code": item?.itemCode,
      "Stock Qty": item?.openingStock,
      "Stock Value": item.stockValue,
      "Selling Price": item?.salesPrice,
      "Purchase Price": item?.purchasePrice,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "No.", key: "id" },
      { label: "Item name", key: "itemName" },
      { label: "Item code", key: "itemCode" },
      { label: "Stock Qty", key: "openingStock" },
      { label: "Stock Value", key: "stockValue" },
      { label: "Selling Price", key: "salesPrice" },
      { label: "Purchase Price", key: "purchasePrice" },
      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };

  return (
    <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">

            <div className="content-page-header ">
              <h5>Godown Management</h5>
              {/* <div className="form-group  godown-dropdown-select">
                  <Select
                    className="w-100"
                    placeholder="Choose godown"
                    value={selectedGodown}
                    onChange={handleSelectGodown}
                  >
                    {GodownList.map((godown) => (
                      <Option key={godown.godownId} value={godown.godownId}>
                        {godown.godownName}
                      </Option>
                    ))}
                  </Select>
                </div> */}
              <div className="list-btn">
                <ul className="filter-list">
                  {/* <div className="button-list me-2">
                      <button
                        type="button"
                        className={`btn btn-primary waves-effect waves-light mt-1 me-1 ${
                          isTransferEnabled ? "enabled" : ""
                        }`}
                        disabled={!isTransferEnabled}
                        onClick={() => setTransferStock(true)}
                      >
                        Transfer Stock
                      </button>
                    </div> */}

                  <div className="button-list me-2">
                    {/* Responsive modal */}
                    <li className="me-2 add-customer-button">
                      {/* Responsive modal */}
                      {/* <Tooltip title="Add Godown" placement="top"> */}
                      <Link
                        type="button"
                        className=""
                        to="#"
                        onClick={() => setAddGodown1(true)}
                      >
                        <FaPlus className="mr-2" />
                        Create Godown

                      </Link>
                      {/* </Tooltip> */}
                      <AddGodown
                        visible={addGodown1}
                        onCancel={() => setAddGodown1(false)}
                        GodownList={GodownList}
                        setGodownList={setGodownList}
                        fetchGodownData={fetchGodownData}
                      />
                    </li>
                  </div>

                  <li className=" add-customer-button">
                    <div className="dropdown dropdown-action">
                      <Link
                        to="#"
                        className=""
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span>
                          <RiDownloadCloud2Line className="mr-2" style={{ width: '20px', height: '20px' }} />
                        </span>
                        Download
                      </Link>
                      <div className="dropdown-menu dropdown-menu-right">
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
          </div>
          <div className="row">
            <div className="col-sm-8">
              <div className=" card-table">
                <div className="card-body vendors">
                  <div className="table-responsive table-hover table-striped">
                    <Table
                      pagination={{
                        pageSize: 10,
                        total: GodownList ? GodownList.length : 0,
                        // onChange: (page) => {
                        //   fetchVendorsData(page);
                        // },
                        itemRender: itemRender,
                      }}
                      dataSource={GodownList}
                      columns={columns}
                      loading={loading}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="edit-delte-buttons-page d-flex justify-content-between">

                <Advitise />

              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Godowns;
