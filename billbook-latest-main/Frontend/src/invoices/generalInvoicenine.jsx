import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoicenine = ({ invoiceDetails }) => {
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
    <div class="tm_container  general-invoice-1">
      <div class="tm_invoice_wrap">
        <div class="tm_invoice tm_style1 tm_type3" id="tm_download_section">
          <div class="tm_shape_1">
            <svg
              width="850"
              height="151"
              viewBox="0 0 850 151"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M850 0.889398H0V150.889H184.505C216.239 150.889 246.673 141.531 269.113 124.872L359.112 58.0565C381.553 41.3977 411.987 32.0391 443.721 32.0391H850V0.889398Z"
                fill="#007AFF"
                fill-opacity="0.1"
              />
            </svg>
          </div>
          <div class="tm_shape_2">
            <svg
              width="850"
              height="151"
              viewBox="0 0 850 151"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 150.889H850V0.889408H665.496C633.762 0.889408 603.327 10.2481 580.887 26.9081L490.888 93.7224C468.447 110.381 438.014 119.74 406.279 119.74H0V150.889Z"
                fill="#007AFF"
                fill-opacity="0.1"
              />
            </svg>
          </div>
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
              <div class="tm_invoice_seperator">
                <img src="assets/img/arrow_bg.svg" alt="" />
              </div>
              <div class="tm_invoice_info_list">
                <p class="tm_invoice_number tm_m0">
                  Invoice No: <b class="tm_primary_color">{number}</b>
                </p>
                <p class="tm_invoice_date tm_m0">
                  Date:<b>{new Date(date).toLocaleDateString()}</b>
                </p>
                <div class="tm_invoice_info_list_bg tm_accent_bg_10"></div>
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
                  {invoiceDetails?.customerName?.phoneNumber}
                  <br />
                  {invoiceDetails?.customerName?.PANNumber}
                  <br />


                </p>
              </div>
              <div class="tm_invoice_right tm_text_right">
                <p class="tm_mb2">
                  <b class="tm_primary_color">Pay To:</b>
                </p>
                <p>{userProfileData?.businessName}<br />
                  {userProfileData?.email} <br />
                  {userProfileData?.phone}<br />
                  {userProfileData?.gstNumber}
                  {userProfileData?.PANNumber}

                </p>
              </div>
            </div>
            <div class="tm_table tm_style1 tm_mb30">
              <div class="tm_table_responsive">
                <table class="tm_border_bottom">
                  <thead>
                    <tr class="tm_border_top">
                      <th class="tm_width_2 tm_semi_bold tm_primary_color tm_accent_bg_10 tm_text_right">
                        Id
                      </th>
                      <th class="tm_width_3 tm_semi_bold tm_primary_color tm_accent_bg_10">
                        Items
                      </th>
                      <th class="tm_width_4 tm_semi_bold tm_primary_color tm_accent_bg_10">
                        Price
                      </th>
                      <th class="tm_width_2 tm_semi_bold tm_primary_color tm_accent_bg_10">
                        Quantity
                      </th>
                      <th class="tm_width_1 tm_semi_bold tm_primary_color tm_accent_bg_10">
                        Discount
                      </th>
                      <th class="tm_width_2 tm_semi_bold tm_primary_color tm_accent_bg_10 tm_text_right">
                        Tax
                      </th>
                      <th class="tm_width_2 tm_semi_bold tm_primary_color tm_accent_bg_10 tm_text_right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceDetails?.table?.map((item, index) => (
                      <tr key={index}>
                        <td className="tm_width_2">{index + 1}</td>
                        <td class="tm_width_3">{item.productName}</td>
                        <td class="tm_width_4">{item.price}</td>
                        <td class="tm_width_2">{item.quantity}</td>
                        <td class="tm_width_1">{item.discount}</td>
                        <td className="tm_width_2">{item.gstRate}</td>
                        <td class="tm_width_2 tm_text_right">
                          {item.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      <br />
                      {/* Amount: {invoiceDetails?.grandTotal} */}
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
                          Total Amount{" "}
                        </td>
                        <td class="tm_width_3 tm_border_top_0 tm_bold tm_f16 tm_primary_color tm_text_right">
                          {grandTotalInWords}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="company-sign">
                    <img src={invoiceDetails?.bankDetails?.signatureImage?.url} className="mx-auto" alt=""></img>
                    <span className="d-flex justify-content-center">Signature</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="tm_padd_15_20">
              <p class="tm_mb2">
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
  );
};

export default GeneralInvoicenine;
