import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoiceeight = ({ invoiceDetails }) => {
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
    <div class="tm_container general-invoice-1">
      <div class="tm_invoice_wrap">
        <div
          class="tm_invoice tm_style1 tm_dark_invoice"
          id="tm_download_section"
        >
          <div class="tm_invoice_in">
            <div class="tm_invoice_head tm_align_center tm_mb20">
              <div class="tm_invoice_left">
                <div class="tm_logo">
                  {" "}
                  <img src={userProfileData?.profileImage?.url} alt="logo" />
                </div>
              </div>
              <div class="tm_invoice_right tm_text_right">
                <div class="tm_primary_color tm_f50 tm_text_uppercase">
                  Invoice
                </div>
              </div>
            </div>
            <div class="tm_invoice_info tm_mb20">
              <div class="tm_invoice_seperator tm_gray_bg"></div>
              <div class="tm_invoice_info_list">
                <p class="tm_invoice_number tm_m0">
                  Invoice No: <b class="tm_primary_color">{number}</b>
                </p>
                <p class="tm_invoice_date tm_m0">
                  Date:<span>{new Date(date).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
            <div class="tm_invoice_head tm_mb10">
              <div class="tm_invoice_left">
                <p class="tm_mb2">
                  <b class="tm_primary_color">Invoice To:</b>
                </p>
                <p>
                  {name} <br />
                  {invoiceDetails?.customerName?.email}
                  <br />
                  {invoiceDetails?.customerName?.phoneNumber}<br />

                  {invoiceDetails?.customerName?.PANNumber === undefined
                    ? " "
                    : `${invoiceDetails?.customerName?.PANNumber} `}
                  <br />
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
                  <br />
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
                </p>
              </div>
              <div class="tm_invoice_right tm_text_right">
                <p class="tm_mb2">
                  <b class="tm_primary_color">Pay To:</b>
                </p>
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
            <div class="tm_table tm_style1 tm_mb30">
              <div class="tm_round_border">
                <div class="tm_table_responsive">
                  <table>
                    <thead>
                      <tr>
                        <th class="tm_width_2 tm_semi_bold tm_primary_color tm_gray_bg">
                          Id
                        </th>
                        <th class="tm_width_3 tm_semi_bold tm_primary_color tm_gray_bg">
                          Item
                        </th>
                        <th class="tm_width_4 tm_semi_bold tm_primary_color tm_gray_bg">
                          {" "}
                          Price
                        </th>
                        <th class="tm_width_2 tm_semi_bold tm_primary_color tm_gray_bg">
                          Quantity
                        </th>
                        <th class="tm_width_1 tm_semi_bold tm_primary_color tm_gray_bg">
                          Discount
                        </th>
                        <th class="tm_width_2 tm_semi_bold tm_primary_color tm_gray_bg tm_text_right">
                          Tax
                        </th>
                        <th class="tm_width_2 tm_semi_bold tm_primary_color tm_gray_bg tm_text_right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceDetails?.table?.map((item, index) => (
                        <tr key={index}>
                          <td className="tm_width_2">{index + 1}</td>
                          <td className="tm_width_3">{item.productName}</td>
                          <td className="tm_width_4">
                            {item.price}
                          </td>
                          <td className="tm_width_2">{item.quantity}</td>
                          <td className="tm_width_1">{item.discount}</td>
                          <td className="tm_width_2">{item.gstRate}</td>
                          <td className="tm_width_2 tm_text_right">
                            {item.totalAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tm_invoice_footer">
                {invoiceDetails?.bankDetails?.selectBank.length > 0 && (
                  <div class="tm_left_footer">
                    <p class="tm_mb2">
                      <b class="tm_primary_color">Payment info:</b>
                    </p>
                    <p class="tm_m0">
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
                      Amount: {invoiceDetails?.grandTotal}
                    </p>
                  </div>
                )}
                <div class="tm_right_footer">
                  <table>
                    <tbody>
                      <tr>
                        <td class="tm_width_3 tm_primary_color tm_border_none tm_bold">
                          Subtoal
                        </td>
                        <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_bold">
                          {invoiceDetails?.taxableAmount}
                        </td>
                      </tr>
                      <tr>
                        <td class="tm_width_3 tm_primary_color tm_border_none tm_pt0">
                          Tax <span class="tm_ternary_color"></span>
                        </td>
                        <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_pt0">
                          {invoiceDetails?.totalTax}
                        </td>
                      </tr>
                      <tr class="tm_border_top tm_border_bottom">
                        <td class="tm_width_3 tm_border_top_0 tm_bold tm_f16 tm_primary_color">
                          Grand Total{" "}
                        </td>
                        <td class="tm_width_3 tm_border_top_0 tm_bold tm_f16 tm_primary_color tm_text_right">
                          {invoiceDetails?.grandTotal}
                        </td>
                      </tr>
                      <tr class="tm_border_top tm_border_bottom">
                        <td class="tm_width_3 tm_border_top_0 tm_bold tm_f16 tm_primary_color">
                          Total Amount(in words)
                        </td>
                        <td class="tm_width_3 tm_border_top_0 tm_bold tm_f16 tm_primary_color tm_text_right">
                          {grandTotalInWords}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="tm_padd_15_20 tm_round_border d-flex justify-content-between">
              <div>
                <p class="tm_mb5">
                  <b class="tm_primary_color">Terms & Conditions:</b>
                </p>
                <ul class="tm_m0 tm_note_list">
                  {invoiceDetails?.bankDetails?.termsAndConditions.split('\n').map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="company-sign">
                  <img src={invoiceDetails?.bankDetails?.signatureImage?.url} className="mx-auto" alt="" width={100} height={50}></img>
                  <span className="d-flex justify-content-center">Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GeneralInvoiceeight;
