import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";


const GeneralInvoicesix = ({ invoiceDetails }) => {

  const userData = useSelector((state) => state?.user?.userData);

  console.log("usefhju", userData?.data)
  const userProfileData = userData?.data;
  console.log("userProfileData", userProfileData)

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
      <div class="tm_container">
        <div class="tm_invoice_wrap">
          <div
            class="tm_invoice tm_style2 tm_type1 tm_accent_border tm_radius_0 tm_small_border"
            id="tm_download_section"
          >
            <div class="tm_invoice_in">
              <div class="tm_invoice_head tm_mb20 tm_m0_md">
                <div class="tm_invoice_left">
                  <div class="tm_logo">
                    <img src={userProfileData?.profileImage?.url} alt="logo" />
                  </div>
                </div>
                <div class="tm_invoice_right">
                  <div class="tm_grid_row tm_col_3">
                    <div class="tm_text_center">
                      <p class="tm_accent_color tm_mb0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                        >
                          <path d="M424 80H88a56.06 56.06 0 00-56 56v240a56.06 56.06 0 0056 56h336a56.06 56.06 0 0056-56V136a56.06 56.06 0 00-56-56zm-14.18 92.63l-144 112a16 16 0 01-19.64 0l-144-112a16 16 0 1119.64-25.26L256 251.73l134.18-104.36a16 16 0 0119.64 25.26z" />
                        </svg>
                      </p>
                      {userProfileData?.email}
                      {/* jobs@gmail.com */}
                    </div>
                    <div class="tm_text_center">
                      <p class="tm_accent_color tm_mb0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                        >
                          <path d="M391 480c-19.52 0-46.94-7.06-88-30-49.93-28-88.55-53.85-138.21-103.38C116.91 298.77 93.61 267.79 61 208.45c-36.84-67-30.56-102.12-23.54-117.13C45.82 73.38 58.16 62.65 74.11 52a176.3 176.3 0 0128.64-15.2c1-.43 1.93-.84 2.76-1.21 4.95-2.23 12.45-5.6 21.95-2 6.34 2.38 12 7.25 20.86 16 18.17 17.92 43 57.83 52.16 77.43 6.15 13.21 10.22 21.93 10.23 31.71 0 11.45-5.76 20.28-12.75 29.81-1.31 1.79-2.61 3.5-3.87 5.16-7.61 10-9.28 12.89-8.18 18.05 2.23 10.37 18.86 41.24 46.19 68.51s57.31 42.85 67.72 45.07c5.38 1.15 8.33-.59 18.65-8.47 1.48-1.13 3-2.3 4.59-3.47 10.66-7.93 19.08-13.54 30.26-13.54h.06c9.73 0 18.06 4.22 31.86 11.18 18 9.08 59.11 33.59 77.14 51.78 8.77 8.84 13.66 14.48 16.05 20.81 3.6 9.53.21 17-2 22-.37.83-.78 1.74-1.21 2.75a176.49 176.49 0 01-15.29 28.58c-10.63 15.9-21.4 28.21-39.38 36.58A67.42 67.42 0 01391 480z" />
                        </svg>
                        
                      </p>
                      {userProfileData?.phone}
                    </div>
                    <div class="tm_text_center">
                      <p class="tm_accent_color tm_mb0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24"
                          height="24"
                          viewBox="0 0 512 512"
                          fill="currentColor"><path fill="#146ebe" d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 352h8.2c32.3-39.1 81.1-64 135.8-64c5.4 0 10.7 .2 16 .7V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM320 352H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H360.2C335.1 449.6 320 410.5 320 368c0-5.4 .2-10.7 .7-16l-.7 0zm320 16a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zM496 288c8.8 0 16 7.2 16 16v48h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H496c-8.8 0-16-7.2-16-16V304c0-8.8 7.2-16 16-16z" /></svg>
                      </p>
                      {userProfileData?.businessName}
                    </div>
                  </div>
                </div>
                <div class="tm_shape_bg tm_accent_bg_10 tm_border tm_accent_border_20"></div>
              </div>
              <div class="tm_invoice_info tm_mb30 tm_align_center">
                <div class="tm_invoice_info_left tm_mb20_md">
                  <p class="tm_mb0">
                    <b class="tm_primary_color">Invoice No: </b>
                    {number}
                    <br />
                    <b class="tm_primary_color">Invoice Date: </b>
                    {new Date(date).toLocaleDateString()}
                  </p>
                </div>
                <div class="tm_invoice_info_right">
                  <div class="tm_border tm_accent_border_20 tm_radius_0 tm_accent_bg_10 tm_curve_35 tm_text_center">
                    <div>
                      <b class="tm_accent_color tm_f26 tm_medium tm_body_lineheight">
                        Total: {invoiceDetails?.grandTotal}
                      </b>
                    </div>
                  </div>
                </div>
              </div>
              <h2 class="tm_f16 tm_section_heading tm_accent_border_20 tm_mb0">
                <span class="tm_accent_bg_10 tm_radius_0 tm_curve_35 tm_border tm_accent_border_20 tm_border_bottom_0 tm_accent_color">
                  <span>Invoice To</span>
                </span>
              </h2>
              <div class="tm_table tm_style1 tm_mb30">
                <div class="tm_border  tm_accent_border_20 tm_border_top_0">
                  <div class="tm_table_responsive">
                    <table>
                      <tbody>
                        <tr>
                          <td class="tm_width_6 tm_border_top_0">
                            <b class="tm_primary_color tm_medium">Name: </b>
                            {name}
                          </td>
                          <td class="tm_width_6 tm_border_top_0 tm_border_left tm_accent_border_20">
                            <b class="tm_primary_color tm_medium">Phone: </b>{" "}
                            {invoiceDetails?.customerName?.phoneNumber}
                          </td>
                        </tr>
                        <tr>
                          <td class="tm_width_6 tm_accent_border_20">
                            <b class="tm_primary_color tm_medium">Email: </b>
                            {invoiceDetails?.customerName?.email}
                          </td>
                          <td className="tm_width_6 tm_border_left tm_accent_border_20">
                            <b className="tm_primary_color tm_medium">
                              Address:{" "}
                            </b>
                            {
                              addressLine1 === 'undefined' ? " " : `${addressLine1}`
                            }
                            {" "}
                            {invoiceDetails?.customerName?.billingAddress?.state}{" "}
                            {invoiceDetails?.customerName?.billingAddress?.country}{" "}
                            {invoiceDetails?.customerName?.billingAddress?.pincode}

                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="tm_table tm_style1">
                <div className="tm_border tm_accent_border_20">
                  <div className="tm_table_responsive">
                    <table>
                      <thead>
                        <tr>
                          <th className="tm_width_1 tm_semi_bold tm_accent_color tm_accent_bg_10">
                            Id
                          </th>
                          <th className="tm_width_2 tm_semi_bold tm_accent_color tm_accent_bg_10">
                            Item
                          </th>
                          <th className="tm_width_2 tm_semi_bold tm_accent_color tm_accent_bg_10">
                            Price
                          </th>
                          <th className="tm_width_2 tm_semi_bold tm_accent_color tm_accent_bg_10">
                            Quantity
                          </th>
                          <th className="tm_width_2 tm_semi_bold tm_accent_color tm_accent_bg_10">
                            Discount
                          </th>
                          <th className="tm_width_2 tm_semi_bold tm_accent_color tm_accent_bg_10 ">
                            Tax
                          </th>
                          <th className="tm_width_2 tm_semi_bold tm_accent_color tm_accent_bg_10 ">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceDetails?.table?.map((item, index) => (
                          <tr key={index}>
                            <td className="tm_width_1 tm_accent_border_20">
                              {index + 1}
                            </td>
                            <td className="tm_width_2 tm_accent_border_20">
                              {item.productName}
                            </td>
                            <td className="tm_width_2 tm_accent_border_20">
                              {item.price}
                            </td>
                            <td className="tm_width_2 tm_accent_border_20">
                              {item.quantity}
                            </td>
                            <td className="tm_width_2 tm_accent_border_20">
                              {item.discount}
                            </td>
                            <td className="tm_width_2 tm_accent_border_20 ">
                              {item.gstRate}
                            </td>
                            <td className="tm_width_2 tm_accent_border_20 ">
                              {item.totalAmount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="tm_invoice_footer tm_mb15 tm_m0_md">
                  {invoiceDetails?.bankDetails?.selectBank.length > 0 && (
                    <div className="tm_left_footer">
                      <p className="tm_mb2">
                        <b className="tm_primary_color">Payment info:</b>
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
                    <table class="tm_mb15 tm_m0_md">
                      <tbody>
                        <tr>
                          <td class="tm_width_3 tm_primary_color tm_border_none tm_medium">
                            Taxable Amount
                          </td>
                          <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_medium">
                            {invoiceDetails?.taxableAmount}
                          </td>
                        </tr>
                        <tr>
                          <td class="tm_width_3 tm_primary_color tm_border_none tm_medium">
                            Discount
                          </td>
                          <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_medium">
                            {invoiceDetails?.totalDiscount}
                          </td>
                        </tr>
                        <tr>
                          <td class="tm_width_3 tm_primary_color tm_border_none tm_medium">
                            Tax
                          </td>
                          <td class="tm_width_3 tm_primary_color tm_text_right tm_border_none tm_medium">
                            {invoiceDetails?.totalTax}
                          </td>
                        </tr>

                        <tr class="tm_accent_border_20 tm_border">
                          <td class="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_accent_bg_10">
                            Grand Total{" "}
                          </td>
                          <td class="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_text_right tm_accent_bg_10">
                            {invoiceDetails?.grandTotal}
                          </td>
                        </tr>
                        <tr class="tm_accent_border_20 tm_border">
                          <td class="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_accent_bg_10">
                            Total Amount(in words)
                          </td>
                          <td class="tm_width_3 tm_bold tm_f16 tm_border_top_0 tm_accent_color tm_text_right tm_accent_bg_10">
                            {grandTotalInWords}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="tm_invoice_footer tm_type1">
                  <div class="tm_left_footer">
                    <p class="tm_primary_color tm_f12 tm_m0 tm_bold">
                      Terms & Condition
                    </p>
                    <p class="tm_m0 tm_f12">
                      {invoiceDetails?.bankDetails?.termsAndConditions}
                    </p>
                    {invoiceDetails?.bankDetails?.notes.length > 0 && (
                      <>
                        <p class="tm_primary_color tm_f12 tm_m0 tm_bold">
                          Notes
                        </p>
                        <p class="tm_m0 tm_f12">
                          {invoiceDetails?.bankDetails?.notes}
                        </p>
                      </>
                    )}
                  </div>
                  <div class="tm_right_footer">
                    <div class="tm_sign tm_text_center">
                      <img src={invoiceDetails?.bankDetails?.signatureImage?.url} alt="" className="mx-auto" />
                      <p class="tm_m0 tm_ternary_color">
                        Signature
                      </p>
                    </div>
                  </div>

                </div>
              </div>
              <div class="tm_bottom_invoice tm_accent_border_20">
                <div class="tm_bottom_invoice_left">
                  <p class="tm_m0 tm_f18 tm_accent_color tm_mb5">
                    Thank you for your business.
                  </p>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default GeneralInvoicesix;
