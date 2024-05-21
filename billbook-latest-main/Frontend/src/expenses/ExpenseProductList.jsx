import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import "../_components/antd.css";
import FeatherIcon from "feather-icons-react";
import {
  itemRender,
} from "../_components/paginationfunction";
import { Modal, Table, Tooltip } from "antd";
import axios from "axios";
import ExpenseAdd from "./ExpenseAdd";
import ExpenseEdit from "./ExpenseEditProduct";
import ExpenseCategory from "../products/ExpenseCategory";
import useHandleDownload from "../Hooks/useHandleDownload";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import useDeleteSales from "../invoices/customeHooks/useDeleteSales";
import useSalesUrlHandler from "../invoices/customeHooks/useSalesUrlHandler";
import { backendUrl } from "../backendUrl";

const ExpenseProductList = () => {
  const { SearchData } = useFiltersSales();
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const { handleExpenseProductDelete } = useDeleteSales();
  const [menu, setMenu] = useState(false);
  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const dateSelectDrop = [
    {
      title: "Date",
      value: "paymentDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "Item Name",
      value: "itemName",
    },
    {
      title: "Units",
      value: "measuringUnit",
    },
    {
      title: "Purchase Price",
      value: "purchasePrice",
    },
  ];
  const [selectedDateVar, setSelectedDateVar] = useState("paymentDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("itemName");
  const [searchContent, setSearchContent] = useState(null);
  const { getParameter, appendOrUpdateParameter } = useSalesUrlHandler();
  let foundActiveState = getParameter("activeTab");
  let convertedToNumberActiveState = Number(foundActiveState);

  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...dataSource].reverse();

  useEffect(() => {
    if (convertedToNumberActiveState === 0) {
      const fetchDownloadData = async () => {
        const data = isFiltered
          ? [...filteredDatasource].reverse()
          : [...dataSource].reverse();
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

  const [showContent, setShowContent] = useState(false);
  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const handleCSVDownloadSet = () => {
    let csvData;
    let headers;
    if (convertedToNumberActiveState === 0) {
      csvData = downloadData.map((item) => ({
        "Item Name": item?.itemName,
        Units: item?.measuringUnit,
        "Purchase Price ": item?.purchasePrice,
      }));

      headers = [
        { label: "Item Name", key: "itemName" },
        { label: "Units", key: "measuringUnit" },
        { label: "Purchase Price", key: "purchasePrice" },
      ];
    } else {
      csvData = downloadData.map((item, index) => ({
        "No.": index + 1,
        "Category Name": item?.expensecategoryName,
      }));

      headers = [
        { label: "No.", key: "itemName" },
        { label: "Category Name", key: "expensecategoryName" },
      ];
    }

    handleCSVDownload({ csvData, headers });
  };

  const handlePDFDownloadSet = () => {
    let columns;
    let rows;
    if (convertedToNumberActiveState === 0) {
      columns = ["Item Name", "Units", "Purchase Price"];

      rows = downloadData.map((item) => [
        item.itemName,
        item?.measuringUnit,
        item?.purchasePrice,
      ]);
    } else {
      columns = ["No.", "Category Name"];

      rows = downloadData.map((item, index) => [
        index + 1,
        item?.expensecategoryName,
      ]);
    }

    handlePDFDownload({
      columns,
      rows,
      heading:
        toggleTabsState === 0
          ? "Expense Product List Products"
          : "Expense Product List Category",
    });
  };

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/exproduct/exproducts`)
      .then((response) => {
        setDataSource(response.data);
        setFilteredDatasource(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [expenseProductId, setExpenseDeleteId] = useState("");

  const handleselectedInvoiceListidDelete = (value) => {
    setExpenseDeleteId(value);
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
    },
    {
      title: "Units",
      dataIndex: "measuringUnit",
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <>

          <div className="d-flex align-items-center">

            <Link className=" btn-action-icon " onClick={() => showModal(record.exproductId)} to="#">
              <div className="bg-[#e1ffed] p-2 me-1  rounded">
                <FeatherIcon icon="edit" className="text-[#1edd6a] " />
              </div>
            </Link>

            <Link
              className=" btn-action-icon "
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal_expense_product"
              onClick={() => handleselectedInvoiceListidDelete(record._id)}
            >
              <div className=" bg-[#ffeded] p-2 me-1  rounded">
                <FeatherIcon icon="trash-2" className="text-[#ed2020]" />
              </div>
            </Link>


          </div>
        </>
      ),
      sorter: (a, b) => a.action.length - b.action.length,
    },
  ];

  const [childModalVisible, setChildModalVisible] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [expenseProductID, setexpenseproductid] = useState("");

  const showChildModal = () => {
    setChildModalVisible(true);
  };

  const handleChildModalOk = () => {
    setChildModalVisible(false);
  };

  const handleChildModalCancel = () => {
    setChildModalVisible(false);
  };

  const showModal = (id) => {
    setexpenseproductid(id);
    setModalVisible(true);
  };
  const handleModalOk = () => {
    setModalVisible(false);
  };
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar active={7} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header 300:mb-3 700:mb-4">
              <div className="content-page-header 300:mb-0">
                <h5>Expense Product List</h5>

                <div className="list-btn">
                  <ul className="filter-list space-x-0">
                    <li>
                      <Tooltip placement="topLeft" title={"Filter Data"}>
                        <button className="btn btn-primary 700:me-2 300:me-0"
                          onClick={toggleContent}>
                          <span className="flex-a">
                            <FeatherIcon icon="filter" />
                          </span>
                        </button>
                      </Tooltip>
                    </li>
                    <li className="">
                      <div className="dropdown dropdown-action">
                        <Tooltip placement="topLeft" title={"Download Data"}>
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
                    </li>
                    <li>
                      <Tooltip placement="topLeft" title={"Create Expense Item"}>
                        <Link
                          className="btn btn-primary"
                          to="#"
                          onClick={showChildModal}
                        >
                          <i
                            className="fa fa-plus-circle"
                            aria-hidden="true"
                          />
                        </Link>
                      </Tooltip>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* table  */}
            <div className="row">
              <div className="col-md-12">
                <div className="card bg-white">
                  <div className="card-body">
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <a
                          onClick={() =>
                            appendOrUpdateParameter({
                              paramKey: "activeTab",
                              paramValue: 0,
                            })
                          }
                          className={`nav-link ${convertedToNumberActiveState === 0 && "active"
                            }`}
                          href="#products1"
                          data-bs-toggle="tab"
                        >
                          Product
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          onClick={() =>
                            appendOrUpdateParameter({
                              paramKey: "activeTab",
                              paramValue: 1,
                            })
                          }
                          className={`nav-link ${convertedToNumberActiveState === 1 && "active"
                            }`}
                          href="#products2"
                          data-bs-toggle="tab"
                        >
                          Category
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className={`tab-pane ${convertedToNumberActiveState === 0 && "show active"
                          } `}
                        id="products1"
                      >
                        {/* Table */}
                        <div className="row my-3 mt-0">
                          <div className="col-sm-12">
                            <div className=" card-table">
                              <div className="card-body invoiceList">
                                <div className="table-responsive table-hover table-striped">
                                  <div className="table-filter p-0">
                                    {showContent && (
                                      <SalesFilters
                                        datasource={dataSource}
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
                                      total: SearchData({
                                        data: reversedDataSource,
                                        selectedVar: selectedSearchVar,
                                        searchValue: searchContent,
                                      }).length,
                                      showTotal: (total, range) =>
                                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                      showSizeChanger: true,
                                      itemRender: itemRender,
                                    }}
                                    columns={columns}
                                    dataSource={SearchData({
                                      data: reversedDataSource,
                                      selectedVar: selectedSearchVar,
                                      searchValue: searchContent,
                                    })}
                                    rowKey={(record) => record.id}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* /Table */}
                      </div>

                      <div
                        className={`tab-pane ${convertedToNumberActiveState === 1 && "show active"
                          } `}
                        id="products2"
                      >
                        <ExpenseCategory
                          setDownloadData={setDownloadData}
                          toggleTabsState={convertedToNumberActiveState}
                          showContent={showContent}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* table  */}
          </div>
        </div>
        <div
          className="modal custom-modal fade"
          id="delete_modal_expense_product"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Expense Products</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        onClick={() =>
                          handleExpenseProductDelete({
                            exproductId: expenseProductId,
                            setDatasource: setDataSource,
                            datasource: dataSource,
                            setFilteredDatasource: setFilteredDatasource,
                          })
                        }
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="submit"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="Create New Expense Item"
          open={childModalVisible}
          onOk={handleChildModalOk}
          onCancel={handleChildModalCancel}
          footer={null}
        // className="addexpense-additem-modal"
        >
          <ExpenseAdd onCancel={handleChildModalCancel} datasource={dataSource} setDataSource={setDataSource}/>
          {/* <ExpenseAdd expenseProductId= expenseProductId}/> */}
        </Modal>
        <Modal
          title="Edit Expense Item"
          open={ModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          footer={null}
        // className="addexpense-additem-modal"
        >
          {/* <ExpenseAdd /> */}
          <ExpenseEdit expenseProductID={expenseProductID}  onCancel={handleModalCancel} datasource={dataSource} setDataSource={setDataSource}/>
        </Modal>
      </div>
    </>
  );
};

export default ExpenseProductList;
