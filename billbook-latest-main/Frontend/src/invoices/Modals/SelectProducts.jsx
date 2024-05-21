import React, { useState, useEffect } from "react";

import Papa from "papaparse";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import "../../_components/antd.css";
import {
  Input,
  Pagination,
  Space,
  Table,
  Tooltip,
  Modal,
  Button,
  InputNumber,
} from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../_components/paginationfunction";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Units from "../../products/units";
import { toast } from "react-toastify";
import useSalesUrlHandler from "../../invoices/customeHooks/useSalesUrlHandler";
import useFiltersSales from "../../invoices/customeHooks/useFiltersSales";
import SalesFilters from "../../invoices/filters/SalesFilters";
import Select2 from "react-select2-wrapper";
import { useSelector } from "react-redux";

const SelectProducts = ({
  product,
  handleproductchange,
  handleProductSelect,
  selectedProductModal,
  handleAddProducts,
  isProductModalVisible,
  handleProductCancel,
  setIsProductModalVisible,
  tableData,
}) => {
  const userData = useSelector((state) => state?.user?.userData);
  const [gstData, setGstData] = useState([]);

  const fetchGstData = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/addgst/gst/${userData?.data?._id}`
        );
        setGstData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchGstData();
  }, [userData]);

  const { SearchData } = useFiltersSales();
  const [datasource, setDatasource] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const [selectedSearchVar, setSelectedSearchVar] = useState("itemName");
  const [searchContent, setSearchContent] = useState(null);
  const { getParameter, appendOrUpdateParameter } = useSalesUrlHandler();
  let foundActiveState = getParameter("activeTab");
  let convertedToNumberActiveState = Number(foundActiveState);

  const [productData, setProductData] = useState([]);

  const [serviceData, setServiceData] = useState([]);
  const [quantityAddedInGodown, setQuantityAddedInGodown] = useState([]);

  console.log("quantityAddedInGodown", tableData);

  useEffect(() => {
    const productDataMain = product?.filter(
      (item) => item.itemName.trim().length > 0
    );
    const serviceDataMain = product?.filter(
      (item) => item.serviceName.trim().length > 0
    );

    setProductData(productDataMain?.reverse());
    setServiceData(serviceDataMain?.reverse());
  }, [product]);

  // filter function with customer name
  const reversedProductSource = isFiltered
    ? [...filteredDatasource]?.reverse()
    : [...productData]?.reverse();

  const reversedServiceSource = isFiltered
    ? [...filteredDatasource]?.reverse()
    : [...serviceData]?.reverse();
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

  console.log("GodownList", GodownList);

  const GodownOptions = GodownList?.map((godown) => ({
    id: godown.godownId,
    text: godown.godownName,
    products: godown.Products,
  }));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text, record, index) => (
        <h2 className="table-avatar">{index + 1}</h2>
      ),
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Product Name",
      dataIndex: "itemName",
      render: (text, record) => (
        <h2 className="table-avatar">{record.itemName}</h2>
      ),
      sorter: (a, b) => a.itemName.length - b.itemName.length,
    },
    {
      title: "Quantity",
      dataIndex: "openingStock",
      render: (text, record) => (
        <h2 className="table-avatar">{record.openingStock}</h2>
      ),
    },
    {
      title: "Sales Price",
      dataIndex: "salesPrice",
      render: (text, record) => (
        <h2 className="table-avatar">{record.salesPrice}</h2>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          {console.log("record in Godown", record)}
          {record.openingStock >= 1 ? (
            <>
              {tableData?.some((item) => item.productId === record._id) ? (
                <>
                  <div className=" btn-action-icon ">
                    <div className="bg-[#e1ffed] w-40 py-2 rounded flex justify-center items-center gap-3">
                      <FeatherIcon
                        icon="plus-circle"
                        className="text-[#1edd6a] "
                      />
                      Added
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className=" btn-action-icon "
                  onClick={async () => {
                    record?.Godown?.length === 0 &&
                      handleproductchange(record._id);
                    record?.Godown?.length === 0 && handleProductCancel();
                    record?.Godown?.length > 0 && selectGodownFromList(record);

                    handleAddProducts();
                  }}
                >
                  <div className="bg-[#e1ffed] w-40 py-2 rounded flex justify-center items-center gap-3">
                    <FeatherIcon
                      icon="plus-circle"
                      className="text-[#1edd6a] "
                    />
                    Add Product
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-red-100 w-40 py-2 rounded flex justify-center items-center gap-2">
              <FeatherIcon icon="x-circle" className="text-red-600 " />
              Insufficient Stock
            </div>
          )}
        </div>
      ),
    },
  ];

  const handleChangeGodownQty = (index, incrementor, maxQty) => {
    const updatedQuantityArray = [...quantityAddedInGodown];
    updatedQuantityArray[index] = updatedQuantityArray[index] || 0;

    if (updatedQuantityArray[index] + incrementor <= maxQty) {
      updatedQuantityArray[index] =
        parseInt(updatedQuantityArray[index]) + incrementor;
    }
    setQuantityAddedInGodown(updatedQuantityArray);
  };

  const handleGodownInputChange = (e, index, maxQty) => {
    const updatedQuantityArray = [...quantityAddedInGodown];
    const { value } = e.target;
    console.log("value", value);
    if (value === "") {
      updatedQuantityArray[index] = 0;
    }
    if (parseInt(value) <= maxQty && !(parseInt(value) < 0)) {
      updatedQuantityArray[index] = parseInt(value) || 0;
      console.log(updatedQuantityArray[index]);
    }
    setQuantityAddedInGodown(updatedQuantityArray);
  };

  const sercolumns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text, record, index) => (
        <Link to={`/item-details/${record._id}`}>
          <h2 className="table-avatar">{index + 1}</h2>
        </Link>
      ),
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      render: (text, record) => (
        <h2 className="table-avatar">{record.serviceName}</h2>
      ),
      sorter: (a, b) => a.itemName.length - b.itemName.length,
    },

    {
      title: "Sales Price",
      dataIndex: "salesPrice",
      render: (text, record) => (
        <h2 className="table-avatar">{record.salesPrice}</h2>
      ),
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <div
            className=" btn-action-icon "
            onClick={() => {
              handleproductchange(record._id);
              setIsProductModalVisible(false);
              handleAddProducts();
            }}
          >
            <div className="bg-[#e1ffed] p-2 rounded">
              <FeatherIcon icon="plus-circle" className="text-[#1edd6a] " />
            </div>
          </div>
        </div>
      ),
    },
  ];

  console.log("GodownOptions", GodownOptions);
  const godownCols = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text, record, index) => (
        <div>
          {console.log("The main Record is", record)}
          <h2 className="table-avatar">{index + 1}</h2>
        </div>
      ),
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Godown List",
      dataIndex: "godownName",
      render: (text, record, index) => <div>{text}</div>,
    },
    {
      title: "Quantity",
      dataIndex: "stock",
      render: (stock, record, index) => (
        <div>
          {quantityAddedInGodown[index] &&
          parseInt(quantityAddedInGodown[index]) > 0 ? (
            <>
              <div className="flex justify-center gap-4">
                <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    handleChangeGodownQty(index, -1, stock);
                  }}
                >
                  -
                </div>
                <input
                  className="w-8"
                  type="number"
                  onChange={(e) => handleGodownInputChange(e, index, stock)}
                  value={parseInt(quantityAddedInGodown[index])}
                  defaultValue={0}
                />
                <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    handleChangeGodownQty(index, 1, stock);
                  }}
                >
                  +
                </div>
              </div>
            </>
          ) : (
            <div
              onClick={(e) => {
                handleChangeGodownQty(index, 1, stock);
              }}
            >
              Add +
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Total Stock",
      dataIndex: "stock",
      render: (stock, record, index) => <div>{stock}</div>,
    },
  ];
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [godownModalVisible, setGodownModalVisible] = useState(false);
  const [GodownSelectionValue, setGodownSelectionValue] = useState(null);

  console.log(
    "selectedRecord ------ GodownSelectionValue",
    selectedRecord,
    " ------ ",
    GodownSelectionValue
  );

  function selectGodownFromList(record) {
    setSelectedRecord(record);
    setGodownModalVisible(true);
  }

  const handleCloseModal = () => {
    setGodownModalVisible(false);
    setSelectedRecord(null);
  };

  return (
    <>
      <Modal
        className="select-product"
        title="Select Items"
        open={isProductModalVisible}
        onCancel={handleProductCancel}
        footer={null}
        width={900}
      >
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
                      className={`nav-link ${
                        convertedToNumberActiveState === 0 && "active"
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
                      className={`nav-link ${
                        convertedToNumberActiveState === 1 && "active"
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
                    className={`tab-pane ${
                      convertedToNumberActiveState === 0 && "show active"
                    } `}
                    id="products1"
                  >
                    <div className="row my-3">
                      <div className="col-sm-12">
                        <div className=" card-table">
                          <div className="card-body">
                            <div className="table-responsive table-hover table-striped">
                              <Table
                                pagination={{
                                  total: SearchData({
                                    data: reversedProductSource,
                                    selectedVar: selectedSearchVar,
                                    searchValue: searchContent,
                                  }).length,
                                  showSizeChanger: true,
                                  onShowSizeChange: onShowSizeChange,
                                  itemRender: itemRender,
                                }}
                                columns={columns}
                                dataSource={productData}
                                rowKey={(record) => record.id}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`tab-pane ${
                      convertedToNumberActiveState === 1 && "show active"
                    } `}
                    id="products2"
                  >
                    <Table
                      pagination={{
                        total: SearchData({
                          data: reversedServiceSource,
                          selectedVar: selectedSearchVar,
                          searchValue: searchContent,
                        }).length,
                      }}
                      columns={sercolumns}
                      dataSource={serviceData}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {godownModalVisible && selectedRecord && (
        <Modal
          title="Select Godown"
          open={godownModalVisible}
          onCancel={handleCloseModal}
          // onOk={handleGodownSelected}
          footer={[
            <Button
              key="back"
              className="btn btn-secondary waves-effect me-2"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              className="btn btn-info waves-effect waves-light"
              onClick={() => {
                quantityAddedInGodown.length > 0 &&
                  handleproductchange(selectedRecord._id, {
                    productId: selectedRecord,
                    values: quantityAddedInGodown,
                    tableIndex: tableData.length,
                  });
                quantityAddedInGodown.length > 0 &&
                  handleProductSelect(selectedRecord);
                quantityAddedInGodown.length > 0 &&
                  setQuantityAddedInGodown([]);
                quantityAddedInGodown.length > 0 && handleCloseModal();
              }}
            >
              Select
            </Button>,
          ]}
        >
          <div className="my-3">
            {selectedRecord?.Godown?.length > 0 ? (
              <>
                {selectedRecord?.Godown &&
                  selectedRecord?.Godown?.length > 0 && (
                    <>
                      {console.log("GodownOptions 001", selectedRecord)}
                      <Table
                        columns={godownCols}
                        dataSource={selectedRecord.Godown}
                        showSorterTooltip={{ target: "sorter-icon" }}
                      />
                    </>
                  )}
              </>
            ) : (
              <>No Godown data? Click on Okay to continue</>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default SelectProducts;
