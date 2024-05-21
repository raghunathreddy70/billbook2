import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { IoCart } from "react-icons/io5";

const ExpenseOrderCard = ({ expenseCount, totalExpenseAmount}) => {
  return (
    <>
      <div className="row invoices-number-main-parent my-4">
        <div className="col-xl-3 col-lg-3 col-sm-6 col-5 d-flex">
          <div className="SalesInvoice-cards">
            <div className="SalesInvoice-cards-sub">
              <p>Total Expense Orders</p>
              <h2>{expenseCount}</h2>
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
              <p>Total Expense Amount</p>
              <h2>{totalExpenseAmount}</h2>
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

export default ExpenseOrderCard;
