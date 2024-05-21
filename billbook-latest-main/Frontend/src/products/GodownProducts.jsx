import React, { useState, useEffect } from "react";
import Select2 from "react-select2-wrapper";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Table, Input, Space, Tooltip } from "antd";
import DatePicker from "react-datepicker";
import { Button, Modal } from "antd";
import useHandleDownload from "../Hooks/useHandleDownload";
import "../_components/antd.css";


const GodownProducts = ({ productid, productData }) => {
  console.log("productDatagodown", productData);

  console.log("firstproductid", productid);
  const [transferStock, setTransferStock] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { handleCSVDownload, handlePDFDownload } = useHandleDownload();
  const [downloadData, setDownloadData] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };
  const [menu, setMenu] = useState(false);

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const [currencyOptions, setcurrencyOptions] = useState([
    { id: 1, text: "0" },
    { id: 2, text: "1" },
    { id: 3, text: "2" },
    { id: 4, text: "3" },
  ]);

 

  console.log("firstcccccc", productData?.Godown?.godownId);
  const godowname = productData?.Godown?.godownName;
  const godownStreetAddress = productData?.Godown?.godownStreetAddress;
  const godownCity = productData?.Godown?.godownCity;
  console.log("godowname", godowname)
  console.log("firstddddd", productData?.Godown?.godownName);
  console.log("firsffffffffff", productData?.Godown?.godownStreetAddress);
  console.log("firstcfgdsfds", productData?.Godown?.godownCity);

  const stock = productData?.Godown?.stock;

  console.log("stock", stock);
  const columns = [
    {
      title: "Godown Name",
      // dataIndex: "Godown.godownId",
      // sorter: (a, b) => a.Godown.godownId.localeCompare(b.Godown.godownId),
    },
    {
      title: "Stock Available",
      // dataIndex: "Godown.stock",
      // sorter: (a, b) => a.Godown.stock - b.Godown.stock,
    },
    {
      title: "Address",
      // dataIndex: "openingStock",
      // sorter: (a, b) => a.openingStock.localeCompare(b.office),
    },
  ];

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

  const handleCSVDownloadSet = () => {
    // Create a CSV-ready data array
    const csvData = downloadData.map((item) => ({
      "Godown Name": item?.name,
      // Code: item?.itemCode,
      // Category: getCategory(item?.itemCategory),
      // Units: item?.measuringUnit,
      "Stock Available": item?.position,
      Address: item?.office,
      // Add more fields as needed
    }));

    // Define CSV headers
    const headers = [
      { label: "Godown Name", key: "name" },
      { label: "Stock Available", key: "position" },
      { label: "Address", key: "office" },

      // Add more headers as needed
    ];

    handleCSVDownload({ csvData, headers });
  };
  // download data in csv format code goes here

  // download data in pdf format code goes here

  const handlePDFDownloadSet = () => {
    // Set up table columns
    const columns = ["Godown Name", "Stock Available", "Address"];
    // Set up table rows
    const rows = downloadData.map((item) => [
      item?.name,
      item?.position,
      item?.office,
      // Add more fields as needed
    ]);

    handlePDFDownload({
      columns,
      rows,
      heading: "Godown Product",
    });
  };

  const [formData, setFormData] = useState({
    date: new Date(),
    TransferFrom: "",
    quantity: "",
    TransferTo: "",
  });

  const [validation, setValidation] = useState({
    data: { isValid: true, message: "" },
    TransferFrom: { isValid: true, message: "" },
    quantity: { isValid: true, message: "" },
    TransferTo: { isValid: true, message: "" },
  });

  const changeInputForm = (fieldName, value) => {
    const quantityRegex = /^\d{6}$/;
    let isValid = true;
    let message = "";
    if (fieldName === "TransferFrom") {
      isValid = value;
      message = "Invalid Transfer From";
    }
    if (fieldName === "quantity") {
      isValid = quantityRegex.test(value);
      message = "Invalid quantity";
    }
    if (fieldName === "TransferTo") {
      isValid = value;
      message = "Invalid Transfer To";
    }

    setFormData({
      ...formData,
      [fieldName]: value,
    });

    setValidation({
      ...validation,
      [fieldName]: { isValid, message },
    });
  };

  const validateFormData = (formData) => {
    const validationErrors = {};
    if (!formData.TransferFrom) {
      validationErrors.godownName = {
        isValid: false,
        message: "please enter valid godown name",
      };
    }
    if (!formData.quantity) {
      validationErrors.godownStreetAddress = {
        isValid: false,
        message: "please enter correct godown street adress",
      };
    }
    if (!formData.TransferTo) {
      validationErrors.placeofsupply = {
        isValid: false,
        message: "please select a power supply",
      };
    }
    return validationErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidation((prevValidation) => ({
        ...prevValidation,
        ...validationErrors,
      }));
      return;
    }
  };

  return (
    <>
      <div>
        <div className="list-btn my-1 ml-2">
          <ul className="filter-list">
            <div className="button-list my-3">
              <Tooltip title="Transfer Stock" placement="top">
                <Link
                  type="button"
                  to="#"
                  className="btn btn-primary waves-effect waves-light mt-1 me-1 btn-filters"
                  onClick={() => setTransferStock(true)}
                >
                  Transfer Stock
                </Link>
              </Tooltip>
            </div>

            {/* <div className="dropdown dropdown-action w-auto button-list mr-2">
              <Tooltip title="Download" placement="top">
                <Link
                  to="#"
                  className="btn-filters btn-primary mt-1 me-1"
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
            <div className="searchbar-filter">
              <Input
                className="searh-input"
                placeholder="Search by name or phone number"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: 300,
                  marginBottom: 0,
                  padding: "6px 12px",
                  border: "none",
                  boxShadow: "rgba(149, 157, 165, 0.2) 2px 2px 9px",
                }}
              />
              <Space>
                <button
                  onClick={handleReset}
                  size="small"
                  style={{
                    width: 90,
                    padding: 7,
                    background: "#ed2020",
                    border: "none",
                    boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)",
                    borderRadius: 7,
                    color: "#fff",
                  }}
                >
                  Reset
                </button>
              </Space>
            </div> */}
          </ul>
        </div>
      </div>
      <Modal
        className="add-bank-account-header-line"
        title="Transfer Stock"
        onCancel={() => setTransferStock(false)}
        open={transferStock}
        footer={[
          <Button
            key="cancel"
            onClick={() => setTransferStock(false)}
            className="btn btn-secondary waves-effect me-2"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="btn btn-info waves-effect waves-light primary-button"
            onClick={handleSubmit}
          >
            Transfer
          </Button>,
        ]}
      >
        <div className="row">
          <div className="col-lg-12 col-md-6 col-sm-12">
            <div className="form-group">
              <label>Invoice date</label>
              <div className="cal-icon cal-icon-info">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  showTimeInput={false}
                  className="datetimepicker form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-6 col-sm-12">
            <div className="form-group">
              <label>
                Transfer From <span className="text-danger">*</span>
              </label>
              <Select2
                className={`form-select w-100 is-invalid`}
                data={currencyOptions}
                value={formData.TransferFrom}
                options={{
                  placeholder: "None",
                }}
                onChange={(e) =>
                  changeInputForm("TransferFrom", e.target.value)
                }
              />
              {!validation.TransferFrom.isValid && (
                <div className="error-message text-danger">
                  {validation.TransferFrom.message}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-6 col-sm-12">
            <div className="form-group">
              <label>
                Set Quantity <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.quantity}
                className={`form-control ${
                  !validation.quantity.isValid ? "is-invalid" : ""
                }`}
                placeholder="Ex.50GUG"
              />
              {!validation.quantity.isValid && (
                <div className="error-message text-danger">
                  {validation.quantity.message}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-12 col-md-6 col-sm-12">
            <div className="form-group">
              <label>
                Transfer To <span className="text-danger">*</span>
              </label>
              <Select2
                className="w-100"
                value={formData.TransferTo}
                options={{
                  placeholder: "None",
                }}
              />
              {!validation.TransferTo.isValid && (
                <div className="error-message text-danger">
                  {validation.TransferTo.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <div className="cs-table cs-style2 tm-border-none padding-rignt-left">
        <div className="tm-border-none">
          <div className="cs-table_responsive">
            <table className="cs-mb30">
              <div className="tm-border-1px"></div>
              <thead className="border-bottom-1 cs-mb50">
                <tr className="cs-secondary_color">
                  <th >Godown Name</th>
                  <th >Stock Available</th>
                  <th >Address</th>
                </tr>
              </thead>
              <tbody>
                {productData?.Godown?.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.godownName}
                  </td>
                  <td>
                    {item.stock}
                  </td>
                  <td>
                    {item.godownCity},{item.godownStreetAddress}
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default GodownProducts;
