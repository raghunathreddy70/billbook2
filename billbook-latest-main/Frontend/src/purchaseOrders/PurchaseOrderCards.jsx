import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import React from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoCart } from "react-icons/io5";

const PurchaseOrderCards = ({
  invoiceGrandTotal,
  allInvoicelength,
  totalPaidAmount,
  paidAmountLength,
  totalOutstandingAmount,
  outStandingLength,
  purOrderLength,
  totalPurOrdAmount
}) => {
  return (
    <>
      <div className="row invoices-number-main-parent my-4">
        <div className="col-xl-3 col-lg-3 col-sm-6 col-5 d-flex">
          <div className="SalesInvoice-cards">
            <div className="SalesInvoice-cards-sub">
              <p>Total Purchase Orders</p>
              <h2> {purOrderLength}</h2>
            </div>
            <div
              className="SalesInvoice-cards-img"
              style={{ background: "#2D3748" }}
            >
              <FaRegFileAlt />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-sm-6 col-5 d-flex">
          <div className="SalesInvoice-cards">
            <div className="SalesInvoice-cards-sub">
              <p>Total Purchases Amount</p>
              <h2>INR {totalPurOrdAmount}</h2>
            </div>
            <div
              className="SalesInvoice-cards-img"
              style={{ background: "#2D3748" }}
            >
              <IoCart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseOrderCards;
