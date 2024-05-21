import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Table, Tooltip } from "antd";
import { itemRender } from "../_components/paginationfunction";
import CreditHead from "./creditHead";
import axios from "axios";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import DeleteModal from "../invoices/Modals/DeleteModal";
import useDeleteSales from "../invoices/customeHooks/useDeleteSales";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { backendUrl } from "../backendUrl";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import { CloudOff } from "feather-icons-react/build/IconComponents";
import ViewButton from "../Buttons/ViewButton";
import { useSelector } from "react-redux";
import { PiTelegramLogoBold } from "react-icons/pi";

const CreditNotes = () => {
  const { SearchData } = useFiltersSales();
  const { handleDeleteCreditnotes } = useDeleteSales();

  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);

  const [datasource, setDatasource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredDatasource, setFilteredDatasource] = useState([]);

  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: "Date",
      value: "creditnotesDate",
    },
    {
      title: "Due Date",
      value: "dueDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Credit Notes No",
      value: "creditnotesNumber",
    },
    {
      title: "Credit Notes To",
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

  const [selectedDateVar, setSelectedDateVar] = useState("creditnotesDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState(
    "customerName?.name"
  );
  const [searchContent, setSearchContent] = useState(null);

  useEffect(() => {
    if (
      toggleTabsState !== 1 &&
      toggleTabsState !== 2 &&
      toggleTabsState !== 3
    ) {
      setToggleTabsState(0);
    }
  }, [toggleTabsState]);

  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();

  useEffect(() => {
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
  }, [isFiltered, filteredDatasource, searchContent, datasource]);

  const [showContent, setShowContent] = useState(false);

  const toggleContent = () => {
    setShowContent(!showContent);
  };
  const userData = useSelector((state) => state?.user?.userData)
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchData(1);
  }, [userData]);
  const fetchData = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/creditNotes/creditNotes/${userData?.data?._id}?page=${page}&pageSize=10`
      );
      setDatasource(response.data);
      setFilteredDatasource(response.data);
      setLoading(false);
      setTotalPages(response.data?.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    };
  }

  console.log("datasourcedss", datasource);
  console.log("datasourcedss", datasource);

  const [creditNotesid, setCreditNotesid] = useState("");

  const handleselectedCreditNotesidDelete = (value) => {
    setCreditNotesid(value);
  };

  const invoiceDetailsLink = (record) => {
    const {
      _id,
      creditnotesDate,
      invoiceName,
      creditnotesNumber,
      customerName,
    } = record;

    const customerPhone = customerName?.phone;
    const customerGSTNo = customerName?.GSTNo;
    const email = customerName?.email;
    const billingAddress = customerName?.billingAddress || {};
    const { addressLine1, addressLine2, country, state, city, pincode } =
      billingAddress;

    const link =
      `/credit-notes-details/${_id}?` +
      `date=${creditnotesDate}` +
      `&Name=${invoiceName}` +
      `&Number=${creditnotesNumber}` +
      `&name=${customerName?.name}` +
      `&phone=${customerPhone}` +
      `&GSTNo=${customerGSTNo}` +
      `&email=${email}` +
      `&addressLine1=${addressLine1}` +
      `&addressLine2=${addressLine2}` +
      `&country=${country}` +
      `&state=${state}` +
      `&city=${city}` +
      `&pincode=${pincode}`;

    return link;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "#DAFED1";
      case "UNPAID":
        return "#FBE7E7";
      case "PARTIALLY PAID":
        return "#f9dc0b";
      default:
        return "white";
    }
  };
  const getTextColor = (text) => {
    switch (text) {
      case "PAID":
        return "#59904B";
      case "UNPAID":
        return "#C95C5C";
      case "PARTIALLY PAID":
        return "#f9dc0b";
      default:
        return "white";
    }
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [active, setActive] = useState(false);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    console.log("selectedRowKeys", selectedRowKeys);
    if (selectedRowKeys.length > 0) {
      setActive(true);
    } else {
      setActive(false);
    }
    let totalPaymentAmount = 0;
    let invoiceid = [];
    selectedRows.forEach((row) => {
      totalPaymentAmount += row.balance;
      invoiceid.push(row._id);
    });
    console.log(selectedRows, "selectedrows");
    if (totalPaymentAmount > 0) {
      // setValidation({
      //   ...validation,
      //   amount: true,
      // });
    }
    // setFormData({
    //   ...formData,
    //   amount: totalPaymentAmount,
    //   invoiceId: invoiceid,
    // });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: "checkbox",
  };
  const columns = [
    {
      title: "Credit Notes No",
      dataIndex: "creditnotesNumber",
      render: (creditnotesNumber, record) => {
        return <Link to={invoiceDetailsLink(record)}>{creditnotesNumber}</Link>;
      },
    },
    {
      title: "Credit Notes To",
      dataIndex: "customerName",
      render: (customerName, record) => (
        <Link to={invoiceDetailsLink(record)}>
          {customerName?.name || "N/A"}
        </Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "creditnotesDate",
      render: (text, record) => {
        const formattedDate = new Date(record.creditnotesDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return <Link to={invoiceDetailsLink(record)}>{formattedDate}</Link>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>{record.grandTotal}</Link>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>{text}</Link>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text, record) => {
        const formattedDate = new Date(record.dueDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return <Link to={invoiceDetailsLink(record)}>{formattedDate}</Link>;
      },
    },
    {
      title: "Status",
      dataIndex: "invoiceStatus",
      render: (text, record) => (
        <span
          style={{
            backgroundColor: getStatusColor(text),
            color: getTextColor(text),
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          <Link to={invoiceDetailsLink(record)}><span>.</span>{text}</Link>
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record,index) => (
        <>
          <div
            key={index}
            className="dropdown dropdown-action salesinvoice-action-icon"
          >
            <Link
              to="#"
              className="action-icon dropdown-toggle"
              aria-expanded="false"
            >
              <PiTelegramLogoBold className="telegramicon-sales"  />
            </Link>
            <Link
              to="#"
              className="action-icon dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-h telegramicon-sales" />
            </Link>

            <div className="dropdown-menu dropdown-menu-right">
              {record.balance === 0 ? (
                <Tooltip title="This Invoice cannot be Edited" placement="top">
                  <div className="dropdown-item d-flex gap-1">
                    <img src="./newdashboard/editicon.png" alt="" />
                    <p>Edit</p>
                  </div>
                </Tooltip>
              ) : (
                <Link
                  to={`/credit-edit/${record._id}`}
                  className="dropdown-item d-flex gap-1"
                >
                  <img src="./newdashboard/editicon.png" alt="" />
                  <p>Edit</p>
                </Link>
              )}
              <Link
                onClick={() => handleselectedCreditNotesidDelete(record._id)}
                className="dropdown-item d-flex gap-1"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete_modal_Comp"
              >
                <img src="./newdashboard/deleteicon.svg" alt="" />
                <p>Delete</p>
              </Link>
              <Link
                className="dropdown-item d-flex gap-1"
                to={`/credit-notes-details/${record._id}`}
              >
                <i className="fa fa-eye me-1" />
                <p>View</p>
              </Link>
              <Link className="dropdown-item" to="#">
                <h5>Export to ..</h5>
              </Link>
              <div className="dropdown-item d-flex gap-1" onClick={() => handleDownloadPDF(record)}>
                <img src="./newdashboard/importfile.png" alt="" />
                <p>PDF</p>
              </div>
              {/* <Link className="dropdown-item d-flex gap-1" to="#">
              <img src="./newdashboard/importfile.png" alt="" />
              <p>CSV</p>
            </Link> */}
            </div>
          </div>
        </>
      ),
    }
  ];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <CreditHead
              setShow={setShow}
              show={show}
              searchText={searchText}
              setSearchText={setSearchText}
              showContent={showContent}
              toggleContent={toggleContent}
              dataSourceDownload={downloadData}
              toggleTabsState={toggleTabsState}

            />
            <div className="tab-pane show active" id="salesinvoice1">
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
                          key="credit-notes-table"
                          pagination={{
                            pageSize: 10,
                            total: totalPages,
                            onChange: (page) => {
                              fetchData(page);
                            },
                            // showTotal: (total, range) =>
                            //   `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            // showSizeChanger: true,
                            itemRender: itemRender,
                          }}
                          rowSelection={rowSelection}
                          columns={columns}
                          dataSource={SearchData({
                            data: reversedDataSource,
                            selectedVar: selectedSearchVar,
                            searchValue: searchContent,
                          })}
                          loading={loading}
                          rowKey={(record) => record._id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Table */}
            </div>
          </div>
        </div>

        <DeleteModal
          deleteFunction={() =>
            handleDeleteCreditnotes({
              creditnotesId: creditNotesid,
              setDatasource: setDatasource,
              setFilteredDatasource: setFilteredDatasource,
            })
          }
          title={"Delete Credit Note"}
        />
        <DeleteModal
          deleteFunction={() =>
            handleDeleteCreditnotes({
              creditnotesId: creditNotesid,
              setDatasource: setDatasource,
              setFilteredDatasource: setFilteredDatasource,
            })
          }
          title={"Delete Credit Note"}
        />
      </div>
    </>
  );
};

export default CreditNotes;
