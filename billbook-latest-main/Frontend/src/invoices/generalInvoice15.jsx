import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoice15 = ({ invoiceDetails }) => {
  const userData = useSelector((state) => state?.user?.userData);

  const userProfileData = userData?.data;

  console.log("invoiceDetails", invoiceDetails)
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
    <div className="cs-container">
      <div className="cs-invoice cs-style1">
        <div className="cs-invoice_in" id="download_section">
          <div className="top-header-section bg-img1">
            <div className="header-text">
              <h5 className="text-transform-uppercase font-bold">INVOICE</h5>
              <div className="display-flex align-items-flex-end justify-content-flex-end">
                <img
                  className="cs-mr10"
                  src={userProfileData?.profileImage?.url} 
                  alt="Logo"
                  style={{ width: "100px", height: "auto" }}
                />
              </div>
            </div>
          </div>
          <div className="cs-invoice_head cs-mb25">
            <div className="cs-invoice_left">
              <p>
                {" "}
                <b className="cs-primary_color">
                  BILLED TO <br />
                </b>{" "}
                Johan Smith
                <br /> Ivonne Company,
                <br /> 365 Bloor Street East, Toronto,
                <br /> Ontario, M4W 3L4, Canada
                <br /> subscriber@email.com
              </p>
            </div>
            <div className="cs-invoice_right cs-mr50">
              <h2 className="invoice-to-do-address-logo text-black text-sm font-bold">INVOICE TO:</h2>
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
          <div className="cs-table cs-style2 cs-mb40">
            <div>
              <div className="cs-table_responsive">
                <p className="cs-mb20">
                  {/* <b className="cs-primary_color">
                    Software Services
                    <br />
                  </b> */}
                </p>
                <table>
                  <thead>
                    <tr className="cs-focus_bg">
                      <th className="cs-width_1 cs-semi_bold">Items</th>
                      <th className="cs-width_1 cs-semi_bold">Price</th>
                      <th className="cs-width_1 cs-semi_bold"> Quantity</th>
                      <th className="cs-width_1 cs-semi_bold"> Discount</th>
                      <th className="cs-width_1 cs-semi_bold"> Tax</th>
                      <th className="cs-width_1 cs-semi_bold cs-text_right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails?.table?.map((item, index) => (
                      <tr key={index} className="cs-focus_bg">
                        <td className="cs-primary_color">
                          {" "}
                          {item.productName}
                        </td>
                        <td className="cs-primary_color"> {item.price}</td>
                        <td className="cs-primary_color">{item.quantity}</td>
                        <td className="cs-primary_color"> {item.discount}</td>
                        <td className="cs-primary_color"> {item.gstRate}</td>
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
          {/* <div className="cs-table cs-style2 cs-mb40">
            <div>
              <div className="cs-table_responsive">
                <p className="cs-mb20">
                  <b className="cs-primary_color">
                    Support Fee
                    <br />
                  </b>
                </p>
                <table>
                  <thead>
                    <tr className="cs-focus_bg">
                      <th className="cs-width_1 cs-semi_bold">FROM</th>
                      <th className="cs-width_1 cs-semi_bold">TO</th>
                      <th className="cs-width_1 cs-semi_bold">PRICE</th>
                      <th className="cs-width_1 cs-semi_bold">RATE</th>
                      <th className="cs-width_1 cs-semi_bold cs-text_right">
                        AMOUNT (USD)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="cs-focus_bg">
                      <td className="cs-primary_color">01 July 23</td>
                      <td className="cs-primary_color">01 August 23</td>
                      <td className="cs-primary_color">$560.00</td>
                      <td className="cs-primary_color">30%</td>
                      <td className="cs-text_right cs-primary_color">$560</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
          <div className="display-flex justify-content-flex-end">
            <div className="invoice-table-footer">
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
                      <td>{grandTotalInWords}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="company-sign d-flex justify-end">
            <div className="text-center">
              <span>{invoiceDetails?.bankDetails?.signatureName}</span>
              <img src={invoiceDetails?.bankDetails?.signatureImage}></img>
              <p>Signature</p>
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
    </div>
  );
};

export default GeneralInvoice15;
