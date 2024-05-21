import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import { Table, Tooltip } from "antd";
import {
  itemRender,
} from "../_components/paginationfunction";
import axios from "axios";
import InvoiceProHead from "./InvoiceProHead";
import useFiltersSales from "./customeHooks/useFiltersSales";
import SalesFilters from "./filters/SalesFilters";
import useDeleteSales from "./customeHooks/useDeleteSales";
import DeleteModal from "./Modals/DeleteModal";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import ViewButton from "../Buttons/ViewButton";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa6";
import { PiTelegramLogoBold } from "react-icons/pi";

const ProformaInvoice = () => {
  const { SearchData } = useFiltersSales();
  const { handleProformaDelete } = useDeleteSales();

  const [showContent, setShowContent] = useState(false);

  const toggleContent = () => {
    setShowContent(!showContent);
  };
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);

  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: "Created On",
      value: "performaDate",
    },
    {
      title: "Due Date",
      value: "dueDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Proforma ID",
      value: "proformaNumber",
    },
    {
      title: "Proforma To",
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
  const [selectedDateVar, setSelectedDateVar] = useState("performaDate");
  const [selectedSearchVar, setSelectedSearchVar] =
    useState("customerName?.name");
  const [searchContent, setSearchContent] = useState(null);

  const [downloadData, setDownloadData] = useState([]);
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

  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource].reverse();
  useEffect(() => {
    const fetchDownloadData = async () => {
      let downloadableData = SearchData({
        data: reversedDataSource,
        selectedVar: selectedSearchVar,
        searchValue: searchContent,
      });
      setDownloadData(downloadableData);
    };
    fetchDownloadData();
  }, [reversedDataSource, selectedSearchVar, searchContent, SearchData]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchData(1);
  }, []);

  const userData = useSelector((state) => state?.user?.userData)

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/performa/Proforma/${userData?.data?._id}?page=${page}&pageSize=10`
      );
      setDatasource(response.data);
      setFilteredDatasource(response.data);
      setLoading(false);
      setTotalPages(response.data?.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData]);

  const [proformaInvoiceid, setProformaInvoiceid] = useState("");

  const handleselectedProformaInvoiceidDelete = (value) => {
    setProformaInvoiceid(value);
  };

  const invoiceDetailsLink = (record) => {
    const { _id, performaDate, proformaName, proformaNumber, customerName } =
      record;
    const customerPhone = customerName?.phone;
    const customerGSTNo = customerName?.GSTNo;
    const email = customerName?.email;
    const billingAddress = customerName?.billingAddress || {};
    const { addressLine1, addressLine2, country, state, city, pincode } = billingAddress;

    const link = `/proforma-details/${_id}?` +
      `date=${performaDate}` +
      `&Name=${proformaName}` +
      `&Number=${proformaNumber}` +
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
      title: "Proforma ID",
      dataIndex: "proformaNumber",
      render: (proformaNumber, record) => {
        return (
          <Link to={invoiceDetailsLink(record)}>
            <h2 className="table-avatar">{proformaNumber}</h2>
          </Link>
        )
      }
    },
    {
      title: "Proforma To",
      dataIndex: "customerName",
      render: (customerName, record) => (
        <Link to={invoiceDetailsLink(record)}>
          {customerName?.name || "N/A"}
        </Link>
      ),
    },
    {
      title: "Created On",
      dataIndex: "performaDate",
      render: (text, record) => {
        const formattedDate = new Date(record.performaDate).toLocaleDateString(
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
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>
          <h2 className="table-avatar">{record.grandTotal}</h2>
        </Link>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (text, record) => (
        <Link to={invoiceDetailsLink(record)}>
          <h2 className="table-avatar">{record.balance}</h2>
        </Link>
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
        return (
          <Link to={invoiceDetailsLink(record)}>
            <span>{formattedDate}</span>
          </Link>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record,index) => (
        <>
          {/* <div className="d-flex align-items-center">
            <span className="d-flex">
              <Link to={`/proforma-details/${record._id}`}>
                <ViewButton />
              </Link>
            </span>

            {record.balance === 0 ? (
              <Tooltip title="This Invoice cannot be Edited" placement="top">
                <div className="btn-action-icon me-2">
                  <EditButton />
                </div>
              </Tooltip>
            ) : (
              <Link
                className="btn-action-icon me-2"
                to={`/edit-proforma/${record._id}`}
              >
                <EditButton />
              </Link>
            )}
            <Link
              className="btn-action-icon"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal_Comp"
              onClick={() => handleselectedProformaInvoiceidDelete(record._id)}
            >
              <DeleteButton />
            </Link>

          </div> */}
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
                  to={`/edit-proforma/${record._id}`}
                  className="dropdown-item d-flex gap-1"
                >
                  <img src="./newdashboard/editicon.png" alt="" />
                  <p>Edit</p>
                </Link>
              )}
              <Link
                onClick={() => handleselectedProformaInvoiceidDelete(record._id)}
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
                to={`/proforma-details/${record._id}`}
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
            <InvoiceProHead
              toggleTabsState={toggleTabsState}
              setShow={setShow}
              show={show}
              showContent={showContent}
              toggleContent={toggleContent}
              dataSourceDownload={downloadData}
            />
            {/* <InvoiceProHead setShow={setShow} show={show} downloadData={downloadData} toggleTabsState={toggleTabsState} /> */}

            <div className="tab-pane show active" id="proforma1">
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
                            // total: SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent }).length,
                            // showTotal: (total, range) =>
                            //   `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            // showSizeChanger: true,
                            itemRender: itemRender,
                          }}
                          // rowSelection={rowSelection}
                          columns={columns}
                          rowSelection={rowSelection}
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
              <DeleteModal
                deleteFunction={() =>
                  handleProformaDelete({
                    proformaInvoiceid: proformaInvoiceid,
                    setDatasource: setDatasource,
                    setFilteredDatasource: setFilteredDatasource,
                  })
                }
                title={"Delete Proforma Invoice"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProformaInvoice;
