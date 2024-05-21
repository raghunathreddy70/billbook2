import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import React, { useState } from 'react'


const TotalLengthBlocks = ({ vendorInvoiceDetails, Recepit, Clipboard, vendorDetails, totalAmount, customerDetails, TransactionMinus, balance, ArchiveBook, numberOfInvoices, totalNumbers }) => {

    console.log(totalNumbers, "vendors")

    const OutstandingTransactions = vendorInvoiceDetails?.filter((filterData) => filterData.status === "Unpaid");

    const paidTransactions = vendorInvoiceDetails?.filter((filterData)=>{
        filterData.status === "Paid"
    })
    const totalledgerAmount = vendorInvoiceDetails?.length > 0 && vendorInvoiceDetails?.reduce((item,grandTotal)=>{
        console.log(grandTotal)
        return item + grandTotal?.credit
    })
    
    const totalbalanceAmount = vendorInvoiceDetails?.credit
    const PaidAmount = totalledgerAmount - totalbalanceAmount
    const totalOutstandingAmount = totalledgerAmount - PaidAmount

    return (
        <div className="vendor-card-list">
           <div className="col-md-12">
           <div className="row">
            <div className="col-md-4">
            <div className="vendor-cards">
                <div className="card inovices-card w-100">
                    <div className="card-body">
                        <div className="dash-widget-header">
                            <span className="inovices-widget-icon bg-info-light">
                                <img src={Recepit} alt="recipt" />
                            </span>
                            <div className="dash-count">
                                <div className="dash-title">
                                    Total Invoice Amount
                                </div>
                                <div className="dash-counts">
                                <p>{totalNumbers?.invoicesTotalAmt.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <p className="inovices-all">
                                No of Invoice{" "}
                                <span className="rounded-circle bg-light-gray">
                                    {totalNumbers?.numberOfInvoices}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="vendor-cards">
                <div className="card inovices-card w-100">
                    <div className="card-body">
                        <div className="dash-widget-header">
                            <span className="inovices-widget-icon bg-primary-light">
                                <img src={TransactionMinus} alt="minus" />
                            </span>
                            <div className="dash-count">
                                <div className="dash-title">
                                    Total Paid
                                </div>
                                <div className="dash-counts">
                                    <p> {totalNumbers?.grandPaid}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="inovices-all">
                                No of Invoice{" "}
                                <span className="rounded-circle bg-light-gray">
                                    {OutstandingTransactions?.length}
                                    {totalNumbers?.totalInvoicePaid}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="vendor-cards">
                <div className="card inovices-card w-100">
                    <div className="card-body">
                        <div className="dash-widget-header">
                            <span className="inovices-widget-icon bg-warning-light">
                                <img src={ArchiveBook} alt="archiveBook" />
                            </span>

                            <div className="dash-count">
                                <div className="dash-title">Total Unpaid</div>
                                <div className="dash-counts">
                                    <p>{totalNumbers?.grandUnPaid}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="inovices-all">
                                No of Invoice{" "}
                                <span className="rounded-circle bg-light-gray">
                                    {paidTransactions?.length}
                                    {totalNumbers?.totalInvoiceUnPaid}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
           </div>
           </div>

        </div>
    )
}

export default TotalLengthBlocks