import React, { useEffect, useState } from "react";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import useHandleDownload from "../../../Hooks/useHandleDownload";
import SalesFilters from "../../../invoices/filters/SalesFilters";
import useFiltersSales from "../../../invoices/customeHooks/useFiltersSales";
import BackButton from "../../../invoices/Cards/BackButton";
import AntTable from "../../../_components/Reports/Components/AntTable";
import useSalesUrlHandler from "../../../invoices/customeHooks/useSalesUrlHandler";
const PaymentOutCBReportSummary = () => {
  const { SearchData } = useFiltersSales();
  const [datasource, setDatasource] = useState([]);
  const [hideOutFilter, setHideOutFilter] = useState(false);
  const [backupData, setBackupData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [selectedDateVar, setSelectedDateVar] = useState("paymentDate");
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const { getParameter, appendOrUpdateParameter } = useSalesUrlHandler();
  let foundActiveState = getParameter("activeTab");
  let convertedToNumberActiveState = Number(foundActiveState);
  const [selectedSearchVar, setSelectedSearchVar] = useState("customername");
  const [searchContent, setSearchContent] = useState(null);
  const dateSelectDrop = [
    {
      title: "Date",
      value: "paymentDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "VOUCHER TYPE",
      value: "voucherName",
    },
    {
      title: "Customer Name",
      value: "customername",
    },
    {
      title: "RECEIVED",
      value: "amount",
    },
  ];

  const [paymentOutDetails, setPaymentOutDetails] = useState([]);

  useEffect(() => {
    const fetchPaymentOutDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/paymentOutDetails/paymentout`
        );
        setDatasource(response.data);
        setPaymentOutDetails(response.data);
      } catch (error) {
        console.error("Error fetching Payment details:", error);
      }
    };

    fetchPaymentOutDetails();
  }, []);

  console.log("paymentOutDetails", paymentOutDetails);

  const columns = [
    {
      title: "DATE",
      dataIndex: "paymentDate",
      sorter: (a, b) => a.paymentDate.length - b.paymentDate.length,
      render: (text, record) => {
        const formattedDate = new Date(record.paymentDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return (
          <Link to={`/invoice-details/${record._id}`}>
            <span>{formattedDate}</span>
          </Link>
        );
      },
    },
    {
      title: "Vocher Type",
      dataIndex: "voucherName",
      sorter: (a, b) => a.voucherName.length - b.voucherName.length,
    },
    {
      title: "TXN NO",
      dataIndex: "paymentOutNumber",
      sorter: (a, b) => a.paymentOutNumber.length - b.paymentOutNumber.length,
    },
    {
      title: "PARTY",
      dataIndex: "vendorname",
      sorter: (a, b) => a.vendorname.length - b.vendorname.length,
    },

    {
      title: "RECEIVED",
      dataIndex: "amount",
      sorter: (a, b) => a.amount.length - b.amount.length,
    },
    // {
    //   title: "RECEIVED",
    //   dataIndex: "paymentAmount",
    //   sorter: (a, b) => a.paymentAmount.length - b.paymentAmount.length,
    // },

    {
      title: "NOTES",
      dataIndex: "notes",
      sorter: (a, b) => a.notes.length - b.notes.length,
    },
  ];

  // const modifiedColumns = columns.map((column) => {
  //   if (column.dataIndex === "paymentOutNumber") {
  //     return {
  //       ...column,
  //       render: (text, record, index) => {
  //         if (record.voucherName === "Purchase Invoice") {
  //           return index + 1;
  //         }

  //         return record.paymentOutNumber;
  //       },
  //     };
  //   }

  //   return column;
  // });

  const [showContent, setShowContent] = useState(false);

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...paymentOutDetails].reverse();

  useEffect(() => {
    const fetchDownloadData = async () => {
      const data = isFiltered
        ? [...filteredDatasource].reverse()
        : [...paymentOutDetails].reverse();
      let downloadableData = SearchData({
        data: data,
        selectedVar: selectedSearchVar,
        searchValue: searchContent,
      });
      setDownloadData(downloadableData);
    };
    fetchDownloadData();
  }, [isFiltered, filteredDatasource, searchContent, paymentOutDetails]);

  const { handlePDFDownload, handleCSVDownload } = useHandleDownload();

  const handleCSVDownloadSet = () => {
    const csvData = downloadData.map((item) => ({
      "DATE": item?.paymentDate,
      "VOUCHER TYPE": item?.voucherName,
      "TXN NO": item?.paymentOutNumber,
      "PARTY": item?.vendorname,
      "RECEIVED": item?.amount,
    }));

    const headers = [
      { label: "DATE", key: "paymentDate" },
      { label: "VOUCHER TYPE", key: "voucherName" },
      { label: "TXN NO", key: "paymentOutNumber" },
      { label: "PARTY", key: "vendorname" },
      { label: "RECEIVED", key: "amount" },
    ];

    handleCSVDownload({ csvData, headers });
  };

  const handlePDFDownloadSet = () => {
    const columns = [
      "DATE",
      "VOUCHER TYPE",
      "TXN NO",
      "PARTY",
      "RECEIVED",
    ];

    const rows = downloadData.map((item) => [
      item?.paymentDate && format(new Date(item?.paymentDate), 'MM/dd/yyyy'), // Format dueDate,
      item?.voucherName,
      item?.paymentOutNumber,
      item?.vendorname,
      item?.amount,
    ]);
    let heading =
      toggleTabsState === 0
        ? "Item Batch Report"
        : toggleTabsState === 1
        ? "Paid Credit Notes"
        : toggleTabsState === 2
        ? "Overdue Credit Notes"
        : "Outstanding Credit Notes";
    handlePDFDownload({ columns, rows, heading });
  };

  return (
    <div className="page-wrapper customers">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header ">
            <div className="d-flex align-items-start">
              <BackButton />
              <h5 className="reports-h5">Cash And Bank Report (Payment Out)</h5>
            </div>
            <div className="reports-filter-parent">
              <div className="list-btn">
                <ul className="filter-list flex space-x-0">
                  <li>
                    <button
                      className="btn btn-primary 700:me-2 300:me-0"
                      onClick={toggleContent}
                    >
                      <span className="me-2 flex-a">
                        <FeatherIcon icon="filter" />
                        {showContent ? "Hide" : "Filters"}
                      </span>
                    </button>
                  </li>
                  <li className="">
                    <div className="dropdown dropdown-action">
                      <Link
                        to="#"
                        className="btn-filters 700:me-2 300:me-0"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span>
                          <FeatherIcon icon="download" />
                        </span>
                      </Link>
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
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card customers">
              <div className="card-body">
                <div className="table-responsive table-hover ">
                  {showContent && (
                    <SalesFilters
                      datasource={datasource}
                      dateSelectDrop={dateSelectDrop}
                      reversedDataSource={reversedDataSource}
                      selectedDateVar={selectedDateVar}
                      setSelectedDateVar={setSelectedDateVar}
                      searchContent={searchContent}
                      searchSelectDrop={searchSelectDrop}
                      selectedSearchVar={selectedSearchVar}
                      setFilteredDatasource={setFilteredDatasource}
                      setIsFiltered={setIsFiltered}
                      setSearchContent={setSearchContent}
                      setSelectedSearchVar={setSelectedSearchVar}
                    />
                  )}
                  <AntTable
                    //  DataSourceFilter={DataSourceFilter}
                    dateSelectDrop={dateSelectDrop}
                    datasource={paymentOutDetails}
                    columns={columns}
                    SearchData={SearchData}
                    reversedDataSource={reversedDataSource}
                    selectedSearchVar={selectedSearchVar}
                    setSelectedSearchVar={setSelectedSearchVar}
                    searchContent={searchContent}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOutCBReportSummary;
