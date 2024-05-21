import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoiceten = ({ invoiceDetails }) => {

  const userData = useSelector((state) => state?.user?.userData);

  const userProfileData = userData?.data;

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
    <>
      <div className="cs-container  general-invoice-1">
        <div className="cs-invoice cs-style1 tm-software">
          <div className="inv-content p-4 " id="download_section ">
            <div className="flex-horizontal-center space-between cs-mb25 align-item-center cs-mb30 flex-wrap border-bottom-1">
              <div className="cs-logo cs-mb5 tm-align-item-center space-between">
                <div className="tm-align-item-center">
                  <img
                    className="cs-mr10"
                    src={userProfileData?.profileImage?.url}
                    alt="Logo"
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>

              </div>
              <div className="tm-right-logo ">
                <div>
                  <p className="cs-invoice_number cs-bold cs-primary_color cs-m0 cs-f20">
                    INVOICE
                  </p>
                  <div className="display-flex">

                    Date:<b>{new Date(date).toLocaleDateString()}</b>
                  </div>
                  <div>
                    Invoice No: <b>{number}</b>
                  </div>
                </div>
              </div>
            </div>
            <div className="display-flex cs-mb20 space-between  ">
              <div className="cs-invoice_left">

                <b className="cs-primary_color">PAY TO:</b>
                <div>
                  {userProfileData?.businessName}
                  <br />
                  {userProfileData?.email}
                  <br />
                  {userProfileData?.phone}
                  <br />
                  {userProfileData?.gstNumber}
                  {userProfileData?.PANNumber}
                </div>
              </div>
              <div className="cs-invoice_right">
                <b className="cs-primary_color">INVOICE TO:</b>
                <p>
                  {name} <br />
                  {invoiceDetails?.customerName?.email}
                  <br />
                  {invoiceDetails?.customerName?.phoneNumber}
                  <br />
                  {invoiceDetails?.customerName?.billingAddress
                    ?.addressLine1}
                  {" "} {invoiceDetails?.customerName?.billingAddress
                    ?.addressLine2}
                  <br />
                  {invoiceDetails?.customerName?.billingAddress?.state}
                  {invoiceDetails?.customerName?.billingAddress?.city}
                  {invoiceDetails?.customerName?.billingAddress?.country}
                  {invoiceDetails?.customerName?.billingAddress?.pincode}
                </p>
              </div>
            </div>
            <div className="cs-table cs-style2 tm-border-none cs-mb20 padding-rignt-left">
              <div className="tm-border-1px"></div>
              <div className="tm-border-none">
                <div className="cs-table_responsive tm-custom-td-padding">
                  <table className="cs-mb30">
                    <thead className="border-bottom-1 cs-mb50">
                      <tr className="cs-secondary_color">
                        <th className="cs-width_5 cs-normal"> Items</th>
                        <th className="cs-width_2 cs-normal"> Price</th>
                        <th className="cs-width_2 cs-normal"> Quantity</th>
                        <th className="cs-width_2 cs-normal"> Discount</th>
                        <th className="cs-width_2 cs-normal"> Tax</th>
                        <th className="cs-width_2 cs-normal cs-text_right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="border-bottom-1">
                      {invoiceDetails?.table?.map((item, index) => (
                        <tr>
                          <td className="cs-width_5 cs-primary_color cs-f15">
                            {item.productName}
                          </td>
                          <td className="cs-width_2 cs-primary_color cs-f15">
                            {item.price}
                          </td>
                          <td className="cs-width_2 cs-primary_color cs-f15">
                            {item.quantity}
                          </td>
                          <td className="cs-width_2 cs-primary_color cs-f15">
                            {item.discount}
                          </td>
                          <td className="cs-width_2 cs-primary_color cs-f15">
                            {item.gstRate}
                          </td>
                          <td className="cs-width_2 cs-text_right cs-primary_color cs-f15">
                            {item.totalAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="display-flex justify-end">
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
              <div className="table-footer-right table-responsive-line tavle-changeg text-end ">
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

                    <tr>
                      <td>Total Amount</td>
                      <td>{invoiceDetails?.grandTotal}</td>
                    </tr>
                    <tr>
                      <td>Total Amount(in words)</td>
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

                <div className="company-sign text-center">
                  <span>{invoiceDetails?.bankDetails?.signatureName}</span>
                  <img src={invoiceDetails?.bankDetails?.signatureImage?.url}></img>
                  <span>Signature</span>
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
    </>
  );
};

export default GeneralInvoiceten;
