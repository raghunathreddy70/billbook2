import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import FeatherIcon from "feather-icons-react";
import { itemRender } from "../_components/paginationfunction";
import { Table, Tooltip } from "antd";
import axios from "axios";
import format from "date-fns/format";
import useHandleDownload from "../Hooks/useHandleDownload";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import useDeleteSales from "../invoices/customeHooks/useDeleteSales";
import DeleteModal from "../invoices/Modals/DeleteModal";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";
import datatables from "../assets/jsons/datatables";
import ViewButton from "../Buttons/ViewButton";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { PiTelegramLogoBold } from "react-icons/pi";
import Advitise from "../customers/Advitise";
import ExpenseOrderCard from "./ExpenseOrderCard";
import { IoEye } from "react-icons/io5";

const Expenses = ({ active }) => {
  const { SearchData } = useFiltersSales();
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const { handleExpensesDelete } = useDeleteSales();
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [datasource, setDatasource] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const dateSelectDrop = [
    {
      title: "Date",
      value: "expenseDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Expense Number",
      value: "expenseNumber",
    },
    {
      title: "Party Name",
      value: "partyName?.partyName",
    },
    {
      title: "Total Amount",
      value: "grandTotal",
    },
  ];
  const [selectedDateVar, setSelectedDateVar] = useState("expenseDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState(
    "partyName?.partyName"
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

  const [showContent, setShowContent] = useState(false);
  const toggleContent = () => {
    setShowContent(!showContent);
  };

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
  }, [isFiltered, filteredDatasource, searchContent]);

  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "Expense Number": item?.expenseNumber,
      "Party Name": item?.partyName?.partyName,
      Date: item?.expenseDate, // Format invoiceDate
      "Total Amount": item?.grandTotal,
    }));

    // Define CSV headers
    const headers = [
      { label: "Expense Number", key: "expenseNumber" },
      { label: "Party Name", key: "partyName?.partyName" },
      { label: "Date", key: "expenseDate" },
      { label: "Total", key: "grandTotal" },
    ];

    handleCSVDownload({ csvData, headers });
  };

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = ["Expense Number", "Party Name", "Date", "Total"];
    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.expenseNumber,
      item?.partyName?.partyName,
      item?.expenseDate && format(new Date(item?.expenseDate), "MM/dd/yyyy"), // Format invoiceDate
      item?.grandTotal,
      // Add more fields as needed
    ]);
    handlePDFDownload({ columns, rows, heading: "Expenses" });
  };
  const userData = useSelector((state) => state?.user?.userData)
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [expenseCount, setExpenseCount] = useState(0);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0)

  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/Expense/expense/${userData?.data?._id}?page=${page}&pageSize=10`);
      setDatasource(response.data);
      setLoading(false);
      setTotalPages(response.data?.length);
      setFilteredDatasource(response.data);

      const expenseCount = response.data.length
      setExpenseCount(expenseCount)

      const totalExpenseAmount = response.data.reduce((total, expense) => {
        return total + (Number(expense.grandTotal) || 0);
      }, 0);
      setTotalExpenseAmount(totalExpenseAmount);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, [userData]);


  console.log("dataSourceexpense", datasource);

  const [expenseid, setExpenseid] = useState("");

  const handleselectedExpenseidDelete = (value) => {
    setExpenseid(value);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "expenseNumber",
      render: (text, record) => (
        <Link to={`/view-expenses/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Party Name",
      dataIndex: "partyName",
      render: (text, record) => (
        <Link to={`/view-expenses/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "expenseDate",
      render: (text, record) => {
        const formattedDate = new Date(record.expenseDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return <Link to={`/view-expenses/${record._id}`}>{formattedDate}</Link>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "grandTotal",
      render: (text, record) => (
        <Link to={`/view-expenses/${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record, index) => (
        <>
          <div key={index} className="dropdown dropdown-action salesinvoice-action-icon gap-2">

            {/* <Link to="#" className="action-icon dropdown-toggle" aria-expanded="false">
              <PiTelegramLogoBold className="telegramicon-sales" />
            </Link> */}
            <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-ellipsis-h telegramicon-sales" />
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to={`/view-expenses/${record._id}`} className="dropdown-item d-flex gap-1">
                <IoEye style={{ fontSize: '20px',marginRight:'7px' }} />
                <p>View</p>
              </Link>
              <Link to={`/edit-expenses/${record._id}`} className="dropdown-item d-flex gap-1">
                <img src="./newdashboard/editicon.png" alt="" />
                <p>Edit</p>
              </Link>
              <Link onClick={() => handleselectedExpenseidDelete(record._id)} className="dropdown-item d-flex gap-1" to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete_modal_Comp">
                <img src="./newdashboard/deleteicon.svg" alt="" />
                <p>Delete</p>
              </Link>

            </div>
          </div>
          <div className="d-flex align-items-center gap-1">
            {/* <span className="d-flex">
              <Link to={`/view-expenses/${record._id}`}>
                <ViewButton />
              </Link>
            </span>
            <Link
              className=" btn-action-icon "
              to={`/edit-expenses/${record._id}`}
            >
              <EditButton />
            </Link>

            <Link
              className=" btn-action-icon "
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal_Comp"
              onClick={() => handleselectedExpenseidDelete(record._id)}
            >
              <DeleteButton />
            </Link> */}
          </div>
        </>
      ),
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className={`page-wrapper ${active && "w-full ml-0 pt-[20px]"}`}>
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header 700:mb-3 300:mb-2">
              <div className="content-page-header 300:mb-0">
                <h5>Expenses</h5>

                <div className="list-btn">
                  <ul className="filter-list">
                    <li className="add-customer-button">
                      <Link
                        className=""
                        onClick={toggleContent}
                      >
                        <div className="filterssales-image">
                          <img src="./newdashboard/filterssales.svg" alt="" />
                        </div>
                        Filter
                      </Link>
                    </li>
                    <li className="">
                      <div className="add-customer-button">
                        <Link
                          to="#"
                          className=" 700:me-2 300:me-0"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <RiDownloadCloud2Line />
                          Download
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
                    <li className="add-customer-button">
                      <Link
                        className=" w-auto popup-toggle 700:me-2 300:me-0"
                        to="/add-expenses"
                      >
                        <FaPlus />
                        Create Expenses
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <ExpenseOrderCard expenseCount={expenseCount} totalExpenseAmount={totalExpenseAmount} />
            <div className="tab-pane show active" id="salesinvoice1">
              {/* Table */}
              <div className="row my-3 mt-0">
                <div className="col-md-8">
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
                          rowSelection={rowSelection}
                          loading={loading}
                          columns={columns}

                          dataSource={SearchData({ data: reversedDataSource, selectedVar: selectedSearchVar, searchValue: searchContent })}
                          rowKey={(record) => record.id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <Advitise />
                </div>
              </div>
              {/* /Table */}
            </div>
          </div>
        </div>

        <div
          className="modal custom-modal fade"
          id="edit_expenses"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Edit Expenses</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Expense ID</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="EXP-148061"
                        placeholder="Enter Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Reference</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={25689825}
                        placeholder="Enter Reference Number"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="1,54,220"
                        placeholder="Select Date"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Cash"
                        placeholder="Enter Payment Mode"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Expense Date</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="29 Jan 2022"
                        placeholder="Enter Expense Date"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <label>Notes</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Notes"
                        placeholder="Enter Notes Number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </a>
                <a
                  href="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-continue-btn"
                >
                  Update
                </a>
              </div>
            </div>
          </div>
        </div>

        <DeleteModal
          deleteFunction={() =>
            handleExpensesDelete({
              expenseId: expenseid,
              setDatasource: setDatasource,
              setFilteredDatasource: setFilteredDatasource,
            })
          }
          title={"Delete Expense"}
        />
      </div >
    </>
  );
};
export default Expenses;
