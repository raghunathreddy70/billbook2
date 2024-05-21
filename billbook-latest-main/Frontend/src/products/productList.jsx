import Papa from "papaparse";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import FeatherIcon from "feather-icons-react";
import { format } from 'date-fns';

import "../_components/antd.css";
import { Table, Tooltip } from "antd";
import { Button, Modal } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Units from "./units";
import { toast } from "react-toastify";
import AddProductServicesModal from "./AddProductServicesModal";
import useSalesUrlHandler from "../invoices/customeHooks/useSalesUrlHandler";
import useFiltersSales from "../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../invoices/filters/SalesFilters";
import Category from "./category";
import ProductServices from "./ProductServices";
import DeleteButton from "../Buttons/DeleteButton";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";
import FilterInvoiceButton from "../Buttons/FilterInvoiceButton";
import ViewButton from "../Buttons/ViewButton";
import { useSelector } from "react-redux";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { FaEye, FaPlus } from "react-icons/fa";
import { PiTelegramLogoBold } from "react-icons/pi";

const ProductList = ({ active }) => {
  const { SearchData } = useFiltersSales();
  const [addProduct1, setAddProduct1] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [deleteUpdateProducts1, setDeleteUpdateProducts1] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [selectedDateVar, setSelectedDateVar] = useState("addingDate");
  const [selectedSearchVar, setSelectedSearchVar] = useState("itemName");
  const [searchContent, setSearchContent] = useState(null);
  const { getParameter, appendOrUpdateParameter } = useSalesUrlHandler();
  let foundActiveState = getParameter("activeTab");
  let convertedToNumberActiveState = Number(foundActiveState);
  const [menu, setMenu] = useState([]);

  console.log("datasource", datasource);

  // filter function with customer name
  const reversedDataSource = isFiltered
    ? [...filteredDatasource].reverse()
    : [...datasource?.filter((item) => item.category === "product")].reverse();

  useEffect(() => {
    if (convertedToNumberActiveState === 0) {
      const fetchDownloadData = async () => {
        const data = isFiltered
          ? [...filteredDatasource].reverse()
          : [...datasource?.filter((item) => item.category === "product")].reverse();
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
      title: "Item Name",
      value: "itemName",
    },
    {
      title: "Item Code",
      value: "itemCode",
    },
    {
      title: "Sales Price",
      value: "salesPrice",
    },
    {
      title: "Purchase Price",
      value: "purchasePrice",
    },
  ];

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const [productdata, setProductData] = useState([]);

  // const fetchProductData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/addProduct/products"
  //     );
  //     setDatasource(response.data);
  //     setProductData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchProductData();
  // }, []);
  // console.log("productrs", productdata);

  // delete update
  const [deleteProduct, setDeleteProduct] = useState("");

  const DeleteUpdateProductID = (value) => {
    console.log("value", value);
    setDeleteProduct(value);
    setDeleteUpdateProducts1(true);
  };
  // delete update

  const handleProductDelete = async (value) => {
    const objId = value._id;
    const pid = value.productId;
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/addProduct/productsDelete/${objId}/${pid}`
      );
      if (response.status === 200) {
        // console.log("Deleted successfully");
        toast.success("deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        fetchData();
      } else {
        console.error("Failed to delete product record. Please try again.");
        toast.error("Failed to delete product record. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product record:", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error(
        "An error occurred while deleting the product record:",
        error
      );
    } finally {
      setDeleteUpdateProducts1(false);
    }
  };

  const [render, setRender] = useState(false);

  function handleRerender() {
    setRender(!render);
  }

  const userData = useSelector((state) => state?.user?.userData)
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1)
  useEffect(() => {
    fetchData(1);
  }, []);
  const fetchData = async (page) => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://localhost:8000/api/addProduct/products/${userData?.data?._id}?page=${page}&pageSize=10`
      );

      const dataWithIds = response?.data?.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      console.log("totalproducts", response.data.totalPages, dataWithIds, response)
      setFilteredDatasource(dataWithIds.reverse());
      setLoading(false)
      setTotalPages(response.data?.length)
      setDatasource(dataWithIds.reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [render, userData]);

  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };
  console.log("products", datasource);

  const [unitdata, setUnitData] = useState([]);
  console.log("unitdata", unitdata);

  const fetchUnitData = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/Unit/getunits/${userData?.data?._id}`
        );
        setUnitData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUnitData();
  }, [userData]);

  const columns = [
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
      title: "Item Name",
      dataIndex: "itemName",
      render: (text, record) => (
        <Link to={`/item-details/${record._id}`}>
          <h2 className="table-avatar">{record.itemName}</h2>
        </Link>
      ),
    },
    {
      title: "Item Code",
      dataIndex: "itemCode",
      render: (text, record) => (
        <Link to={`/item-details/${record._id}`}>
          <h2 className="table-avatar">{record.itemCode}</h2>
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
      title: "Data",
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
      title: "Stock QTY",
      dataIndex: "openingStock",
      render: (text, record) => (
        <Link to={`/item-details/${record._id}`}>
          <h2 className="table-avatar">{record.openingStock}</h2>
        </Link>
      ),
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
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      render: (text, record) => (
        <Link to={`/item-details/${record._id}`}>
          <h2 className="table-avatar">{record.purchasePrice}</h2>
        </Link>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record, index) => (
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

  console.log("downloadData", downloadData);

  const [GodownList, setGodownList] = useState([]);

  const fetchGodownData = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/godown/godownlist/${userData?.data?._id}`
        );
        setGodownList(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGodownData();
  }, [userData]);

  const [categoryData, setCategoryData] = useState([]);

  const fetchCategoryData = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/addcategory/categories/${userData?.data?._id}`
        );
        setCategoryData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [userData]);

  // download data in csv format code goes here
  const handleCSVDownload = () => {
    // e.preventDefault();
    // Prompt the user for a custom filename
    const customFilename = window.prompt(
      "Enter a custom filename (without extension):"
    );

    if (!customFilename) {
      // If the user cancels or enters an empty string, do nothing
      return;
    }

    // Create a CSV-ready data array based on toggleTabsState
    let csvData;
    let headers;
    if (convertedToNumberActiveState === 0) {
      // Create a CSV-ready data array
      csvData = downloadData.map((item, index) => ({
        "ID": index + 1,
        "Item Name": item.itemName,
        "Code": item?.itemCode,
        "Date": item?.addingDate && format(new Date(item?.addingDate), 'MM/dd/yyyy'),
        "Category": categoryData.find((category) => category._id === item?.itemCategory)?.categoryName || "-",
        "Units": unitdata.find((unit) => unit._id === item?.measuringUnit)?.unitName || "-",
        "Stock ": item?.openingStock,
        "Sales Price ": item.salesPrice,
        "Purchase Price": item.purchasePrice,
        // Add more fields as needed
      }));
      // Define CSV headers
      headers = [
        { label: "Id", key: "id" },
        { label: "Item Name", key: "itemName" },
        { label: "Code", key: "itemCode" },
        { label: "Date", key: "addingDate" },
        { label: "Category", key: "purchasesDate" },
        { label: "Units", key: "measuringUnit" },
        { label: "Total", key: "grandTotal" },
        { label: "Stock", key: "grandStock" },
        { label: "Sales Price", key: "salesPrice" },
        { label: "Purchase Price", key: "purchasePrice" },
        // Add more headers as needed
      ];
    }
    else if (convertedToNumberActiveState === 1) {
      csvData = downloadData.map((item, index) => ({
        "ID": index + 1,
        "Service Name": item?.serviceName,
        "Service Code": item?.serviceCode,
        "Date": item?.addingDate && format(new Date(item?.addingDate), 'MM/dd/yyyy'),
        "Category": categoryData.find((category) => category._id === item?.itemCategory)?.categoryName || "-",
        "Units": unitdata.find((unit) => unit._id === item?.measuringUnit)?.unitName || "-",
        "Sales Price": item?.salesPrice,
      }));
      headers = [
        { label: "ID", key: "id" },
        { label: "Service Name", key: "serviceName" },
        { label: "Service Code", key: "serviceCode" },
        { label: "Date", key: "addingDate" },
        { label: "Category", key: "categoryName" },
        { label: "Units", key: "measuringUnit" },
        { label: "Sales Price", key: "salesPrice" },
      ];
    }
    else if (convertedToNumberActiveState === 2) {
      csvData = downloadData.map((item, index) => ({
        // "No.": index + 1,
        "Unit Name": item?.unitName,
        "Short Name": item?.shortName,
      }));
      headers = [
        // { label: "No.", key: "itemName" },
        { label: "Unit Name", key: "unitName" },
        { label: "Short Name", key: "shortName" },
      ];
    } else {
      console.log(downloadData, "2");
    }

    // handleCSVDownload({ csvData, headers });
    // Generate CSV content
    const csvContent = {
      data: csvData,
      headers: headers,
      filename: `${customFilename}.csv`, // Use the custom filename
    };

    // Trigger download
    const csvLink = document.createElement("a");
    csvLink.href = encodeURI(
      `data:text/csv;charset=utf-8,${Papa.unparse(csvData, { header: true })}`
    );
    csvLink.target = "_blank";
    csvLink.download = `${customFilename}.csv`; // Use the custom filename
    csvLink.click();
  };
  // download data in csv format code goes here
  console.log("pnsjd", downloadData);
  // download data in pdf format code goes here

  const handlePDFDownload = () => {
    // e.preventDefault();
    // Prompt the user for a custom filename
    const customFilename = window.prompt(
      "Enter a custom filename (without extension):"
    );

    if (!customFilename) {
      // If the user cancels or enters an empty string, do nothing
      return;
    }
    let pdfHeading =
      convertedToNumberActiveState === 0
        ? "Products"
        : convertedToNumberActiveState === 1
          ? "service"
          : convertedToNumberActiveState === 2
            ? "Units"
            : "unkown";
    const pdf = new jsPDF();
    pdf.text(pdfHeading, 10, 10);

    if (convertedToNumberActiveState === 0) {
      // Set up table columns
      var columns = [
        "Id",
        "Item Name",
        "Item Code",
        "Date",
        "Category",
        "Units",
        "stock",
        "Sales Price",
        "Purchase Price",
      ];
      // Set up table rows
      var rows = downloadData.map((item, index) => [
        index + 1,
        item?.itemName,
        item?.itemCode,
        item?.addingDate && format(new Date(item?.addingDate), 'MM/dd/yyyy'),
        categoryData.find((category) => category._id === item?.itemCategory)?.categoryName || "-",
        unitdata.find((unit) => unit._id === item?.measuringUnit)?.unitName || "-",
        item?.openingStock,
        item?.salesPrice,
        item?.purchasePrice,
        // Add more fields as needed
      ]);
    } else if (convertedToNumberActiveState === 1) {
      // Set up table columns
      var columns = ["ID", "Service Name", "Service Code", "Date", "Category", "Units", "Sales Price"];
      // Set up table rows
      var rows = downloadData.map((item, index) => [
        index + 1,
        item?.serviceName,
        item?.serviceCode,
        item?.addingDate && format(new Date(item?.addingDate), 'MM/dd/yyyy'),
        categoryData.find((category) => category._id === item?.itemCategory)?.categoryName || "-",
        unitdata.find((unit) => unit._id === item?.measuringUnit)?.unitName || "-",
        item?.salesPrice,
        // getProductsByCategory(item?._id),
      ]);
    } else if (convertedToNumberActiveState === 2) {
      // Set up table columns
      columns = ["No.", "Unit Name", "Short Name"];
      // Set up table rows
      rows = downloadData.map((item, index) => [
        index + 1,
        item?.unitName,
        item?.shortName,
        getProductsByCategory(item?._id),
      ]);
    } else {
      console.log(downloadData, "2");
    }

    // Set up table options
    const tableOptions = {
      startY: 20,
    };

    // Add the table to the PDF
    pdf.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    // Trigger PDF download with the custom filename
    pdf.save(`${customFilename}.pdf`);
  };

  // download data in pdf format code goes here

  const getProductsByCategory = (id) => {
    let found = datasource?.filter((item) => item?.itemCategory === id);
    return found?.length;
  };

  const [catId, setCatId] = useState(null);
  // console.log("idghj", id)

  // console.log("getProductsByCategory", getProductsByCategory);

  let productItems = [];
  const [productlist, setproductlist] = useState([]);
  let serviceItems = [];
  const [serviceList, setServiceList] = useState([]);

  console.log("productlisttt", productlist);
  console.log("serviceListpp", serviceList);

  useEffect(() => {
    if (datasource) {
      productItems = datasource?.filter((item) => item.category === "product");
      serviceItems = datasource?.filter((item) => item.category === "service");

      setproductlist(productItems);
      setServiceList(serviceItems);
    }
  }, [datasource]);

  console.log("datasource", datasource);

  return (
    <>
      <div className={`main-wrapper product-nav-tabs ${menu ? "slide-nav" : ""}`}>

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header ">
                <h5>Products / Services</h5>

                <div className="list-btn">
                  <ul className="filter-list">
                    <div className="d-flex gap-2 align-items-center">
                      <Tooltip title="Filters" placement="top">
                        <button className="btn btn-primary" onClick={toggleContent}>
                          <img
                            src="./newdashboard/filterssales.svg"
                            alt="Filters"
                            className="filter-image"
                          />
                          Filters
                        </button>
                      </Tooltip>
                    </div>
                    <div className="dropdown mx-2">
                      <Tooltip title="Download" placement="top">
                        <Link
                          to="#"
                          className="btn btn-primary d-flex gap-1 align-items-center"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <RiDownloadCloud2Line
                            className="me-1"
                            style={{ fontSize: "15px" }}
                          />
                          <span>Download</span>
                        </Link>
                      </Tooltip>
                      <div className="dropdown-menu dropdown-menu-end">
                        <ul className="d-block">
                          <li>
                            <Link
                              className="d-flex align-items-center download-item"
                              to="#"
                              download=""
                              onClick={handlePDFDownload}
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
                              onClick={handleCSVDownload}
                            >
                              <i className="far fa-file-text me-2" />
                              CSV
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="btn-filters btn-primary">
                      <Tooltip title="Create New Item" placement="top">
                        <Link
                          to="#"
                          type="button"
                          // className="btn btn-primary d-flex productList-add-product-todisplay"
                          className="btn btn-primary"
                          onClick={() => setAddProduct1(true)}
                        >
                          {/* <span className="">
                          <FeatherIcon icon="grid" />
                        </span> */}
                          <FaPlus className="mr-2" />
                          Create New Item

                        </Link>
                      </Tooltip>
                    </div>

                    {/* add product modal  */}

                    <AddProductServicesModal
                      visible={addProduct1}
                      onCancel={() => setAddProduct1(false)}
                      datasource={datasource}
                      setDatasource={setDatasource}
                      fetchData={fetchData}
                    />

                    {/* add product modal  */}
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}

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
                          Service
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
                        <div className="row my-3">
                          <div className="col-sm-12">
                            <div className=" card-table">
                              <div className="card-body">
                                <div className="table-responsive table-hover table-striped">
                                  {showContent && (
                                    <SalesFilters
                                      onClick={handleRerender}
                                      datasource={productlist}
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
                                  {(render || !render) && (
                                    <Table
                                      pagination={{
                                        pageSize: 10,
                                        total: datasource ? datasource.length : 0,
                                        // total: SearchData({
                                        //   data: reversedDataSource,
                                        //   selectedVar: selectedSearchVar,
                                        //   searchValue: searchContent,
                                        // }).length,
                                        onChange: (page) => {
                                          fetchData(page)
                                        },
                                        // showTotal: (total, range) =>
                                        //   `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                        // showSizeChanger: true,
                                        // onShowSizeChange: onShowSizeChange,
                                        itemRender: itemRender,
                                      }}
                                      columns={columns}
                                      // dataSource={productlist}
                                      dataSource={SearchData({
                                        data: reversedDataSource,
                                        selectedVar: selectedSearchVar,
                                        searchValue: searchContent,
                                      })}
                                      loading={loading}
                                      rowKey={(record) => record.id}
                                    />
                                  )}
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
                        <ProductServices
                          setDownloadData={setDownloadData}
                          toggleTabsState={convertedToNumberActiveState}
                          showContent={showContent}
                          datasource={datasource}
                          setDataSource={setDatasource}
                          serviceList={serviceList}
                          fetchData={fetchData}
                        />

                      </div>

                      <div
                        className={`tab-pane ${convertedToNumberActiveState === 2 && "show active"
                          } `}
                        id="products3"
                      >
                        <Units
                          setDownloadData={setDownloadData}
                          toggleTabsState={convertedToNumberActiveState}
                          searchText={searchText}
                          showContent={showContent}
                          setServiceList={setServiceList}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* customer details tabs code here  */}
          </div>
        </div>
        {/* <Category getProductsByCategory={getProductsByCategory} /> */}

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
      </div>
    </>
  );
};

export default ProductList;
