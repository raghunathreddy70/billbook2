import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoicesixteen = ({ invoiceDetails }) => {
  const userData = useSelector((state) => state?.user?.userData);

  const userProfileData = userData?.data;

  console.log("invoiceDetails", invoiceDetails)
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
  const email = queryParameters.get("email");

  const [grandTotalInWords, setGrandTotalInWords] = useState("");

  useEffect(() => {
    if (invoiceDetails?.grandTotal) {
      const grandTotalWords = numberToWords(invoiceDetails.grandTotal);
      setGrandTotalInWords(grandTotalWords);
    }
  }, [invoiceDetails]);

  return (
    <div>
      <section id="invoice">
        <div class="container my-md-5 py-5">
          <div class=" d-md-flex justify-content-between align-items-center  mb-5  ">
            <div class="mt-5 mt-md-0">
              <h2 class="display-6 text-primary fw-bold">Invoice</h2>
              <p class="m-0">Invoice No: {number}</p>
            </div>
            <div class="mt-5 mt-md-0">
              <img
                className="cs-mr10"
                src="/logo1.svg"
                alt="Logo"
                style={{ width: "100px", height: "auto" }}
              />
            </div>
          </div>

          <div class="bg-light rounded-5 p-5">
            <div class="d-md-flex justify-content-between">
              <div className="invoice-address">
                <div className="invoice-to">
                  <h2 className="invoice-to-do-address-logo">Invoice To:</h2>
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

                <div className="company-details">
                  <div className="invoice-to-do-address-logo">Pay To :</div>
                  <span className="company-name">{userProfileData?.businessName}</span>
                  <div className="gst-details">
                    <span>{userProfileData?.email}</span>
                    <span>{userProfileData?.phone}</span>
                    <span>{userProfileData?.gstNumber}</span>
                  </div>
                </div>
              </div>
              <div class="text-md-end mt-5 mt-md-0">
                <p class="text-primary fw-bold">Invoice From</p>
                <h5>William Peter</h5>
                <ul class="list-unstyled">
                  <li>ABC Company</li>
                  <li>info@abccompany.com</li>
                  <li>456 Main Street</li>
                </ul>
              </div>
            </div>

            <div class="d-md-flex justify-content-between mt-4">
              <div class="mt-5 mt-md-0">
                <p class="text-primary fw-bold">Payment Method</p>
                <h5>Payment Info</h5>
                <ul class="list-unstyled">
                  {invoiceDetails?.bankDetails?.selectBank?.map(
                    (bank, index) => (
                      <div key={index} className="tm_m0">
                        <p>
                          Account Name: {bank.accountName} <br />
                          Bank Account Number: {bank.bankAccountNumber} <br />
                          IFSC Code: {bank.IFSCCode} <br />
                          Branch Name: {bank.branchName}
                        </p>
                      </div>
                    )
                  )}
                </ul>
              </div>
              <div class="text-md-end mt-5 mt-md-0">
                <p class="text-primary fw-bold">Date</p>
                <h5>Invoice Date</h5>
                <ul class="list-unstyled">
                  <p class="cs-mb0">{new Date(date).toLocaleDateString()}</p>
                  {/* <li>
                        <span class="fw-semibold">Due Date:</span> {duedate}
                      </li> */}
                </ul>
              </div>
            </div>
          </div>

          <table class="table border my-5">
            <thead>
              <tr class="bg-primary">
                <th>Items</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceDetails?.table?.map((item, index) => (
                <tr>
                  <td>{item.productName}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.discount}</td>
                  <td>{item.gstRate}</td>
                  <td>{item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div class="bg-light rounded-5 p-5">
            <div class="row mt-4 mb-5">
              <div className="invoice-table-footer  d-flex justify-end">
                <div className="table-footer-left" />
                <div className="text-end table-footer-right table-responsive-line tavle-changeg w-50">
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
                        Total Amount(in words)
                        </td>
                        <td>{grandTotalInWords}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <br /><br />
              <div className="bank-details">
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
                <div className="company-sign d-flex justify-end">
                  <div className="text-center">
                    <span>{invoiceDetails?.bankDetails?.signatureName}</span>
                    <img src={invoiceDetails?.bankDetails?.signatureImage}></img>
                    <p>Signatute</p>
                  </div>
                </div>

              </div>

              <br /><br />
              <div className="terms-condition">
                <span>Notes:</span>
                <ul>
                  <li> {invoiceDetails?.bankDetails?.notes}</li>
                </ul>

                <h5>Terms and Conditions:</h5>
                <>
                  {invoiceDetails?.bankDetails?.termsAndConditions?.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}

                </>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneralInvoicesixteen;
