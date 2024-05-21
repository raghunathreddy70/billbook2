import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import numberToWords from "./NumberConvertion";
import { useSelector } from "react-redux";

const GeneralInvoice14 = ({ invoiceDetails }) => {

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
    <div className="cs-container general-invoice-1">
      <div className="cs-bg-white cs-border-radious25">
        <div className="cs-bottom-bg2">
          <div className="cs-top-bg2">
            <div className="cs-invoice cs-style1 cs-bg-none">
              <div>
                <div className="cs-invoice_in" id="download_section">
                  <div>
                    <div className="cs-logo">
                      <img
                        className="cs-mr10"
                        src="/logo1.svg"
                        alt="Logo"
                        style={{ width: "100px", height: "auto" }}
                      />
                    </div>
                  </div>
                  <div className="cs-mb50">
                    <div className="cs-text_right">
                      <b className="cs-primary_color">INVOICE</b>
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
                    <div className="cs-invoice_left">
                      <b className="cs-primary_color">BILLED TO:</b>
                      <p>
                        Johan Smith <br /> Ivonne Company, <br /> 365 Bloor
                        Street East, Toronto, <br /> Ontario, M4W 3L4, Canada{" "}
                        <br /> subscriber@email.com
                      </p>
                    </div>
                  </div>
                  <div className="cs-table cs-style2 tm-border-none padding-rignt-left">
                    <div className="tm-border-none">
                      <div className="cs-table_responsive">
                        <table className="cs-mb30">
                          <div className="tm-border-1px"></div>
                          <thead className="border-bottom-1 cs-mb50">
                            <tr className="cs-secondary_color">
                              <th className="cs-width_5 cs-normal">Items</th>
                              <th className="cs-width_2 cs-normal"> Price</th>
                              <th className="cs-width_2 cs-normal">
                                {" "}
                                Quantity
                              </th>
                              <th className="cs-width_2 cs-normal">
                                {" "}
                                Discount
                              </th>
                              <th className="cs-width_2 cs-normal"> Tax</th>
                              <th className="cs-width_2 cs-normal cs-text_right">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceDetails?.table?.map((item, index) => (
                              <tr key={index} className="border-bottom-1">
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
                  <div className="display-flex space-between mq-align-items">
                    <div className="cs-width_7 cs-mt70">
                      <p className="cs-primary_color cs-bold cs-f16 cs-uppercase">
                        Payment Method
                      </p>
                      <div className="display-flex space-between cs-mb30">
                        <div className="cs-m0">
                          <p className="cs-primary_color cs-mb3 cs-semi_bold">
                            BANK INFO:
                          </p>
                          <p className="cs-lh-165 cs-m0">
                            {invoiceDetails?.bankDetails?.selectBank?.map(
                              (bank, index) => (
                                <div key={index} className="tm_m0">
                                  <p>
                                    Account Name: {bank.accountName} <br />
                                    Bank Account Number:{" "}
                                    {bank.bankAccountNumber} <br />
                                    IFSC Code: {bank.IFSCCode} <br />
                                    Branch Name: {bank.branchName}
                                  </p>
                                </div>
                              )
                            )}
                          </p>
                        </div>
                        <div>
                          {/* <p className="cs-primary_color cs-mb3 cs-semi_bold">
                            BANK INFO:
                          </p> */}
                          {/* <p className="cs-lh-165">
                            3752 4521 8465 45621 <br /> Canadian Bank <br />{" "}
                            Johan Stark
                          </p> */}
                        </div>
                      </div>
                    </div>
                    <div className="cs-width_4">
                      <p className="cs-secondary_color cs-text_right cs-f15">
                        Taxable Amount:
                        <span className="cs-ml30 cs-primary_color cs-semi_bold">
                          {invoiceDetails?.taxableAmount}
                        </span>{" "}
                      </p>
                      <p className="cs-secondary_color cs-text_right cs-f15">
                        Discount:
                        <span className=" cs-ml30 cs-primary_color cs-semi_bold">
                          {invoiceDetails?.totalDiscount}
                        </span>{" "}
                      </p>
                      <p className="cs-secondary_color cs-text_right cs-f15 cs-mt15">
                        Total:{" "}
                        <span className="cs-ml30 cs-primary_color cs-semi_bold">
                          {invoiceDetails?.grandTotal}
                        </span>{" "}
                      </p>
                      <p className="cs-secondary_color cs-text_right cs-f15 cs-mt15">
                        Total Amount:{" "}
                        <span className="cs-ml30 cs-primary_color cs-semi_bold">
                          {grandTotalInWords}
                        </span>{" "}
                      </p>
                    </div>
                  </div>
                  <div className="cs-mb50">
                  <div className="display-flex justify-content-flex-end">
                      <div className="company-sign">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInvoice14;
