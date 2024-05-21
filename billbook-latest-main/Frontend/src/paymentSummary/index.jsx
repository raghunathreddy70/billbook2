import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import "../_components/antd.css";
import { Input, Pagination, Space, Table } from "antd";
import Data from "../assets/jsons/paymentSummary";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import AddVendor from "../vendors/addVendor";

const PaymentSummary = () => {
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [searchText, setSearchText] = useState("");
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const datasource = Data?.Data;
  console.log(datasource);
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };
  const columns = [
    {
      title: "No.",
      dataIndex: "Id",
      sorter: (a, b) => a.Id.length - b.Id.length,
    },
    {
      title: "Transaction ID",
      dataIndex: "Transaction",
      sorter: (a, b) => a.Transaction.length - b.Transaction.length,
    },
    {
      title: "Invoice Number",
      dataIndex: "Invoice",
      sorter: (a, b) => a.Invoice.length - b.Invoice.length,
    },
    {
      title: "Customer",
      dataIndex: "Name",
      render: (text, record) => (
        <>
          <h2 className="table-avatar">
            <Link to="/profile" className="avatar avatar-sm me-2">
              <img
                className="avatar-img rounded-circle"
                src={record.Img}
                alt="User Image"
              />
            </Link>
            <Link to="/profile">
              {record.Name} <span>{record.Phone}</span>
            </Link>
          </h2>
        </>
      ),
      sorter: (a, b) => a.Invoice.length - b.Invoice.length,
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      sorter: (a, b) => a.Amount.length - b.Amount.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
      render: (text, record) => {
        const formattedDate = new Date(record.date).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Payment Method",
      dataIndex: "Payment",
      sorter: (a, b) => a.Payment.length - b.Payment.length,
    },
  ];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={(value) => setMenu(!menu)} />
        <Sidebar active={9} />

        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Payment Summary</h5>
                <div className="searchbar-filter">
                  <Input className="searh-input"
                    placeholder="Search by name or phone number"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300, marginBottom: 0, padding: "6px 12px", border: "none", boxShadow: "rgba(149, 157, 165, 0.2) 2px 2px 9px" }}
                  />
                  <Space>
                    <button onClick={handleReset} size="small" style={{ width: 90, padding: 7, background: "#ed2020", border: "none", boxShadow: "0px 2px 8px 0px rgba(99, 99, 99, 0.2)", borderRadius: 7, color: "#fff" }}>
                      Reset
                    </button>
                  </Space>
                </div>
                <div className="list-btn">
                  <ul className="filter-list">
                    {/* <li>
                      <Link className="btn btn-filters w-auto popup-toggle"
                        onClick={() => setShow(!show)}
                      >
                        <span className="me-2">
                          <FeatherIcon icon="filter" />
                        </span>
                        Filter{" "}
                      </Link>
                    </li>
                    <li>
                      <Link className="btn-filters" to="#">
                        <span>
                          <FeatherIcon icon="settings" />
                        </span>{" "}
                      </Link>
                    </li>
                    <li>
                      <Link className="btn-filters" to="#">
                        <span>
                          <FeatherIcon icon="grid" />
                        </span>{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="active btn-filters"
                        to="#"
                      >
                        <span>
                          <FeatherIcon icon="list" />
                        </span>{" "}
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Search Filter */}
            <div id="filter_inputs" className="card filter-card">
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Search Filter */}
            {/* Table */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body paymentSummary">
                    <div className="table-responsive table-hover">
                      <Table
                        pagination={{
                          total: datasource ? datasource.length : 0,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={datasource.filter((record) =>
                          record?.Name?.toLowerCase().includes(searchText.toLowerCase()) ||
                          record?.Phone?.toLowerCase().includes(searchText.toLowerCase()) ||
                          record?.Invoice?.toLowerCase().includes(searchText.toLowerCase()) ||
                          (typeof record.Transaction === 'string' && record?.Transaction?.toLowerCase().includes(searchText.toLowerCase()))
                        )}
                        rowKey={(record) => record.id}
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
            {/* /Table */}
          </div>
        </div>

        <AddVendor
          setShow={setShow}
          show={show}
        />

      </div>
    </>
  );
};

export default PaymentSummary;
