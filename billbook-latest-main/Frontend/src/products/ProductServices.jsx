import React, { useEffect, useState } from "react";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
// import useDeleteSales from '../invoices/customeHooks/useDeleteSales';
import { Button, Modal, Tooltip } from "antd";
import { Table, DatePicker, Typography } from "antd";
import { Link } from "react-router-dom";
import "../_components/antd.css";
import FeatherIcon from "feather-icons-react";

import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import axios from "axios";
import SalesFilters from "../invoices/filters/SalesFilters";
import DeleteButton from "../Buttons/DeleteButton";
import ViewButton from "../Buttons/ViewButton";
import { FaEye } from "react-icons/fa";

const ProductServices = ({
  setDownloadData,
  toggleTabsState,
  showContent,
  datasource,
  serviceList,
  fetchData,
}) => {
  const { SearchData } = useFiltersSales();
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [searchContent, setSearchContent] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [invoiceListid, setInvoiceListid] = useState("");
  // delete update
  const [selectedDateVar, setSelectedDateVar] = useState("addingDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("itemName");
  const [deleteUpdateProducts1, setDeleteUpdateProducts1] = useState(false);

  const [deleteProduct, setDeleteProduct] = useState("");

  const DeleteUpdateProductID = (value) => {
    console.log("value", value);
    setDeleteProduct(value);
    setDeleteUpdateProducts1(true);
  };
  const dateSelectDrop = [
    {
      title: "Adding Date",
      value: "addingDate",
    },
  ];
  const searchSelectDrop = [
    {
      title: "ID",
      value: "id",
    },
    {
      title: "Service Name",
      value: "serviceName",
    },
    {
      title: "Service Code",
      value: "serviceCode",
    },
    {
      title: "Sales Price",
      value: "salesPrice",
    },
  ];
  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource.filter((item) => item.category === "service")].reverse();

  useEffect(() => {
    if (toggleTabsState === 1) {
      const fetchDownloadData = async () => {
        const data = isFiltered
          ? [...filteredDatasource].reverse()
          : [
            ...datasource.filter((item) => item.category === "service"),
          ].reverse();
        let downloadableData = SearchData({
          data: data,
          selectedVar: selectedSearchVar,
          searchValue: searchContent,
        });

        setDownloadData(downloadableData);
      };
      fetchDownloadData();
    }
  }, [toggleTabsState, isFiltered, filteredDatasource, searchContent]);

  const [categoryData, setCategoryData] = useState([]);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/addcategory/categories"
      );
      setCategoryData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const categoryOptions = categoryData.map((cat) => ({
    id: cat._id,
    text: cat.categoryName,
  }));

  const getCategory = (id) => {
    let category = categoryData.find((category) => category._id === id);
    return category ? category.categoryName : "Category Not Found";
  };

  const [unitdata, setUnitData] = useState([]);
  console.log("unitdata", unitdata);

  const fetchUnitData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/Unit/getunits"
      );
      setUnitData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUnitData();
  }, []);
  const sercolumns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text, record, index) => (
        <Link to={`/item-details/${record._id}`}>
          <h2 className="table-avatar">{index + 1}</h2>
        </Link>
      ),
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      render: (text, record) => (
        <Link to={`/item-details/${record._id}`}>
          <h2 className="table-avatar">{record.serviceName}</h2>
        </Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "addingDate",
      render: (text, record) => {
        const formattedDate = new Date(record.addingDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return (
          <Link to={`/item-details/${record._id}`}>
            <h2 className="table-avatar">{formattedDate}</h2>
          </Link>
        );
      },
    },
    {
      title: "Service Code",
      dataIndex: "serviceCode",
      render: (text, record) => (
        <Link to={`/item-details/${record._id}`}>
          <h2 className="table-avatar">{record.serviceCode}</h2>
        </Link>
      ),
    },

    {
      title: "Category",
      dataIndex: "itemCategory",
      render: (itemCategory) => {
        const category = categoryData.find(
          (category) => category._id === itemCategory
        );
        return category ? (
          <Link to={`/item-details/${category._id}`}>
            {category.categoryName}
          </Link>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Units",
      dataIndex: "measuringUnit",
      render: (measuringUnit) => {
        const Units = unitdata.find((unit) => unit._id === measuringUnit);
        return Units ? (
          <Link to={`/item-details/${Units._id}`}>{Units.unitName}</Link>
        ) : (
          "-"
        );
      },
    },

    {
      title: "Sales Price",
      dataIndex: "salesPrice",
      render: (text, record) => (
        <Link to={`/item-details/${record._id}`}>
          <h2 className="table-avatar">{record.salesPrice}</h2>
        </Link>
      ),
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record,index) => (
        // <div className="d-flex align-items-center">
        //   <Link
        //     className=" btn-action-icon "
        //     to={`/item-details/${record._id}`}
        //   >
        //     <ViewButton />
        //   </Link>

        //   <Link
        //     className=" btn-action-icon "
        //     to="#"
        //     onClick={() => DeleteUpdateProductID(record)}
        //   >
        //     <DeleteButton />
        //   </Link>
        // </div>
        <div
          key={index}
          className="dropdown dropdown-action salesinvoice-action-icon"
        >

          <Link
            to="#"
            className="action-icon dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-h telegramicon-sales" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">

            <Link
              className="dropdown-item d-flex gap-3"
              to={`/item-details/${record._id}`}
            >
              <FaEye style={{ fontSize: '18px', color: '#313860' }} />
              <p>View</p>
            </Link>
            <Link
              onClick={() => DeleteUpdateProductID(record)}
              className="dropdown-item d-flex gap-1"
              to="#"
            >
              <img src="./newdashboard/deleteicon.svg" alt="" />
              <p>Delete</p>
            </Link>


          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Table */}
      <div className="row  my-3 mt-0">
        <div className="col-sm-12">
          <div className="card-table">
            <div className="card-body invoiceList">
              <div className="table-responsive table-hover">
                <div className="table-filter  p-0">
                  {showContent && (
                    <SalesFilters
                      datasource={serviceList}
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
                    // pageSize:10,
                    // total:totalPages,
                    // total: SearchData({
                    //   data: reversedDataSource,
                    //   selectedVar: selectedSearchVar,
                    //   searchValue: searchContent,
                    // }).length,
                    onChange: (page) => {
                      serviceList(page);
                    },
                    showTotal: (total, range) =>
                      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                    itemRender: itemRender,
                  }}
                  columns={sercolumns}
                  // dataSource={serviceList}
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
      <Modal
        onCancel={() => setDeleteUpdateProducts1(false)}
        closable={false}
        open={deleteUpdateProducts1}
        footer={null}
      >
        <div className="form-header">
          <h3 className="update-popup-buttons">Delete Products / Services</h3>
          <p>Are you sure want to delete?</p>
        </div>
        <div className="modal-btn delete-action">
          <div className="row">
            <div className="col-6">
              <button
                type="submit"
                className="w-100 btn btn-primary paid-continue-btn"
                onClick={() => handleProductDelete(deleteProduct)}
              >
                Delete
              </button>
            </div>
            <div className="col-6">
              <button
                type="submit"
                onClick={() => setDeleteUpdateProducts1(false)}
                className="w-100 btn btn-primary paid-cancel-btn delete-category"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductServices;
