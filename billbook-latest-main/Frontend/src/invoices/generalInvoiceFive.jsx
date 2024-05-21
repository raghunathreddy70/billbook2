import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoiceFive = ({ invoiceDetails }) => {
  const userData = useSelector((state) => state?.user?.userData);

  console.log("usefhju", userData?.data)
  const userProfileData = userData?.data;
  console.log('userProfileData', userProfileData);

  const queryParameters = new URLSearchParams(window.location.search);
  const date = queryParameters.get("date");
  console.log("date", date);
  const number = queryParameters.get("Number");
  const name = queryParameters.get("name");
  const phone = queryParameters.get("phone");
  const GSTNo = queryParameters.get("GSTNo");
  const addressLine1 = queryParameters.get("addressLine1");
  const addressLine2 = queryParameters.get("addressLine2");
  const city = queryParameters.get("city");
  const state = queryParameters.get("state");
  const country = queryParameters.get("country");

  const [grandTotalInWords, setGrandTotalInWords] = useState("");

  useEffect(() => {
    if (invoiceDetails?.grandTotal) {
      const grandTotalWords = numberToWords(invoiceDetails.grandTotal);
      setGrandTotalInWords(grandTotalWords);
    }
  }, [invoiceDetails]);

  useEffect(() => {
    document.body.classList.add("dartheme");
    return () => document.body.classList.remove("dartheme");
  }, []);

  return (
    <div className="main-wrapper index-five general-invoice-1">
      <div className="container print-only-section">
        <div className="invoice-wrapper">
          <div className="inv-content">
            <div className="invoiceten-header">
              <div className="invoice-header">
                <div className="inv-header-left">
                  <Link to="#">
                    <img src={userProfileData?.profileImage?.url} alt="logo" />
                  </Link>
                </div>
                <div className="inv-header-right">
                  <div className="invoice-title">INVOICE</div>
                </div>
              </div>
              <div className="company-details">
                <div className="company-content">
                  <div className="company-content-left">

                    <div className="invoice-to">
                      <div className="invoice-to-do-address-text">Pay To :</div>
                      <span className="company-name">{userProfileData?.businessName}</span>
                      <div className="gst-details">
                        <span>{userProfileData?.email}</span>
                        <span>{userProfileData?.phone}</span>
                        <span>{userProfileData?.gstNumber}</span>
                        <span>{userProfileData?.PANNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="inv-header-right">
                    <div className="inv-details">
                      {invoiceDetails && (
                        <div className="inv-date">
                          Invoice No: <span>{number}</span>
                        </div>
                      )}
                      <div className="inv-date mb-0">
                        Invoice Date:<span>{new Date(date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="invoice-address">
              <div className="invoice-to">
                <div className="inv-to-address">
                  <h2 className="invoice-to-do-address-text">Invoice To:</h2>
                  {name}
                  <br />
                  {invoiceDetails?.customerName?.email === undefined
                    ? " "
                    : `${invoiceDetails?.customerName?.email} `}
                  <br />
                  {invoiceDetails?.customerName?.phoneNumber === undefined
                    ? " "
                    : `${invoiceDetails?.customerName?.phoneNumber} `}
                  <br />
                  <>
                    {invoiceDetails?.customerName?.billingAddress
                      ?.addressLine1 === undefined
                      ? " "
                      : `${invoiceDetails?.customerName?.billingAddress?.addressLine1} `}

                    {invoiceDetails?.customerName?.billingAddress
                      ?.addressLine2 === undefined
                      ? ""
                      : `${invoiceDetails?.customerName?.billingAddress?.addressLine2} `}
                  </>
                  <br />
                  <>
                    {invoiceDetails?.customerName?.billingAddress?.state ===
                      undefined
                      ? ""
                      : `${invoiceDetails?.customerName?.billingAddress?.state} `}
                    {invoiceDetails?.customerName?.billingAddress?.country ===
                      undefined
                      ? ""
                      : `${invoiceDetails?.customerName?.billingAddress?.country} `}
                  </>
                  <br />
                  <>
                    {invoiceDetails?.customerName?.billingAddress?.pincode ===
                      undefined
                      ? " "
                      : `${invoiceDetails?.customerName?.billingAddress?.pincode} `}
                  </>
                </div>
              </div>
              {invoiceDetails?.bankDetails?.selectBank.length > 0 && (
                <div className="invoice-to">
                  <span className="invoice-to-do-address-text text-light">Bank Details:</span>
                  <div className="inv-to-address">
                    {invoiceDetails?.bankDetails?.selectBank?.map(
                      (bank, index) => (
                        <div key={index}>
                          Account Name: {bank.accountName}
                          <br />
                          Bank Account Number: {bank.bankAccountNumber}
                          <br />
                          IFSC Code: {bank.IFSCCode}
                          <br />
                          Branch Name: {bank.branchName}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="invoice-table">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th className="table_width_1">Id</th>
                      <th className="table_width_2">Item</th>
                      <th className="table_width_3">Price</th>
                      <th className="table_width_4">Quantity</th>
                      <th className="table_width_5">Discount</th>
                      <th className="table_width_6">Tax</th>
                      <th className="table_width_7">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails?.table &&
                      invoiceDetails?.table?.map((item, index) => (
                        <tr key={index}>
                          <td className="table_width_1">{index + 1}</td>
                          <td className="table_width_1">{item.productName}</td>
                          <td className="table_width_1">{item.price}</td>
                          <td className="table_width_1">{item.quantity}</td>
                          <td className="table_width_5">{item.discount}%</td>
                          <td className="table_width_6">{item.gstRate}%</td>
                          <td className="table_width_7">{item.totalAmount}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="invoice-table-footer">
              <div className="table-footer-left notes">

              </div>
              <div className="text-end table-footer-right ">
                <table>
                  <tbody>
                    <tr>
                      <td>Taxable Amount</td>
                      <td>{invoiceDetails?.taxableAmount}</td>
                    </tr>
                    <tr>
                      <td>
                        Total Discount (
                        {invoiceDetails?.totalDiscountPercentage}%)
                      </td>
                      <td>{invoiceDetails?.totalDiscount}</td>
                    </tr>
                    <tr>
                      <td>Total Tax ({invoiceDetails?.totalTaxPercentage}%)</td>
                      <td>{invoiceDetails?.totalTax}</td>
                    </tr>
                    <tr>
                      <td>
                        CGST Amount ({invoiceDetails?.cgstTaxPercentage}%)
                      </td>
                      <td>{invoiceDetails?.cgstTaxAmount}</td>
                    </tr>
                    <tr>
                      <td>
                        SGST Amount ({invoiceDetails?.sgstTaxPercentage}%)
                      </td>
                      <td>{invoiceDetails?.sgstTaxAmount}</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
            <div className="invoice-table-footer totalamount-footer">
              <div className="table-footer-left">
                {invoiceDetails?.table && invoiceDetails?.table.length > 0 && (
                  <p className="total-info">
                    Total Items : {invoiceDetails?.table.length}
                  </p>
                )}
              </div>
              <div className="table-footer-left">
                <p className="total-info">
                  Total Amount(in words): {grandTotalInWords}
                </p>
              </div>

              <div className="table-footer-right">
                <table className="totalamt-table">
                  <tbody>
                    <tr>
                      <td>Total</td>
                      <td>{invoiceDetails?.grandTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className="total-amountdetails">
              <p>
                Total amount ( in words):{" "}
                <span>$ One Thousand Eight Hundred Fifteen Only.</span>
              </p>
            </div> */}
            <div className="bank-details">
              <div className="terms-condition">
                <>
                  {invoiceDetails?.bankDetails?.notes > 0 && (
                    <>
                      <span>Notes:</span>
                      <div className="thanks-msg text-center">
                        {invoiceDetails?.bankDetails?.notes}
                      </div>
                    </>
                  )}

                  <span > Terms and Conditions:</span>
                  <ol>
                    {invoiceDetails?.bankDetails?.termsAndConditions.split('\n').map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ol>
                </>
              </div>

              <div className="company-sign">
                {/* <img src={InvoiceLogoDark} alt="" /> */}
                <img src={invoiceDetails?.bankDetails?.signatureImage?.url} alt="" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div >
  );
};

export default GeneralInvoiceFive;
