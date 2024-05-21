import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoice11 = ({ invoiceDetails }) => {

  const userData = useSelector((state) => state?.user?.userData);

  console.log("usefhju", userData?.data)
  const userProfileData = userData?.data;
  console.log("users", userProfileData);

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

  return (
    <div className="cs-container general-invoice-1">
      <div className="cs-invoice cs-style1">
        <div className="cs-invoice_in " id="download_section">
          <div className="cs-invoice_head cs-type1 column border-bottom-none d-flex align-items-center">
            <div className="cs-invoice_left w-70 display-flex">
              <div className="cs-logo cs-mb5 cs-mr20">
              <img
                    className="cs-mr10"
                    src={userProfileData?.profileImage?.url}
                    alt="Logo"
                    style={{ width: "100px", height: "auto" }}
                  />
              </div>
            </div>

            <div className="cs-invoice_right cs-text_right">
              <div className="cs-invoice_number cs-primary_color cs-mb0 cs-f16  display-flex justify-content justify-content-flex-end">
                <p className="cs-primary_color cs-mb0">
                  <b>Invoice No:&nbsp;</b>
                </p>
                <p className="cs-mb0">{number}</p>
              </div>
              <div className="cs-invoice_number cs-primary_color cs-mb0 cs-f16  display-flex justify-content justify-content-flex-end">
                <p className="cs-primary_color cs-mb0">
                </p>
                <b>Date:</b><span>{new Date(date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="cs-border cs-mb40"></div>

          <div className="cs-invoice_head  cs-mb50">
            <div className="cs-invoice_left cs-mr97">
              <b className="cs-primary_color">Invoice To:</b>
              <p className="cs-mb8">
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
            <div className="cs-invoice_right cs-text_right">
              <b className="cs-primary_color">Pay To :</b>
              <p>
                {userProfileData?.businessName}
                <br />
                {userProfileData?.email}

                <br />
                {userProfileData?.phone}
                <br />
                {userProfileData?.gstNumber}
                {userProfileData?.PANNumber}
              </p>
            </div>
          </div>
          <div className="cs-table cs-style2">
            <div>
              <div className="cs-table_responsive">
                <table>
                  <thead>
                    <tr className="cs-focus_bg">
                      <th className="cs-width_1 cs-semi_bold cs-primary_color">
                        Id
                      </th>
                      <th className="cs-width_1 cs-semi_bold cs-primary_color">
                        Items
                      </th>
                      <th className="cs-width_1 cs-semi_bold cs-primary_color">
                        Price
                      </th>
                      <th className="cs-width_1 cs-semi_bold cs-primary_color">
                        Quantity
                      </th>
                      <th className="cs-width_1 cs-semi_bold cs-primary_color">
                        Discount
                      </th>
                      <th className="cs-width_1 cs-semi_bold cs-primary_color">
                        Tax
                      </th>
                      <th className="cs-width_1 cs-semi_bold cs-primary_color cs-text_right ">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails?.table?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.productName}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.discount}</td>
                        <td>{item.gstRate}</td>
                        <td className="cs-text_right cs-primary_color">
                          {item.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="cs-table cs-style2 cs-mt20">
            <div className="cs-table_responsive">
              <table>
                <tbody>
                  <tr className="cs-table_baseline">
                    {invoiceDetails?.bankDetails?.selectBank.length > 0 && (
                      <td className="cs-width_6 cs-primary_color">
                        <b className="cs-primary_color">Payment Info:</b>
                        {/* <br /> Credit Card No: 10204********** <br /> */}
                        {invoiceDetails?.bankDetails?.selectBank?.map(
                          (bank, index) => (
                            <div key={index} className="tm_m0">
                              <p>
                                Account Name: {bank.accountName} <br />
                                Bank Account Number: {bank.bankAccountNumber}{" "}
                                <br />
                                IFSC Code: {bank.IFSCCode} <br />
                                Branch Name: {bank.branchName}
                              </p>
                            </div>
                          )
                        )}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="table-footer-right table-responsive-line tavle-changeg text-end d-flex justify-end">
                <table className="w-50">
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

                <div className="bank-details d-flex justify-content-end pb-2 border-bottom-1">
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
  );
};

export default GeneralInvoice11;
