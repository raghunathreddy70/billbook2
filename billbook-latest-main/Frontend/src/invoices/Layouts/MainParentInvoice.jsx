import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import React from "react";

const MainParentInvoice = ({
  menu,
  invoiceRef,
  title,
  invoiceDetails,
  invoiceDate,
  invoiceNumber,
  addressName,
  addressLine1,
  addressLine2,
  city,
  state,
  pincode,
  country,
  accountNumber,
  accountName,
  branchName,
  IFSCCode,
  toTitle,
}) => {
  return (
    <div className="w-full bg-white flex justify-center invoice-print">
      <div
        className={`print-only-section w-[790px] h-full ${
          menu ? "slide-nav" : ""
        }`}
        ref={invoiceRef}
      >
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="card !shadow-none">
              <div className="card-body">
                <div className="card-table">
                  <div className="card-body">
                    {/* Invoice Logo */}
                    <div className="invoice-item invoice-item-one">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="invoice-logo">
                            <img src="/logo1Webp.webp" alt="logo" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="invoice-info">
                            <h1>{title}</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Invoice Logo */}
                    {/* Invoice Date */}
                    <div className="invoice-item invoice-item-date">
                      <div className="row">
                        <div className="col-md-6">
                          {invoiceDate && (
                            <p className="text-start invoice-details">
                              Date<span>: </span>
                              <>
                                {new Date(invoiceDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )}
                                {/* ) */}
                              </>
                            </p>
                          )}
                        </div>
                        <div className="col-md-6">
                          {invoiceNumber && (
                            <p className="invoice-details">
                              Invoice No<span>: </span>
                              {invoiceNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* /Invoice Date */}
                    {/* Invoice To */}
                    <div className="invoice-item invoice-item-two">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="invoice-info">
                            <strong className="customer-text-one">
                              {toTitle || "Invoiced To"}
                              <span>:</span>
                            </strong>
                            {invoiceDetails && (
                              <p className="invoice-details-two">
                                {addressName && (
                                  <span>
                                    {addressName},<br />
                                  </span>
                                )}
                                {addressLine1 && (
                                  <span>
                                    {addressLine1},<br />
                                  </span>
                                )}
                                {addressLine2 && (
                                  <span>
                                    {addressLine2},{city}
                                    <br />
                                  </span>
                                )}
                                {state && (
                                  <span>
                                    {state},{pincode}
                                    <br />
                                  </span>
                                )}
                                {country && <span>{country}</span>}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="invoice-info">
                            {accountNumber && (
                              <>
                                <strong className="customer-text-one">
                                  Bank Details<span>:</span>
                                </strong>
                                <p className="invoice-details-two">
                                  {accountName}, <br />
                                  {accountNumber}, <br />
                                  {branchName}, <br />
                                  {IFSCCode}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        {/* </div> */}
                        <div className="col-md-4">
                          <div className="invoice-info invoice-info2">
                            <strong className="customer-text-one">
                              Pay To<span>:</span>
                            </strong>
                            <p className="invoice-details-two text-end">
                              Walter Roberson
                              <br />
                              299 Star Trek Drive, Panama City,
                              <br />
                              Florida, 32405,
                              <br />
                              USA
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Invoice To */}
                    {/* Invoice Item */}
                    <div className="invoice-item invoice-table-wrap">
                      <div className="invoice-table-head">
                        <h6>Items:</h6>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          {invoiceDetails && invoiceDetails.table ? (
                            <div className="table-responsive">
                              <table className="table table-center table-hover mb-0">
                                <thead className="thead-light ">
                                  <tr>
                                    {/* <th>Product ID</th> */}
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Discount</th>
                                    <th>Tax</th>
                                    <th>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {invoiceDetails.table.map((item, index) => (
                                    <>
                                      <tr key={index}>
                                        {/* <td>{item.productId}</td> */}
                                        <td>{item.productName}</td>

                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.discount}</td>
                                        <td>{item.gstRate}</td>
                                        <td>{item.totalAmount.toFixed(2)}</td>
                                      </tr>
                                    </>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p>No items available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* /Invoice Item */}
                    {/* Terms & Conditions */}
                    <div className="terms-conditions credit-details">
                      <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6 col-md-6">
                          <div className="invoice-terms align-center">
                            <span className="invoice-terms-icon bg-white-smoke me-3">
                              <i className="fe fe-file-text">
                                <FeatherIcon icon="file-text" />
                              </i>
                            </span>
                            <div className="invocie-note">
                              <h6>Terms &amp; Conditions</h6>
                              <p className="mb-0">
                                {
                                  invoiceDetails?.bankDetails
                                    ?.termsAndConditions
                                }
                              </p>
                            </div>
                          </div>
                          <div className="invoice-terms align-center">
                            <span className="invoice-terms-icon bg-white-smoke me-3">
                              <i className="fe fe-file-minus">
                                <FeatherIcon icon="file-minus" />
                              </i>
                            </span>
                            <div className="invocie-note">
                              <h6>Note</h6>
                              <p className="mb-0">
                                {invoiceDetails?.bankDetails?.notes}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-5 col-md-6">
                          <div className="invoice-total-card">
                            <div className="invoice-total-box">
                              <div className="invoice-total-inner">
                                <p>
                                  Taxable Amount
                                  <span>{invoiceDetails?.taxableAmount}</span>
                                </p>
                                <p>
                                  Total Discount (
                                  {invoiceDetails?.totalDiscountPercentage}
                                  %)
                                  <span>{invoiceDetails?.totalDiscount}</span>
                                </p>
                                <p>
                                  Total Tax (
                                  {invoiceDetails?.totalTaxPercentage}%)
                                  <span>{invoiceDetails?.totalTax}</span>
                                </p>
                                <p>
                                  CGST Amount (
                                  {invoiceDetails?.cgstTaxPercentage}%)
                                  <span>{invoiceDetails?.cgstTaxAmount}</span>
                                </p>
                                <p>
                                  SGST Amount (
                                  {invoiceDetails?.sgstTaxPercentage}%)
                                  <span>{invoiceDetails?.sgstTaxAmount}</span>
                                </p>

                                {/* <p>
                                      Vat <span>$0.00</span>
                                    </p> */}
                              </div>
                              <div className="invoice-total-footer">
                                <h4>
                                  Grand Total(INR){" "}
                                  <span>{invoiceDetails?.grandTotal}</span>
                                </h4>
                                <h4>
                                  Currency{" "}
                                  <span>{invoiceDetails?.currency}</span>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="invoice-sign text-end">
                      {invoiceDetails?.bankDetails?.signatureName && (
                        <span className="d-block">
                          {invoiceDetails?.bankDetails?.signatureName}
                        </span>
                      )}
                      {invoiceDetails?.bankDetails?.signatureImage?.url && (
                        <img
                          className="img-fluid d-inline-block"
                          src={invoiceDetails?.bankDetails?.signatureImage?.url}
                          alt="sign"
                        />
                      )}
                    </div>

                    {/* /Terms & Conditions */}
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

export default MainParentInvoice;
