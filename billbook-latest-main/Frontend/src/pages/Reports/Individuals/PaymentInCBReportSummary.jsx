import React, { useEffect, useState } from "react";
import axios from "axios";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import useHandleDownload from "../../../Hooks/useHandleDownload";
import SalesFilters from "../../../invoices/filters/SalesFilters";
import useFiltersSales from "../../../invoices/customeHooks/useFiltersSales";
import BackButton from "../../../invoices/Cards/BackButton";
import AntTable from "../../../_components/Reports/Components/AntTable";
import { useSelector } from "react-redux";
const PaymentInCBReportSummary = () => {
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

  const userData = useSelector((state) => state?.user?.userData)
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData(1);
  }, []);
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `http://localhost:8000/api/paymentDetails/payment/${userData?.data?._id}`
        );
        setDatasource(response.data);
        setLoading(false);
        setTotalPages(response.data?.length);
        setPaymentDetails(response.data);
        setFilteredDatasource(response.data);
      } catch (error) {
        console.error("Error fetching Payment details:", error);
      }finally{
        setLoading(false)
      }
    };
  useEffect(() => {
    fetchData();
  }, [userData]);
  

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
          // <Link to={`/invoice-details/${record._id}`}>
            <span>{formattedDate}</span>
          // </Link>
        );
      },
    },
    {
      title: "VOUCHER TYPE",
      dataIndex: "voucherName",
      sorter: (a, b) => a.voucherName.length - b.voucherName.length,
    },
    {
      title: "TXN NO",
      dataIndex: "paymentNumber",
      sorter: (a, b) => a.paymentNumber.length - b.paymentNumber.length,
    },

    {
      title: "Customer Name",
      dataIndex: "customername",
      render: (customername, jjh) => (
        <Link to={`/${jjh._id}`}>
          {customername?.name || "N/A"}
        </Link>
      ),
    },
    {
      title: "RECEIVED",
      dataIndex: "amount",
      sorter: (a, b) => a.amount.length - b.amount.length,
    },

  ];

  const modifiedColumns = columns.map((column) => {
    if (column.dataIndex === "paymentNumber") {
      return {
        ...column,
        render: (text, record, index) => {
          if (record.voucherName === "Sales Invoice") {
            return index + 1;
          }

          return record.paymentNumber;
        },
      };
    }

    return column;
  });

  const [showContent, setShowContent] = useState(false);

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...paymentDetails].reverse();

  useEffect(() => {
    const fetchDownloadData = async () => {
      const data = isFiltered
        ? [...filteredDatasource].reverse()
        : [...paymentDetails].reverse();
      let downloadableData = SearchData({
        data: data,
        selectedVar: selectedSearchVar,
        searchValue: searchContent,
      });
      setDownloadData(downloadableData);
    };
    fetchDownloadData();
  }, [isFiltered, filteredDatasource, searchContent, paymentDetails]);

  const { handlePDFDownload, handleCSVDownload } = useHandleDownload();

  const handleCSVDownloadSet = () => {
    const csvData = downloadData.map((item) => ({
      "DATE": item?.paymentDate,
      "VOUCHER TYPE": item?.voucherName,
      "TXN NO": item?.paymentNumber,
      "Customer Name": item?.customername,
      "RECEIVED": item?.amount,
    }));

    const headers = [
      { label: "DATE", key: "paymentDate" },
      { label: "VOUCHER TYPE", key: "voucherName" },
      { label: "TXN NO", key: "paymentNumber" },
      { label: "Customer Name", key: "customername" },
      { label: "RECEIVED", key: "amount" },
    ];

    handleCSVDownload({ csvData, headers });
  };

  const handlePDFDownloadSet = () => {
    const columns = [
      "DATE",
      "VOUCHER TYPE",
      "TXN NO",
      "Customer Name",
      "RECEIVED",
    ];

    const rows = downloadData.map((item) => [
      item?.paymentDate,
      item?.voucherName,
      item?.paymentNumber,
      item?.customername,
      item?.amount,
    ]);
    let heading =
      toggleTabsState === 0
        ? "Cash and Bank Report Payment In"
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
              <h5 className="reports-h5">Cash And Bank Report</h5>
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
                  loading={loading}
                  fetchData={fetchData}
                  totalPages={totalPages}
                    dateSelectDrop={dateSelectDrop}
                    datasource={paymentDetails}
                    columns={modifiedColumns}
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

export default PaymentInCBReportSummary;
