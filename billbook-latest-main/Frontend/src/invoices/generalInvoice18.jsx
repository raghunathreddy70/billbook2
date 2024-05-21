import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoice18 = ({ invoiceDetails }) => {
  const userData = useSelector((state) => state?.user?.userData);

  const userProfileData = userData?.data;

  console.log("invoiceDetails", invoiceDetails)

  const queryParameters = new URLSearchParams(window.location.search);
  const date = queryParameters.get("date");
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
        <div class="container my-5 py-5">
          <div class=" pattern d-md-flex justify-content-between align-items-center border-top border-bottom mb-5 py-5 py-md-3">
            <div class="d-none d-md-flex pattern-overlay pattern-right">
              <img
                className="cs-mr10"
                src="/logo1.svg"
                alt="Logo"
                style={{ width: "100px", height: "auto" }}
              />
            </div>
            <div>
              {/* <img
                className="cs-mr10"
                src="/logo1.svg"
                alt="Logo"
                style={{ width: "100px", height: "auto" }}
              /> */}
            </div>
            <div class="mt-5 mt-md-0">
              <h2 class="display-6 fw-bold">Invoice </h2>
              <p class="m-0">Invoice No: {number}</p>
              <p class="m-0">Invoice Date: {new Date(date).toLocaleDateString()}</p>
              {/* <p class="m-0">Due Date: 20 {June, 2024}</p> */}
            </div>
          </div>

          <div class="d-md-flex justify-content-between pt-2">
            <div className="invoice-address">
              <div className="invoice-to">
                <p class="text-primary fw-bold">Invoice To</p>
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
                  <span>{userProfileData?.PANNumber}</span>
                </div>
                <div className="gst-details">
                  {console.log(typeof state)}
                </div>

              </div>
            </div>
            <div class="mt-5 mt-md-0">
              <p class="text-primary fw-bold">Invoice From</p>
              <h4>William Peter</h4>
              <ul class="list-unstyled">
                <li>ABC Company</li>
                <li>info@abccompany.com</li>
                <li>456 Main Street</li>
              </ul>
            </div>
            <div class="mt-5 mt-md-0">
              <p class="text-primary fw-bold">Contact Us</p>
              <h4>Contact Info</h4>
              <ul class="list-unstyled">
                <li>
                  <iconify-icon
                    class="social-icon text-primary fs-5 me-2"
                    icon="mdi:location"
                    style={{ verticalAlign: "text-bottom" }}
                  ></iconify-icon>{" "}
                  {addressLine1 === "undefined" ? " " : `${addressLine1}`}
                </li>
                <li>
                  <iconify-icon
                    class="social-icon text-primary fs-5 me-2"
                    icon="solar:phone-bold"
                    style={{ verticalAlign: "text-bottom" }}
                  ></iconify-icon>{" "}
                  {addressLine2 === "undefined" ? " " : `${addressLine2},`}{city === "undefined" ? " " : `${city},`}{state === "undefined" ? " " : `${state},`}{country === "undefined" ? " " : `${country}`}
                </li>
                <li>
                  <iconify-icon
                    class="social-icon text-primary fs-5 me-2"
                    icon="ic:baseline-email"
                    style={{ verticalAlign: "text-bottom" }}
                  ></iconify-icon>{" "}
                  {email}
                </li>
              </ul>
            </div>
          </div>

          <table class="table border my-5">
            <thead>
              <tr class="bg-primary">
                <th scope="col">Items</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Discount</th>
                <th scope="col">Tax</th>
                <th scope="col">Amount</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceDetails?.table?.map((item, index) => (
                <tr>
                  <td>{index + 1} </td>
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

          <div class="row pattern my-5">
            <div className="invoice-table-footer d-flex justify-end">
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
                        Total Amount(in words):
                      </td>
                      <td>{grandTotalInWords}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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

              <div className="company-sign d-flex justify-end mt-2">
                <div className="text-center">
                  <span>{invoiceDetails?.bankDetails?.signatureName}</span>
                  <img src={invoiceDetails?.bankDetails?.signatureImage}></img>
                  <p>Signature</p>
                </div>
              </div>
            </div>
            <div className="terms-condition">
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
      </section>
    </div>
  );
};

export default GeneralInvoice18;
