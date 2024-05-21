import React, { useState, useEffect } from "react";
import { Button, Modal, Table } from "antd";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import FeatherIcon from "feather-icons-react";
import "../_components/antd.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Input, Space, Tooltip } from "antd";
import useGetApis from "../ApiHooks/useGetApi";
import Transactions from "../customers/Transactions";
import Ledger from "../customers/ledger";
import TotalLengthBlocks from "../customers/components/TotalLengthBlocks";
import VenderTransactions from "./venderTransaction";
import VenderLedger from "./venderLedger";
import useHandleDownload from "../Hooks/useHandleDownload";
import { format } from "date-fns";
import { Dropdown } from "antd";
import ItemwiseVendorReport from "./ItemwiseVendorReport";
import { backendUrl } from "../backendUrl";
import EditVendorModal from "./EditVendorModal";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import useSalesUrlHandler from "../invoices/customeHooks/useSalesUrlHandler";
import DownloadInvoiceButton from "../Buttons/DownloadInvoiceButton";
import FilterInvoiceButton from "../Buttons/FilterInvoiceButton";
import {
  itemRender,
  onShowSizeChange,
} from "../_components/paginationfunction";
import { FaPlus } from "react-icons/fa";
import Advitise from "../customers/Advitise";
import { IoEye } from "react-icons/io5";

const VendorDetails = () => {
  const { getParameter, appendOrUpdateParameter } = useSalesUrlHandler();
  let foundActiveState = getParameter("activeTab");
  let convertedToNumberActiveState = Number(foundActiveState);
  const [datasource, setDatasource] = useState([]);
  const [filteredDatasource, setFilteredDatasource] = useState([]);
  const history = useHistory();
  const venid = useParams().id;
  const items = [
    {
      label: (
        <div
          onClick={() => {
            history.push("/add-purchase-order", {
              state: { contact_id: venid },
            });
          }}
        >
          Purchase-Order
        </div>
      ),
      key: "4",
    },
  ];

  const [editVendors1, setEditvendor1] = useState(false);

  console.log("venid", venid);

  const handleEdit = (venid) => {
    setEditvendor1(true);
  };

  // delete update
  const [deleteVendorConfirm, setDeleteVendorsConfirm] = useState(false);

  const [vendorsid, setvendorsid] = useState("");
  const handleselectedvendoridDelete = (value) => {
    setvendorsid(value);
    setDeleteVendorsConfirm(true);
  };

  const [showContent, setShowContent] = useState(false);
  const { id } = useParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [downloadData, setDownloadData] = useState([]);
  const [toggleTabsState, setToggleTabsState] = useState(2);

  useEffect(() => {
    if (
      toggleTabsState !== 1 &&
      toggleTabsState !== 2 &&
      toggleTabsState !== 3
    ) {
      setToggleTabsState(0);
    }
  }, [toggleTabsState]);

  const toggleContent = () => {
    setShowContent(!showContent);
  };
  const { fetchTotalInvoicesOfVendors, getApiData } = useGetApis();

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [menu, setMenu] = useState(false);
  const [totalNumbers, setTotalNumbers] = useState({
    numberOfInvoices: 0,
    invoicesTotalAmt: 0,
    totalInvoicePaid: 0,
    grandPaid: 0,
    totalInvoiceUnPaid: 0,
    grandUnPaid: 0,
  });




  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const [vendorDetails, setVendotDetails] = useState(null);

  const fetchVendorDetails = async () => {
    try {
      if (!venid) {
        return;
      }
      const response = await axios.get(
        `${backendUrl}/api/addVendor/vendordetails/${venid}`
      );
      let data = response.data;

      let totalInvoice = await fetchTotalInvoicesOfVendors({
        vendorId: data.vendorId,
      });
      let grandTotal = getTotalInvoiceGrandTotal({
        invoiceData: totalInvoice,
      });
      let { totalInvoiceOutStanding, grandOutStanding } = getTotalPaid({
        invoiceData: totalInvoice,
      });
      let { totalInvoiceDueDatesOver, grandDueDateAmt } = getTotalUnPaid({
        invoiceData: totalInvoice,
      });
      setTotalNumbers({
        ...totalNumbers,
        numberOfInvoices: totalInvoice?.length,
        invoicesTotalAmt: grandTotal,
        totalInvoicePaid: totalInvoiceOutStanding,
        grandPaid: grandOutStanding,
        totalInvoiceUnPaid: totalInvoiceDueDatesOver,
        grandUnPaid: grandDueDateAmt,
      });
      setVendotDetails(data);
      console.log("Fetched Vendor Details:", data);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    }
  };
  useEffect(() => {
    fetchVendorDetails();
  }, [venid]);

  const [vendorInvoiceDetails, setVendorInvoiceDetails] = useState([]);

  const getTotalInvoiceGrandTotal = ({ invoiceData }) => {
    let grandTotal = invoiceData?.reduce((num, data) => {
      return num + (data?.grandTotal || 0);
    }, 0);
    return grandTotal;
  };

  const getTotalPaid = ({ invoiceData }) => {
    let filteredOutStanding = invoiceData?.filter(
      (invoice) => invoice?.status?.toLowerCase() === "paid"
    );
    let grandOutStanding = filteredOutStanding?.reduce((num, data) => {
      return num + (data?.grandTotal || 0);
    }, 0);
    let totalInvoiceOutStanding = filteredOutStanding?.length;
    return { totalInvoiceOutStanding, grandOutStanding };
  };

  const getTotalUnPaid = ({ invoiceData }) => {
    let filteredOutStanding = invoiceData?.filter(
      (invoice) => invoice?.status?.toLowerCase() === "unpaid"
    );
    let grandDueDateAmt = filteredOutStanding?.reduce((num, data) => {
      return num + (data?.balance || 0);
    }, 0);
    let totalInvoiceDueDatesOver = filteredOutStanding?.length;
    return { totalInvoiceDueDatesOver, grandDueDateAmt };
  };

  const totalAmount = vendorDetails?.Invoices?.reduce((total, invoice) => {
    return total + invoice.grandTotal;
  }, 0);
  const balance = vendorDetails?.Invoices?.reduce((totalBalance, invoice) => {
    const totalPaid = invoice.payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );
    const invoiceBalance = invoice.grandTotal - totalPaid;
    return totalBalance + invoiceBalance;
  }, 0);

  const handleDelete = async () => {
    if (invoiceCount > 0) {
      toast.error("Vendor has Purchase orders. Cannot delete.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/addVendor/deletevendors/${venid}`
      );
      if (response.status === 204) {
        console.log("deleted successfully");
        toast.success("Vendor deleted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        history.push("/vendors");
      } else {
        console.error("Failed to delete Vendor record. Please try again.");
      }
    } catch (error) {
      console.error(
        "An error occurred while deleting the Vendor record:",
        error
      );
      toast.error("Unable to delete vendor", {
        position: toast.POSITION.TOP_RIGHT,
      });
      // window.location.reload();
    }
    // finally {
    //   setDeleteVendorsConfirm(false);
    // }
  };


  const [invoiceCount, setInvoiceCount] = useState(0);
  const [purOrderTotal, setPurOrdTotal] = useState(0);


  useEffect(() => {
    const fetchVendorInvoiceDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/purchaseorder/purorVen/${vendorDetails?.vendorId}`
        );
        const vendorInvoices = response.data;
        setVendorInvoiceDetails(vendorInvoices);
        setInvoiceCount(vendorInvoices.length);
        const purOrderTotalAmount = response.data.reduce(
          (total, pur) => total + pur.grandTotal, 0
        );
        setPurOrdTotal(purOrderTotalAmount);

      } catch (error) {
        console.error("Error fetching vendor invoice details:", error);
      }
    };

    if (vendorDetails) {
      fetchVendorInvoiceDetails();
    }
  }, [vendorDetails]);

  console.log("vendorInvoiceDetails", vendorInvoiceDetails)

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
    if (convertedToNumberActiveState === 1) {
      // Create a CSV-ready data array
      csvData = downloadData.map((item, index) => ({
        ID: item?.purchaseNumber,
        "Created On":
          item?.purchasesDate &&
          format(new Date(item?.purchasesDate), "MM/dd/yyyy"),
        Vouchers: item?.purchaseName,
        "Total Amount": item?.paymentAmount,
        "Status ": item?.status,
        // Add more fields as needed
      }));
      // Define CSV headers
      headers = [
        { label: "Id", key: "purchaseNumber" },
        { label: "Created On", key: "purchasesDate" },
        { label: "Vouchers", key: "purchaseName" },
        { label: "Total Amount", key: "paymentAmount" },
        { label: "Stock", key: "status" },
      ];
    } else if (convertedToNumberActiveState === 2) {
      csvData = downloadData.map((item, index) => ({
        ID: item?.purchaseNumber,
        "Created On":
          item?.purchasesDate &&
          format(new Date(item?.purchasesDate), "MM/dd/yyyy"),
        Vouchers: item?.purchaseName,
        Credit: item?.credit,
        Debit: item?.debit,
        Balance: item?.vendorBalance,
      }));
      headers = [
        { label: "ID", key: "purchaseNumber" },
        { label: "Created On", key: "purchasesDate" },
        { label: "Vouchers", key: "purchaseName" },
        { label: "Credit", key: "debit" },
        { label: "Debit", key: "debit" },
        { label: "Balance", key: "vendorBalance" },
      ];
    } else if (convertedToNumberActiveState === 3) {
      csvData = downloadData?.products?.map((item, index) => ({
        // "No.": index + 1,
        "Item Name": item?.itemName,
        "Item Code": item?.itemCode,
        "Sales Quantity": item?.quantity,
        "Sales Amount": item?.purAmount,
      }));
      headers = [
        // { label: "No.", key: "itemName" },
        { label: "Item Name", key: "itemName" },
        { label: "Item Code", key: "itemCode" },
        { label: "Sales Quantity", key: "quantity" },
        { label: "Sales Amount", key: "purAmount" },
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

  const handlePDFDownload = (e) => {
    e.preventDefault();
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
        ? "Profile Data"
        : convertedToNumberActiveState === 1
          ? "Vendor Transcation"
          : convertedToNumberActiveState === 2
            ? "Customer Ledger"
            : convertedToNumberActiveState === 3
              ? "Customer Item Wise Report"
              : "Item";
    const pdf = new jsPDF();
    pdf.text(pdfHeading, 10, 10);
    if (convertedToNumberActiveState === 0) {
    } else if (convertedToNumberActiveState === 1) {
      // Set up table columns
      var columns = ["ID", "Created On", "Vouchers", "Total Amount", "Status"];
      // Set up table rows
      var rows = downloadData.map((item, index) => [
        item?.purchaseNumber,
        item?.purchasesDate &&
        format(new Date(item?.purchasesDate), "MM/dd/yyyy"),
        item?.purchaseName,
        item?.balance,
        item?.status,
        // Add more fields as needed
      ]);
    } else if (convertedToNumberActiveState === 2) {
      // Set up table columns
      var columns = [
        "ID",
        "Created On",
        "Vouchers",
        "Credit",
        "Debit",
        "Balance",
      ];
      // Set up table rows
      var rows = downloadData.map((item, index) => [
        item?.purchaseNumber,
        item?.purchasesDate &&
        format(new Date(item?.purchasesDate), "MM/dd/yyyy"),
        item?.purchaseName,
        item?.credit,
        item?.debit,
        item?.vendorBalance,
        // getProductsByCategory(item?._id),
      ]);
    } else if (convertedToNumberActiveState === 3) {
      // Set up table columns
      columns = ["Item Name", "Item Code", "Sales Quantity", "Sales Amount"];
      // Set up table rows
      rows = downloadData?.products?.map((item, index) => [
        item?.itemName,
        item?.itemCode,
        item?.quantity,
        item?.purAmount,
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



  const columns = [
    {
      title: "Client Transcations",
      dataIndex: "name",
      render: (name, record) => (
        <Link to={record} className="invoice-profile-iamge">
          <img src="../img/icon5.png" alt="" />
          {name?.name}
        </Link>
      ),
    },
    {
      title: "Purchase Order Date",
      dataIndex: "purchasesORDate",
      render: (text, record) => {
        const formattedDate = new Date(
          record.purchasesORDate
        ).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return <Link >{formattedDate}</Link>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "grandTotal",

    },
    {
      title: "Balance",
      dataIndex: "balance",

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
        return <Link>{formattedDate}</Link>;
      },
    },
    {
      title: "Action",
      selector: (row) => row.action,
      sortable: true,
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
            <Link to={`/purchase-order-view/${record._id}`} className="dropdown-item d-flex gap-1">
              <IoEye style={{ fontSize: '20px', marginRight: '7px' }} />
              <p>View</p>
            </Link>
            <Link
              to={`/edit-purchase-order/${record._id}`}
              className="dropdown-item d-flex gap-1"
            >
              <img src="../newdashboard/editicon.png" alt="" />
              <p>Edit</p>
            </Link>
            <Link
              className="dropdown-item d-flex gap-1"
              // onClick={() => handleselectedPurchaseOrderidDelete(record._id)}              className="dropdown-item d-flex gap-1"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_modal"
            >
              <img src="../newdashboard/deleteicon.svg" alt="" />
              <p>Delete</p>
            </Link>
          </div>
        </div>
      ),
      width: "250px",
    },
  ];


  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <div className="page-wrapper customer-details-parent-date vendor-deatils-line">
          <div className="content customer-details container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Vendor Details</h5>

                <div className="row">
                  <div className="list-btn">
                    <ul className="add-customer-button">

                      <li onClick={() => {
                        history.push("/add-purchase-order", {
                          state: { contact_id: venid },
                        });
                      }}>
                        <a href="#">
                          <Space>
                            <FaPlus />
                            Create Purchase-Order

                          </Space>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="row customer-dashboard">
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
                          href="#profiletab"
                          data-bs-toggle="tab"
                        >
                          Profile
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className={`tab-pane ${convertedToNumberActiveState === 0 && "show active"
                          } `}
                        id="profiletab"
                      >
                        <div className="customer-details-group">
                          <div className="row align-items-center">
                            <div className="col-md-4">
                              <div className="customer-name-address-change">
                                <div className="d-flex gap-4 pb-2">
                                  <div>
                                    <img src="../img/icon1.png" alt="" />
                                  </div>
                                  <div className="text-mater ">
                                    <h6>{vendorDetails?.name}</h6>
                                    {/* <p>12th Dec 2024</p> */}
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                  <div className="text-mater ">
                                    <p>Phone</p>
                                    <h6>{vendorDetails?.phoneNumber}</h6>
                                  </div>
                                  <div className="text-mater ">
                                    <p>Email</p>
                                    <h6>{vendorDetails?.email}</h6>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="customer-name-address-change ">
                                <div className="d-flex justify-content-between align-items-center mx-3">
                                  <div>
                                    <img src="../img/icon 2.png" alt="" />
                                  </div>
                                  <div className="text-mater ">
                                    <p>PAN</p>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between g-3">
                                  <div className="text-mater">
                                    <p>Address</p>
                                    <h6>{vendorDetails?.addressLine1}{","} {vendorDetails?.addressLine2}</h6>

                                  </div>
                                  <div className="text-mater">
                                    <h4>{vendorDetails?.PANNumber}</h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="customer-name-address-change ">
                                <div className="d-flex justify-content-between align-items-center pb-2 mx-3">
                                  <div>
                                    <img src="../img/icon4.png" alt="" />
                                  </div>
                                  <div className="text-mater ">
                                    <h2> All Time</h2>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between g-3">
                                  <div className="text-mater1">
                                    <p>Total PO's</p>

                                    <h6>{invoiceCount}</h6>

                                  </div >
                                  {/* <div className="text-mater1">
                                    <p>Pending</p>

                                    <h6>15</h6>
                                    
                                  </div> */}
                                  <div className="text-mater1" >
                                    <p>Total PO Amount</p>

                                    <h6>{purOrderTotal}</h6>

                                  </div >
                                </div >
                              </div >
                            </div >
                          </div >

                        </div >
                        <div className="row">
                          <div className="col-md-8">
                            <Table
                              pagination={{
                                showTotal: (total, range) =>
                                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                showSizeChanger: true,
                                onShowSizeChange: onShowSizeChange,
                                itemRender: itemRender,
                              }}

                              rowKey={(record) => record.id}
                              columns={columns}
                              dataSource={vendorInvoiceDetails}

                            />
                          </div>

                          <div className="col-md-4 ">
                            <div className="edit-delte-buttons-page d-flex justify-content-between">

                              <button className="edit-button" type="button"
                                onClick={() => {
                                  handleEdit(venid);
                                  setEditvendor1(true);
                                }}>Edit Vendor</button>

                              <button className="delte-button" onClick={handleselectedvendoridDelete}>Delete Vendor</button>
                              <EditVendorModal
                                editVendors1={editVendors1}
                                onCancel={() => setEditvendor1(false)}
                                vendorDetails={vendorDetails}
                                setVendotDetails={setVendotDetails}
                              />
                            </div>
                            <Advitise />

                          </div>
                        </div>
                      </div >

                    </div >
                  </div >
                </div >
              </div >
            </div >
            <Modal
              className="add-bank-account-header-line"
              onCancel={() => setDeleteVendorsConfirm(false)}
              open={deleteVendorConfirm}
              footer={null}
              centered
            >
              <div>
                <div className="form-header">
                  <h3 className="update-popup-buttons">Delete Vendor</h3>
                  <p>Are you sure you want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        // data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                        onClick={() => handleDelete(vendorsid)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        to="#"
                        onClick={() => setDeleteVendorsConfirm(false)}
                        className="w-100 btn btn-primary paid-cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div >
        </div >
      </div >
    </>
  );
};

export default VendorDetails;
