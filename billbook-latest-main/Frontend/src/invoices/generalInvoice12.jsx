import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoice12 = ({ invoiceDetails }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const date = queryParameters.get("date");
  const name = queryParameters.get("name");
  const number = queryParameters.get("Number");
  const phone = queryParameters.get("phone");
  const GSTNo = queryParameters.get("GSTNo");
  const addressLine1 = queryParameters.get("addressLine1");
  const addressLine2 = queryParameters.get("addressLine2");
  const city = queryParameters.get("city");
  const state = queryParameters.get("state");
  const country = queryParameters.get("country");
  const email = queryParameters.get("email");

  const [grandTotalInWords, setGrandTotalInWords] = useState("");

  useEffect(() => {
    if (invoiceDetails?.grandTotal) {
      const grandTotalWords = numberToWords(invoiceDetails.grandTotal);
      setGrandTotalInWords(grandTotalWords);
    }
  }, [invoiceDetails]);
  const userData = useSelector((state) => state?.user?.userData);

  const userProfileData = userData?.data;

  console.log("invoiceDetails", invoiceDetails)

  return (
    <div className="cs-container general-invoice-1">
      <div className="cs-bg-white cs-border-radious25">
        <div className="cs-bottom-bg">
          <div className="cs-top-bg">
            <div className="cs-invoice cs-style1 cs-no_border cs-p-25-50  cs-bg-none">
              <div>
                <div className="cs-invoice_in" id="download_section">
                  <div className="display-flex space-between cs-type1 cs-mb50 cs-no_border flex-wrap">
                    <div className="cs-invoice_left">

                      <div className="inv-header-right">
                        <div className="invoice-title text-black"><b>INVOICE</b></div>
                        <p className="cs-invoice_number cs-primary_color cs-mb0 cs-f16">
                          <b className="cs-primary_color">Invoice No:</b> {number}
                        </p>
                        <div className="inv-date">
                          Date:<span>{new Date(date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="cs-logo cs-mr10 max-width90 cs">
                        <img
                          className="cs-mr10"
                          src="/logo1.svg"
                          alt="Logo"
                          style={{ width: "100px", height: "auto" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="display-flex justify-between cs-mb20 flex-wrap">
                    <div className="cs-invoice_left cs-width_8">
                      <b className="cs-primary_color">BILLED TO:</b>
                      <p>
                        Johan Smith <br /> Ivonne Company, <br /> 365 Bloor
                        Street East, Toronto, <br /> Ontario, M4W 3L4, Canada{" "}
                        <br /> subscriber@email.com
                      </p>
                    </div>
                    <div className="cs-invoice_right">
                      <b className="cs-primary_color">INVOICE TO:</b>
                      <div className="inv-to-address">
                        <div>
                          {name}
                          <br />
                          {/* {email} */}
                          {invoiceDetails?.customerName?.email === undefined
                            ? " "
                            : `${invoiceDetails?.customerName?.email} `}
                          <br />
                          {invoiceDetails?.customerName?.phoneNumber === undefined
                            ? " "
                            : `${invoiceDetails?.customerName?.phoneNumber} `}
                          <br />
                          <span></span>
                          {invoiceDetails?.customerName?.PANNumber === undefined
                            ? " "
                            : `${invoiceDetails?.customerName?.PANNumber} `}
                          <span>
                            {invoiceDetails?.customerName?.billingAddress
                              ?.addressLine1 === undefined
                              ? " "
                              : `${invoiceDetails?.customerName?.billingAddress?.addressLine1} `}

                            {invoiceDetails?.customerName?.billingAddress
                              ?.addressLine2 === undefined
                              ? ""
                              : `${invoiceDetails?.customerName?.billingAddress?.addressLine2} `}
                          </span>
                          <span>
                            {invoiceDetails?.customerName?.billingAddress?.state ===
                              undefined
                              ? ""
                              : `${invoiceDetails?.customerName?.billingAddress?.state} `}
                            {invoiceDetails?.customerName?.billingAddress?.country ===
                              undefined
                              ? ""
                              : `${invoiceDetails?.customerName?.billingAddress?.country} `}
                          </span>
                          <span>
                            {invoiceDetails?.customerName?.billingAddress?.pincode ===
                              undefined
                              ? " "
                              : `${invoiceDetails?.customerName?.billingAddress?.pincode} `}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="invoice-table border-bottom-1">
                    <div className="table-responsive">
                      <table className="table">
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
                            invoiceDetails?.table.map((item, index) => (
                              <tr key={index}>
                                <td className="table_width_1">{index + 1}</td>
                                <td className="table_width_2">{item.productName}</td>
                                <td className="table_width_3">{item.price}</td>
                                <td className="table_width_4">{item.quantity}</td>
                                <td className="table_width_5">{item.discount}%</td>
                                <td className="table_width_6">{item.gstRate}%</td>
                                <td className="table_width_7">{item.totalAmount}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="invoice-table-footer mt-3">
                <div className="table-footer-left" />
                <div className="text-end table-footer-right table-responsive-line tavle-changeg">
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
                        <td>
                          Total Tax ({invoiceDetails?.totalTaxPercentage}%)
                        </td>
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
                      <tr>
                        <td>
                        Total Amount(in words):
                        </td>
                        <td> {grandTotalInWords}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
                  <div className="bank-details mt-2">
                    <div className="account-info">
                      {invoiceDetails?.bankDetails?.selectBank.length > 0 && (
                        <>
                          <span className="bank-title">Bank Details</span>
                          <div className="account-details">
                            Bank:{" "}
                            <span>
                              {invoiceDetails?.bankDetails?.selectBank[0]?.accountName}
                            </span>
                          </div>
                          <div className="account-details">
                            Account # :
                            <span>
                              {
                                invoiceDetails?.bankDetails?.selectBank[0]
                                  ?.bankAccountNumber
                              }
                            </span>
                          </div>
                          <div className="account-details">
                            IFSC :{" "}
                            <span>
                              {invoiceDetails?.bankDetails?.selectBank[0]?.IFSCCode}
                            </span>
                          </div>
                          <div className="account-details">
                            BRANCH :{" "}
                            <span>
                              {invoiceDetails?.bankDetails?.selectBank[0]?.branchName}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="company-sign d-flex justify-end border-bottom-1 pb-2 border-top border-gray border-1">
                      <div className="text-center mt-2">
                        <span>{invoiceDetails?.bankDetails?.signatureName}</span>
                        <img src={invoiceDetails?.bankDetails?.signatureImage?.url}></img>
                        <span>Signature</span>
                      </div>
                    </div>
                  </div>
                  <div className="terms-condition mt-2">
                    <span>Notes:</span>
                    <ul>
                      <li> {invoiceDetails?.bankDetails?.notes}</li>
                    </ul>

                    <span>Terms and Conditions:</span>
                    <>
                      {invoiceDetails?.bankDetails?.termsAndConditions?.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}

                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInvoice12;
