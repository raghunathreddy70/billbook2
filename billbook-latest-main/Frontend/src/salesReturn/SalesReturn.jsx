import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Table, Tooltip } from "antd";
import { itemRender } from "../_components/paginationfunction";
// import CreditHead from "./creditHead";
import axios from "axios";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import DeleteModal from "../invoices/Modals/DeleteModal";
import useDeleteSales from "../invoices/customeHooks/useDeleteSales";
import SalesReturnHead from "./SalesreturnHead";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { backendUrl } from "../backendUrl";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import ViewButton from "../Buttons/ViewButton";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa6";
import { PiTelegramLogoBold } from "react-icons/pi";
// import CreditHead from "../creditNotes/creditHead";

const CreditNotes = () => {
  const { SearchData } = useFiltersSales();
  const { handleDeleteSalesReturns } = useDeleteSales();

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
      value: "salesReturnDate",
    },
    {
      title: "Due Date",
      value: "dueDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Sales Return No",
      value: "salesReturnNumber",
    },
    {
      title: "Sales To",
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
  const [selectedDateVar, setSelectedDateVar] = useState("salesReturnDate");
  const [selectedSearchVar, setSelectedSearchVar] =
    useState("customerName?.name");
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
  const userData = useSelector
    ((state) => state?.user?.userData)

  const toggleContent = () => {
    setShowContent(!showContent);
  };
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchData(1);
  }, []);
  const fetchData = async (page) => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/SalesReturn/salesReturn/${userData?.data?._id}?page=${page}&pageSize=10`);
      console.log(response.data);
      setDatasource(response.data);
      setFilteredDatasource(response.data);
      setLoading(false);
      setTotalPages(response.data?.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData]);


  const [creditNotesid, setCreditNotesid] = useState("");

  const handleselectedCreditNotesidDelete = (value) => {
    setCreditNotesid(value);
  };

  const invoiceDetailsLink = (record) => {
    const {
      _id,
      salesReturnDate,
      salesReturnName,
      salesReturnNumber,
      customerName,
    } = record;
    const customerPhone = customerName?.phone;
    const customerGSTNo = customerName?.GSTNo;
    const email = customerName?.email;
    const billingAddress = customerName?.billingAddress || {};
    const { addressLine1, addressLine2, country, state, city, pincode } =
      billingAddress;

    const link =
      `/sales-return-view/${_id}?` +
      `date=${salesReturnDate}` +
      `&Name=${salesReturnName}` +
      `&Number=${salesReturnNumber}` +
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

  const columns = [
    {
      title: "Sales Return No",
      dataIndex: "salesReturnNumber",
      render: (salesReturnNumber, record) => {
        return <Link to={invoiceDetailsLink(record)}>{salesReturnNumber}</Link>;
      },
    },
    {
      title: "Sales To",
      dataIndex: "customerName",
      render: (customerName, record) => (
        <Link to={invoiceDetailsLink(record)}>{customerName?.name || "-"}</Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "salesReturnDate",
      render: (text, record) => {
        const formattedDate = new Date(
          record.salesReturnDate
        ).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
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
      title: "Action",
      dataIndex: "Action",
      render: (text, record, index) => (
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
              <PiTelegramLogoBold className="telegramicon-sales" />
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
                  to={`/sales-return-edit/${record._id}`}
                  className="dropdown-item d-flex gap-1"
                >
                  <img src="./newdashboard/editicon.png" alt="" />
                  <p>Edit</p>
                </Link>
              )}
              <Link
                className="dropdown-item d-flex gap-1"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete_modal_Comp"
                onClick={() => handleselectedCreditNotesidDelete(record._id)}
              >
                <img src="./newdashboard/deleteicon.svg" alt="" />
                <p>Delete</p>
              </Link>
              <Link
                className="dropdown-item d-flex gap-1"
                to={`/sales-return-view/${record._id}`}
              >
                <FaEye />
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
    },
  ];

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
  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            <SalesReturnHead
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
                            showTotal: (total, range) =>
                              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            showSizeChanger: true,
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
                          rowKey={(record) => record.id}
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
            handleDeleteSalesReturns({
              salesReturnId: creditNotesid,
              setDatasource: setDatasource,
              setFilteredDatasource: setFilteredDatasource,
            })
          }
          title={"Delete Sales Retun"}
        />
      </div>
    </>
  );
};

export default CreditNotes;
