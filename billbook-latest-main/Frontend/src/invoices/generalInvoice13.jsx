import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoice13 = ({ invoiceDetails }) => {
  const queryParameters = new URLSearchParams(window.location.search);
  const date = queryParameters.get("date");
  console.log("date", date);
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
    <div class="cs-container general-invoice-1">
      <div class="cs-invoice cs-style1">
        <div class="cs-invoice_in" id="download_section">
        <b class="cs-primary_color">INVOICE</b>
          <div class="cs-invoice_head cs-type1 cs-mb25 column border-bottom-none align-items-center">
            <div class="cs-invoice_left w-70 display-flex">
              <div class="cs-logo cs-mb5 cs-mr20">
                <img
                  className="cs-mr10"
                  src={userProfileData?.profileImage?.url}
                  alt="Logo"
                  style={{ width: "100px", height: "auto" }}
                />
              </div>
            </div>
            <div class="cs-ml22">
              <div class="cs-invoice_number cs-primary_color cs-mb0 cs-f16">
              </div>
              <div class="cs-invoice_number cs-primary_color cs-mb0 cs-f16 display-flex gap-1">
                <p class="cs-mb0 cs-primary_color cs-mr15">
                  <b>GSTIN:</b>
                </p>
                <p class="cs-mb0">{GSTNo}</p>
              </div>
              <div class="cs-invoice_number cs-primary_color cs-mb0 cs-f16  display-flex gap-2">
                <p class="cs-primary_color cs-mb0">
                  <b>Address:</b>
                </p>
                <p class="cs-mb0 cs-mr28">{
                  addressLine1 === 'undefined' ? " " : `${addressLine1}`
                }

                  {
                    addressLine2 === 'undefined' ? " " : `${addressLine2}`
                  }
                  {city === 'undefined' ? " " : `${city}`}
                  {state === 'undefined' ? " " : `${state}`}
                  {country === 'undefined' ? " " : `${country}`}
                  <br />
                  {phone}
                  <br />
                  {email}</p>
              </div>
              {/* <div class="cs-invoice_number cs-primary_color cs-mb0 cs-f16  display-flex space-between">
                  <p class="cs-primary_color cs-mb0">
                    <b>PAN:</b>
                  </p>
                  <p class="cs-mb0 cs-mr15">BSDFA07ERPCRM</p>
                </div> */}
            </div>
            <div class="cs-invoice_right cs-text_right">

              <div class="cs-invoice_number cs-primary_color cs-mb0 cs-f16  display-flex justify-content-flex-end">
                <p class="cs-primary_color cs-mb0">
                  <b>Invoice Date:</b>
                </p>
                <p class="cs-mb0">{new Date(date).toLocaleDateString()}</p>
              </div>
              <div class="cs-invoice_number cs-primary_color cs-mb0 cs-f16  display-flex justify-content-flex-end">
                <p class="cs-primary_color cs-mb0">
                  <b>Invoice No:</b>
                </p>
                <p class="cs-mb0">{number}</p>
              </div>
            </div>
          </div>
          <div class="display-flex cs-text_center">
            <div class="cs-border-1"></div>
            <h5 class="cs-width_12 cs-dip_green_color">INVOICE</h5>
            <div class="cs-border-1"></div>
          </div>

          <div class="cs-invoice_head cs-mb10 ">
            <div class="cs-invoice_left cs-mr97">
              <b class="cs-primary_color">Customer Name:</b>
              <p class="cs-mb8">{name}</p>
              <p>
                <b class="cs-primary_color cs-semi_bold">Customer GSTIN:</b>{" "}
                <br />
                {GSTNo}
              </p>
            </div>
            <div class="cs-invoice_right">
              <b class="cs-primary_color">Billing Address:</b>
              <p>
                <span>
                  {invoiceDetails?.customerName?.billingAddress
                    ?.addressLine1 === undefined ? " " :  `${invoiceDetails?.customerName?.billingAddress
                      ?.addressLine1} `}

                  {invoiceDetails?.customerName?.billingAddress
                    ?.addressLine2 === undefined
                    ? " "
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
                <br />
                <span>
                {invoiceDetails?.customerName?.billingAddress?.pincode ===
                    undefined
                    ? ""
                    : `${invoiceDetails?.customerName?.billingAddress?.pincode} `}
                </span>
              </p>
            </div>
            <div class="cs-invoice_right">
              <b class="cs-primary_color">Shipping Address:</b>
              <p>
                {
                  addressLine1 === 'undefined' ? " " : `${addressLine1}`
                }
                {
                  addressLine2 === 'undefined' ? " " : `${addressLine2}`
                }
                {city === 'undefined' ? " " : `${city}`}
                {state === 'undefined' ? " " : `${state}`}
                {country === 'undefined' ? " " : `${country}`}
              </p>
            </div>
          </div>
          <div class="cs-border"></div>
          <ul class="cs-grid_row cs-col_3 cs-mb0 cs-mt20">
            <li>
              <p class="cs-mb20">
                <b class="cs-primary_color">Due Date:</b>{" "}
                <span class="cs-primary_color">{new Date(invoiceDetails?.dueDate).toLocaleDateString()}</span>
              </p>
            </li>
          </ul>
          <div class="cs-border cs-mb30"></div>
          <div class="cs-table cs-style2 cs-f12">
            <div class="cs-round_border">
              <div class="cs-table_responsive">
                <table>
                  <thead>
                    <tr class="cs-focus_bg">
                      <th class="cs-width_3 cs-semi_bold cs-primary_color">
                        Items
                      </th>
                      <th class="cs-width_1 cs-semi_bold cs-primary_color">
                        Price
                      </th>
                      <th class="cs-width_1 cs-semi_bold cs-primary_color">
                        Quantity
                      </th>
                      <th class="cs-width_1 cs-semi_bold cs-primary_color">
                        Discount
                      </th>
                      <th class="cs-width_1 cs-semi_bold cs-primary_color">
                        Tax
                      </th>
                      <th class="cs-width_1 cs-semi_bold cs-primary_color">
                        Amount
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails?.table?.map((item, index) => (
                      <tr key={index}>
                        <td> {item.productName}</td>
                        <td> {item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.discount}</td>
                        <td> {item.gstRate}</td>
                        <td>{item.totalAmount}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="cs-table cs-style2 cs-mt20">
            <div class="cs-table_responsive">
              <table>
                <tbody>
                  <tr class="cs-table_baseline">
                    <td class="cs-width_6 cs-primary_color">
                      {" "}
                      {invoiceDetails?.bankDetails?.notes}
                    </td>
                    <td class="cs-width_3 cs-text_right">
                      <p class="cs-mb5 cs-mb5 cs-f15 cs-primary_color">
                        Taxable Amount:
                      </p>
                      <p class="cs-primary_color  cs-f16 cs-mb5 ">
                        Discount:
                      </p>
                      <p class="cs-primary_color  cs-f16 cs-mb5 ">
                        Tax:
                      </p>
                      <p class="cs-primary_color  cs-f16 cs-mb5 ">
                        Total:
                      </p>
                      <p class="cs-primary_color  cs-f16 cs-mb5 ">
                        Total Amount(in words):
                      </p>
                    </td>
                    <td class="cs-width_3 cs-text_rightcs-f16">
                      <p class="cs-mb5 cs-mb5 cs-text_right cs-f15 cs-primary_color">
                        {invoiceDetails?.taxableAmount}
                      </p>
                      <p class="cs-primary_color  cs-f16 cs-mb5 cs-text_right">
                        {invoiceDetails?.totalDiscount}
                      </p>
                      <p class="cs-primary_color  cs-f16 cs-mb5 cs-text_right">
                        {invoiceDetails?.totalTax}
                      </p>
                      <p class="cs-primary_color  cs-f16 cs-mb5 cs-text_right">
                        {invoiceDetails?.grandTotal}
                      </p>
                      <p class="cs-primary_color  cs-f16 cs-mb5 cs-text_right">
                        {grandTotalInWords}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="cs-border-1"></div>
            <div className="company-sign d-flex justify-end">
              <div className="text-center pb-2 mt-2">
                <span>{invoiceDetails?.bankDetails?.signatureName}</span>
                <img src={invoiceDetails?.bankDetails?.signatureImage?.url}></img>
                <span>Signature</span>
              </div>
            </div>
          </div>
          <p class="cs-border"></p>
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
  );
};

export default GeneralInvoice13;
