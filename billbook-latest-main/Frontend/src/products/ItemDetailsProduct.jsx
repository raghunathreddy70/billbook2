import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import StockDetailsProducts from "./StockDetailsProducts";
import PartyWiseReportProduct from "./PartyWiseReportProduct";
import GodownProducts from "./GodownProducts";
import { Divider, Input, Select, Space, Button, Modal, Table } from "antd";
import EditItemProductModal from "./EditItemProductModal";
import AdjustStockModal from "./AdjustStockModal";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ItemDetailsProduct = () => {

  const [editProduct1, setEditProduct1] = useState(false);
  const [adjustStock1, setAdjustStock1] = useState(false);

  const [activeTab, setActiveTab] = useState("item-details");
  const [stockQuantiy, setStockQuantity] = useState(0);
  const decrementCount = () => {
    if (stockQuantiy > 1) {
      setStockQuantity(stockQuantiy - 1);
    }
  };
  const incrementCount = () => {
    if (stockQuantiy >= 0) {
      setStockQuantity(stockQuantiy + 1);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const { id } = useParams();

  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const [productData, setProductData] = useState([]);
  console.log("productData", productData);
  const categoryid = productData && productData.itemCategory;

  const productid = productData && productData.productId;

  console.log("productid", productid);

  console.log("categoryid", categoryid);

  const fetchProductData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/addProduct/productdetails/${id}`
      );
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const handlecloseadjuststock = () => {
    setAdjustStock1(false);
  };

  const handleOkadjuststock = () => {
    setAdjustStock1(false);
  };

  const [categoryData, setCategoryData] = useState([]);
  console.log("categoryData", categoryData);
  const userData = useSelector((state) => state?.user?.userData)
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

  const [gstData, setGstData] = useState([]);

  const fetchGstData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/addgst/gst`);
      setGstData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchGstData();
  }, []);
  console.log("gstData", gstData);

  const [editingId, setEditingId] = useState(null);

  const handleEdit = (productid) => {
    setEditingId(productid);
    setEditProduct1(true);
  };

  console.log("editingId", editingId);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8000/api/addProduct/productedit/${productid}`,
        productData
      );

      console.log("Data updated successfully:", response.data);

      toast.success("Product Updated Succesfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      fetchProductData();
      // Reload the page after showing success message
      // window.location.reload();
      // });
    } catch (error) {
      console.error("Error updating data:", error);

      toast.success("Error updating data", {
        position: toast.POSITION.TOP_RIGHT,
      });
      // } finally {
      //   setUpdateProduct1(false);
    }
  };

  return (
    <>
      <div className={`main-wrapper product-nav-tabs ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header ">
                <h5>View Products</h5>
                <div className="list-btn">
                  <ul className="filter-list">
                    {/* adjust stock button  */}
                    <div className="button-list">
                      <Link
                        type="button"
                        to="#"
                        className="btn btn-filters waves-effect waves-light mt-1 me-1"
                        // data-bs-toggle="modal"
                        // data-bs-target="#con-close-modal"
                        onClick={() => setAdjustStock1(true)}
                      >
                        <span className="me-2">
                          <FeatherIcon icon="grid" />
                        </span>
                        Adjust Stock
                      </Link>
                    </div>
                    {/* adjust stock button  */}

                    {/* adjust stock modal  */}
                    <Modal
                      className="add-bank-account-header-line"
                      title="Adjust Stock Quantity"
                      onCancel={handlecloseadjuststock}
                      // onOk={handleOkadjuststock}
                      footer={null}
                      open={adjustStock1}
                    >
                      <AdjustStockModal
                        onCancel={handlecloseadjuststock}
                        productid={productid}
                      />
                    </Modal>

                    {/* adjust stock modal  */}

                    {/* edit button  */}
                    <div className="button-list">
                      {/* Responsive modal */}
                      <Link
                        type="button"
                        className="btn btn-filters mt-1 me-1"
                        to="#"
                        onClick={() => {
                          handleEdit(productid);
                        }}
                      >
                        <span className="me-2">
                          <FeatherIcon icon="edit" />
                        </span>
                        Edit Product
                      </Link>
                    </div>

                    {/* edit button  */}

                    {/* edit modal  */}
                    <EditItemProductModal
                      visible={editProduct1}
                      productid={productid}
                      onCancel={() => setEditProduct1(false)}
                      fetchProductData={fetchProductData}
                    //  datasource={datasource}
                    //  setDatasource={setDatasource}
                    />
                    {/* edit modal  */}

                    <div className="dropdown dropdown-action w-auto button-list">
                      <Link
                        to="#"
                        className="btn-filters"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span>
                          {/* <i className="fe fe-download" /> */}
                          <FeatherIcon icon="download" />
                        </span>
                      </Link>
                      <div className="dropdown-menu dropdown-menu-right">
                        <ul className="d-block">
                          <li>
                            <Link
                              className="d-flex align-items-center download-item"
                              to="#"
                              download=""
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
                            >
                              <i className="far fa-file-text me-2" />
                              CVS
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
            {/* title area end  */}

            {/* customer details tabs code here  */}
            <div className="row">
              <div className="col-md-12">
                <div className="card bg-white">
                  {/* <div className="card-header"></div> */}
                  <div className="card-body">
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          href="#itemdetails1"
                          data-bs-toggle="tab"
                        >
                          Item Details
                        </a>
                      </li>
                      {/* <li>
                          <Link to={`/item-details/${id}`} className="active">
                            Item Details
                          </Link>
                        </li> */}
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          href="#itemdetails2"
                          data-bs-toggle="tab"
                        >
                          Stock Details
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          href="#itemdetails3"
                          data-bs-toggle="tab"
                        >
                          Party Wise Report
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          href="#itemdetails4"
                          data-bs-toggle="tab"
                        >
                          Godown
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div className="tab-pane show active" id="itemdetails1">
                        {/* item details start  */}
                        <div className="row my-3">
                          <div className="col-md-6">
                            <div className="item-details-parent">
                              <div className="item-details-child">
                                <h6>General Details</h6>
                              </div>
                              <div className="item-details-subparent-parent">
                                <div className="item-details-subparent-flex">
                                  <div className="item-details-subparent-width">
                                    <h6>Item Name</h6>
                                    {productData &&
                                      productData.category === "service" ? (
                                      <p>{productData.serviceName}</p>
                                    ) : (
                                      <p>{productData.itemName}</p>
                                    )}
                                  </div>
                                  <div className="item-details-subparent-width">
                                    <h6>Item Code</h6>

                                    {productData &&
                                      productData.category === "service" ? (
                                      <p>{productData.serviceCode || "-"}</p>
                                    ) : (
                                      <p>{productData.itemCode || '-'}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="item-details-subparent-flex">

                                  <div className="item-details-subparent-width">
                                    <h6>Category</h6>
                                    {categoryData && (
                                      <p>{categoryData.categoryName || '-'}</p>
                                    )}
                                  </div>
                                  <div className="item-details-subparent-width">
                                    <h6>Current Stock</h6>
                                    {productData && (
                                      <p>{productData.openingStock || '-'}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="item-details-subparent-flex">
                                  <div className="item-details-subparent-width">
                                    <h6>Low Stock Quantity</h6>
                                    {productData && (
                                      <p>{productData?.lowStockQuantity || '-'}</p>
                                    )}
                                  </div>
                                  <div className="item-details-subparent-width">
                                    <h6>Low Stock Warning</h6>
                                    <h5>Disabled</h5>
                                  </div>
                                </div>
                                <div className="item-details-subparent-flex">
                                  <div className="item-details-subparent-width">
                                    <h6>Item Description</h6>
                                    {productData && (
                                      <p>{productData.productDescription || '-'}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="item-details-parent">
                              <div className="item-details-child">
                                <h6>Pricing Details</h6>
                              </div>
                              <div className="item-details-subparent-parent">
                                <div className="item-details-subparent-flex">
                                  <div className="item-details-subparent-width">
                                    <h6>Sales Price</h6>
                                    <div className="d-flex gap-2">
                                      {productData && (
                                        <p>{productData.salesPrice || '-'}</p>
                                      )}
                                      <p>{productData.taxType || '-'}</p>
                                    </div>
                                  </div>
                                  <div className="item-details-subparent-width">
                                    <h6>Purchase Price</h6>
                                    {productData && (
                                      <p>{productData.purchasePrice || '-'}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="item-details-subparent-flex">
                                  <div className="item-details-subparent-width">
                                    <h6>HSN Code</h6>

                                    {productData &&
                                      productData.category === "service" ? (
                                      <p>{productData.serviceCode || '-'}</p>
                                    ) : (
                                      <p>{productData.HSNcode || '-'}</p>
                                    )}
                                  </div>
                                  <div className="item-details-subparent-width">
                                    <h6>GST Tax Rate</h6>
                                    {gstData && gstData.length > 0 && (
                                      <p>
                                        {
                                          gstData.find(
                                            (gst) =>
                                              gst._id === productData.gstTaxRate
                                          )?.gstPercentageName
                                        }
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="item-details-parent">
                              <div className="item-details-child">
                                <h6>Stock Details</h6>
                              </div>
                              <div className="item-details-subparent-parent">
                                <div className="item-details-subparent-width">
                                  <h6>Serialisation</h6>
                                  <p>Disabled</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* item details end  */}
                      </div>

                      <div className="tab-pane" id="itemdetails2">
                        <StockDetailsProducts productid={productid} />
                      </div>

                      <div className="tab-pane" id="itemdetails3">
                        <PartyWiseReportProduct productid={productid} />
                      </div>

                      <div className="tab-pane" id="itemdetails4">
                        <GodownProducts
                          productid={productid}
                          productData={productData}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* customer details tabs code here  */}

            {/* switching tab area end  */}
          </div>
        </div>
      </div >
    </>
  );
};

export default ItemDetailsProduct;
