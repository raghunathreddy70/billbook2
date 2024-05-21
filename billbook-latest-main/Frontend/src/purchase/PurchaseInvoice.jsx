import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Button, Table, Typography } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import axios from "axios";
import PurchaseListHeader from "./PurchaseListHeader";
import PaidPurchases from "./PaidPurchases";
import OverduePurchases from "./OverduePurchases";
import OutstandingPurchases from "./OutstandingPurchases";
import { DatePicker } from "antd";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import useDeleteSales from "../invoices/customeHooks/useDeleteSales";
import useSalesUrlHandler from "../invoices/customeHooks/useSalesUrlHandler";
import DeleteModal from "../invoices/Modals/DeleteModal";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import ViewButton from "../Buttons/ViewButton";
import { useSelector } from "react-redux";
import { PiTelegramLogoBold } from "react-icons/pi";
const { RangePicker } = DatePicker;
const { Text } = Typography;

const PurchaseInvoice = ({ active }) => {

  const userData = useSelector((state) => state?.user?.userData)
  const { SearchData } = useFiltersSales();
  const { handleDeletePurchase } = useDeleteSales();
  const [showContent, setShowContent] = useState(false);
  const [menu, setMenu] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [show, setShow] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [deletedPurchase, setDeletedPurchase] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [customerNameFilter, setCustomerNameFilter] = useState("");

  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);

  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: "Purchase Date",
      value: "purchasesDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Purchase To",
      value: "vendorName",
    },
    {
      title: "Purchase ID",
      value: "purchaseNumber",
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
  const [selectedDateVar, setSelectedDateVar] = useState("purchasesDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("vendorName?.vendorName");
  const [searchContent, setSearchContent] = useState(null);
  const { getParameter, appendOrUpdateParameter } = useSalesUrlHandler();
  let foundActiveState = getParameter("activeTab");
  let convertedToNumberActiveState = Number(foundActiveState);

  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();

  useEffect(() => {
    if (convertedToNumberActiveState === 0) {
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
  }, [isFiltered, filteredDatasource, searchContent]);

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const [purchaseListid, setPurchaseListid] = useState("");

  const handlePurchaseListidDelete = (value) => {
    setPurchaseListid(value);
  };

  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = async (page) => {
    try {
      if (userData?.data?._id) {
        setLoading(true)
        const response = await axios.get(`http://localhost:8000/api/addPurchases/purchases/${userData?.data?._id}?page=${page}&pageSize=10`);
        setDatasource(response.data)
        setLoading(false);
        setTotalPages(response.data?.length);
        setFilteredDatasource(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, [userData]);

  console.log("datascccource", datasource)



  const invoiceDetailsLink = (record) => {
    const { _id, purchasesDate, purchaseName, purchaseNumber, name } = record;
    const customerPhone = name?.phoneNumber;
    const customerGSTNo = name?.GSTNo;
    const email = name?.email;
    const addressLine1 = name?.addressLine1;
    const addressLine2 = name?.addressLine2;

    const link =
      `/purchases-details/${_id}?` +
      `date=${purchasesDate}` +
      `&Name=${purchaseName}` +
      `&Number=${purchaseNumber}` +
      `&name=${name?.name}` +
      `&phone=${customerPhone}` +
      `&GSTNo=${customerGSTNo}` +
      `&email=${email}` +
      `&addressLine1=${addressLine1}` +
      `&addressLine2=${addressLine2}`;

    return link;
  };

  const columns = [
    {
      title: "Purchase To",
      dataIndex: "vendorName",
      render: (name, record) => (
        <div className="d-flex gap-2 align-items-center">
          <img className="userbadge" src="./newdashboard/userbadge.png" alt="" />
          <Link to={invoiceDetailsLink(record)}>{name || "N/A"}</Link>
        </div>
      ),
    },
    {
      title: "Purchase ID",
      dataIndex: "purchaseNumber",
      render: (purchaseNumber, record) => (
        <Link to={invoiceDetailsLink(record)}>{purchaseNumber}</Link>
      ),
    },
    {
      title: "Purchase Date",
      dataIndex: "purchasesDate",
      render: (text, record) => {
        const formattedDate = new Date(record.purchasesDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return (
          <Link to={invoiceDetailsLink(record)}>
            <span>{formattedDate}</span>
          </Link>
        );
      },
    },
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
      render: (purchaseNumber, record) => (
        <Link to={invoiceDetailsLink(record)}>{record.grandTotal}</Link>
      ),
    },

    {
      title: 'Action',
      selector: row => row.action,
      sortable: true,
      render: (text, record, index) => (
        <div key={index} className="dropdown dropdown-action salesinvoice-action-icon">
          {/* <span className="d-flex">
          <Link to={`/purchases-details/${record._id}`}>
            <ViewButton />
          </Link>
        </span> */}
          {/* <Link to="#" className="action-icon dropdown-toggle"  aria-expanded="false">
            <PiTelegramLogoBold className="telegramicon-sales" />
          </Link> */}
          <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fas fa-ellipsis-h telegramicon-sales" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link to={`/edit-purchases/${record._id}`} className="dropdown-item d-flex gap-1">
              <img src="./newdashboard/editicon.png" alt="" />
              <p>Edit</p>
            </Link>

            <Link className="dropdown-item d-flex gap-1"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal_Comp"
              onClick={() => handlePurchaseListidDelete(record._id)}
            >
              <img src="./newdashboard/deleteicon.svg" alt="" />
              <p>Delete</p>
            </Link>
            <Link className="dropdown-item" to="#">
              <h5>Export to ..</h5>
            </Link>
            <Link className="dropdown-item d-flex gap-1" to="#">
              <img src="./newdashboard/importfile.png" alt="" />
              <p>PDF</p>
            </Link>

          </div>
        </div>
      ),
    },

  ];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className={`page-wrapper ${active && "ml-0 pt-[20px]"}`}>
          <div className={`content container-fluid ${active && "p-0"}`}>
            {/* Page Header */}
            <PurchaseListHeader
              setShow={setShow}
              show={show}
              showContent={showContent}
              toggleContent={toggleContent}
              dataSourceDownload={downloadData}
              active={active}
              toggleTabsState={convertedToNumberActiveState}
            />
            {/* /Page Header */}

            <div className="row">
              <div className="col-md-12">
                <div className="card bg-white">
                  <div className="card-body">
                    {/* <ul className="nav nav-tabs"> */}
                    {/* <li className="nav-item">
                        <a
                          onClick={() =>
                            appendOrUpdateParameter({
                              paramKey: "activeTab",
                              paramValue: 0,
                            })
                          }
                          className={`nav-link ${
                            convertedToNumberActiveState === 0 && "active"
                          }`}
                          href="#products1"
                          data-bs-toggle="tab"
                        >
                          All Invoices
                        </a>
                      </li> */}
                    {/* <li className="nav-item">
                        <a
                          onClick={() =>
                            appendOrUpdateParameter({
                              paramKey: "activeTab",
                              paramValue: 1,
                            })
                          }
                          className={`nav-link ${
                            convertedToNumberActiveState === 1 && "active"
                          }`}
                          href="#products2"
                          data-bs-toggle="tab"
                        >
                          Paid
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          onClick={() =>
                            appendOrUpdateParameter({
                              paramKey: "activeTab",
                              paramValue: 3,
                            })
                          }
                          className={`nav-link ${
                            convertedToNumberActiveState === 3 && "active"
                          }`}
                          href="#products4"
                          data-bs-toggle="tab"
                        >
                          UnPaid
                        </a>
                      </li> */}
                    {/* </ul> */}
                    {/* <div className="tab-content">
                      <div
                        className={`tab-pane ${
                          convertedToNumberActiveState === 0 && "show active"
                        } `}
                        id="products1"
                      > */}
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
                                    setFilteredDatasource={
                                      setFilteredDatasource
                                    }
                                    setIsFiltered={setIsFiltered}
                                    setSearchContent={setSearchContent}
                                    setSelectedDateVar={setSelectedDateVar}
                                    setSelectedSearchVar={
                                      setSelectedSearchVar
                                    }
                                  />
                                )}
                              </div>
                              <Table
                                pagination={{
                                  pageSize: 10,
                                  total: totalPages,
                                  onChange: (page) => {
                                    fetchData(page);
                                  },
                                  // total: SearchData({
                                  //   data: reversedDataSource,
                                  //   selectedVar: selectedSearchVar,
                                  //   searchValue: searchContent,
                                  // }).length,
                                  // showTotal: (total, range) =>
                                  //   `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                  // showSizeChanger: true,
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


                      <DeleteModal
                        deleteFunction={() =>
                          handleDeletePurchase({
                            purchasesId: purchaseListid,
                            setDatasource: setDatasource,
                            setFilteredDatasource: setFilteredDatasource,
                          })
                        }
                        title={"Delete Purchase Invoice"}
                      />
                      {/* 
                      <div
                        className={`tab-pane ${
                          convertedToNumberActiveState === 1 && "show active"
                        } `}
                        id="products2"
                      >
                        <PaidPurchases
                          setDownloadData={setDownloadData}
                          toggleTabsState={convertedToNumberActiveState}
                          showContent={showContent}
                          datasourcePaid={datasource}
                          filteredDatasourcePaid={filteredDatasource}
                        />
                      </div> */}


                      {/* 
                      <div
                        className={`tab-pane ${
                          convertedToNumberActiveState === 3 && "show active"
                        } `}
                        id="products4"
                      >
                        <OutstandingPurchases
                          setDownloadData={setDownloadData}
                          toggleTabsState={convertedToNumberActiveState}
                          showContent={showContent}
                          datasourceUnPaid={datasource}
                          filteredDatasourceUnPaid={filteredDatasource}
                        />
                      </div> */}
                    </div>
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

export default PurchaseInvoice;
