import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoiceseven = ({ invoiceDetails }) => {

  const userData = useSelector((state) => state?.user?.userData);

  console.log("usefhju", userData?.data)
  const userProfileData = userData?.data;
  console.log("users", userProfileData);
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
    <div class="tm_container tmd-cd-cdd">
      <div class="tm_invoice_wrap">
        <div class="tm_invoice tm_style3" id="tm_download_section">
          <div class="tm_invoice_in">
            <div class="tm_invoice_head tm_align_center tm_accent_bg">
              <div class="tm_invoice_left">
                <div class="tm_logo">
                  {" "}
                  <img src={userProfileData?.profileImage?.url} alt="logo" />
                </div>
              </div>
              <div class="tm_invoice_right">
                <div class="tm_head_address tm_white_color">
                  <div className="invoice-to-do-address-text">Pay To :</div>
                  {userProfileData?.businessName}
                  <br />
                  {userProfileData?.email}
                  <br />
                  {userProfileData?.phone}
                  <br/>
                  {userProfileData?.gstNumber}
                  {userProfileData?.PANNumber}
                </div>
              </div>
              <div class="tm_primary_color tm_text_uppercase tm_watermark_title tm_white_color">
                Invoice
              </div>
            </div>
            <div class="tm_invoice_info">
              <div class="tm_invoice_info_left tm_gray_bg">
                <p class="tm_mb2">
                  <b class="tm_primary_color">Invoice To:</b>
                </p>
                <p class="tm_mb0">
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
              <div class="tm_invoice_info_right tm_text_right">
                <p class="tm_invoice_number tm_m0">
                  Invoice No: <b class="tm_primary_color">{number}</b>
                </p>
                <p class="tm_invoice_date tm_m0">
                  Date:<span>{new Date(date).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
            <div class="tm_invoice_details">
              <div class="tm_table tm_style1 tm_mb30">
                <div class="tm_border">
                  <div class="tm_table_responsive">
                    <table class="tm_gray_bg">
                      <thead>
                        <tr>
                          <th class="tm_width_2 tm_semi_bold tm_white_color tm_accent_bg tm_border_left">
                            Id
                          </th>
                          <th class="tm_width_5 tm_semi_bold tm_white_color tm_accent_bg tm_border_left">
                            {" "}
                            Item
                          </th>
                          <th class="tm_width_1 tm_semi_bold tm_white_color tm_accent_bg tm_border_left">
                            Price
                          </th>
                          <th class="tm_width_2 tm_semi_bold tm_white_color tm_accent_bg tm_border_left">
                            Quantity
                          </th>
                          <th class="tm_width_2 tm_semi_bold tm_white_color tm_accent_bg tm_border_left">
                            Discount
                          </th>
                          <th class="tm_width_2 tm_semi_bold tm_white_color tm_accent_bg tm_border_left tm_text_right">
                            Tax
                          </th>
                          <th class="tm_width_2 tm_semi_bold tm_white_color tm_accent_bg tm_border_left tm_text_right">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceDetails?.table?.map((item, index) => (
                          <tr key={index}>
                            <td className="tm_width_2 tm_border_left">
                              {index + 1}
                            </td>
                            <td className="tm_width_5 tm_border_left">{item.productName}</td>
                            <td className="tm_width_1 tm_border_left">
                              {item.quantity}
                            </td>
                            <td className="tm_width_2 tm_border_left">
                              {item.price}
                            </td>
                            <td className="tm_width_2 tm_border_left">
                              {item.discount}%
                            </td>
                            <td className="tm_width_2 tm_border_left">
                              {item.gstRate}
                            </td>
                            <td className="tm_width_2 tm_border_left">
                              {item.totalAmount}%
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
                    </div>
                  )}
                  <div class="tm_right_footer">
                    <table class="tm_gray_bg">
                      <tbody>
                        <tr>
                          <td class="tm_width_3 tm_primary_color tm_bold">
                            Total
                          </td>
                          <td class="tm_width_3 tm_primary_color tm_text_right tm_bold">
                            {invoiceDetails?.grandTotal}
                          </td>
                        </tr>
                        <tr>
                          <td class="tm_width_3 tm_primary_color tm_bold">
                            Total Amount(in words)
                          </td>
                          <td class="tm_width_3 tm_primary_color tm_text_right tm_bold">
                            {grandTotalInWords}
                          </td>
                        </tr>
                        <tr>
                          <td class="tm_width_3 tm_primary_color tm_bold">
                            Discount
                          </td>
                          <td class="tm_width_3 tm_primary_color tm_text_right tm_bold">
                            {invoiceDetails?.totalDiscount}
                          </td>
                        </tr>
                        <tr>
                          <td class="tm_width_3 tm_primary_color tm_bold">
                            Tax
                          </td>
                          <td class="tm_width_3 tm_primary_color tm_text_right tm_bold">
                            {invoiceDetails?.totalTax}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="tm_padd_15_20 tm_gray_bg">
                <p class="tm_mb5">
                  <b class="tm_primary_color">Terms & Conditions:</b>
                </p>
                <ul class="tm_m0 tm_note_list">
                  {invoiceDetails?.bankDetails?.termsAndConditions.split('\n').map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInvoiceseven;
