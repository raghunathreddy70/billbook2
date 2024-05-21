import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import React from 'react'
import { ArchiveBook, Recepit, TransactionMinus } from '../../_components/imagepath'
import { MdArrowOutward } from 'react-icons/md'
import { FaRegFileAlt } from 'react-icons/fa'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoCart } from 'react-icons/io5'

const NumberCardsSales = ({ invoiceGrandTotal, allInvoicelength, totalPaidAmount, paidAmountLength, totalOutstandingAmount, outStandingLength, paidInvoicesTotalAmount }) => {
    return (
        <>
            <div className="row invoices-number-main-parent 700:my-3 300:my-2">
                <div className="col-xl-3 col-lg-3 col-sm-6 col-5 d-flex">
                    <div className='SalesInvoice-cards'>
                        <div className='SalesInvoice-cards-sub'>
                            <p>Recieved Amount</p>
                            <h2>INR {paidInvoicesTotalAmount}</h2>
                        </div>
                        <div className='SalesInvoice-cards-img' style={{ background: 'linear-gradient(to bottom, #32823F 44%, #FFFFFF 100%)' }}>
                            <MdArrowOutward />
                        </div>
                    </div>
                    {/* <div className="card inovices-card w-100 invoices-number-cards-body-y-align">
                    <div className="card-body invoices-number-cards-body">
                        <div className="dash-widget-header invoices-number-cards-flex-top">
                            <span className="inovices-widget-icon bg-info-light">
                                <img src={Recepit} alt="pic" />
                            </span>
                            <div className="dash-count invoices-number-cards-flex-top-count">
                                <div className="dash-title invoices-number-main-parent-cart-title">Recieved Amount</div>
                                <div className="dash-counts">
                                    <p>{invoiceGrandTotal}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center invoices-number-cards-flex-bottom">
                            <p className="inovices-all invoices-number-main-parent-cart-bottom-title">
                                No of Invoice{" "}
                                <span className="rounded-circle bg-light-gray">{allInvoicelength}</span>
                            </p>
                        </div>
                    </div>
                </div> */}
                </div>
                <div className="col-xl-3 col-lg-3 col-sm-6 col-5 d-flex">
                    <div className='SalesInvoice-cards'>
                        <div className='SalesInvoice-cards-sub'>
                            <p>Pending Amount</p>
                            <h2>INR {totalOutstandingAmount}</h2>
                        </div>
                        <div className='SalesInvoice-cards-img' style={{ background: 'linear-gradient(to bottom, #FC4747 72%, #FFFFFF 100%)' }}>
                            <MdArrowOutward />
                        </div>
                    </div>
                    {/* <div className="card inovices-card w-100 invoices-number-cards-body-y-align">
                    <div className="card-body invoices-number-cards-body">
                        <div className="dash-widget-header invoices-number-cards-flex-top">
                            <span className="inovices-widget-icon bg-warning-light">
                                <img src={ArchiveBook} alt="pic" />
                            </span>
                            <div className="dash-count invoices-number-cards-flex-top-count">
                                <div className="dash-title invoices-number-main-parent-cart-title">Total Paid</div>
                                <div className="dash-counts">
                                    <p>{totalPaidAmount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center invoices-number-cards-flex-bottom">
                            <p className="inovices-all invoices-number-main-parent-cart-bottom-title">
                                No of Invoice{" "}
                                <span className="rounded-circle bg-light-gray">{paidAmountLength}</span>
                            </p>
                        </div>
                    </div>
                </div> */}
                </div>
                <div className="col-xl-3 col-lg-3 col-sm-6 col-5 d-flex">
                    <div className='SalesInvoice-cards'>
                        <div className='SalesInvoice-cards-sub'>
                            <p>Total Invoices</p>
                            <h2>{allInvoicelength}</h2>
                        </div>
                        <div className='SalesInvoice-cards-img' style={{ background: '#2D3748' }}>
                            <FaRegFileAlt />
                        </div>
                    </div>
                    {/* <div className="card inovices-card w-100 invoices-number-cards-body-y-align">
                    <div className="card-body invoices-number-cards-body">
                        <div className="dash-widget-header invoices-number-cards-flex-top">
                            <span className="inovices-widget-icon bg-primary-light">
                                <img src={TransactionMinus} alt="pic" />
                            </span>
                            <div className="dash-count invoices-number-cards-flex-top-count">
                                <div className="dash-title invoices-number-main-parent-cart-title">Total Outstanding</div>
                                <div className="dash-counts">
                                    <p>{totalOutstandingAmount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center invoices-number-cards-flex-bottom">
                            <p className="inovices-all invoices-number-main-parent-cart-bottom-title">
                                No of Invoice{" "}
                                <span className="rounded-circle bg-light-gray">{outStandingLength}</span>
                            </p>
                        </div>
                    </div>
                </div> */}
                </div>
                <div className="col-xl-3 col-lg-3 col-sm-6 col-5 d-flex">
                    <div className='SalesInvoice-cards'>
                        <div className='SalesInvoice-cards-sub'>
                            <p>Total Sales</p>
                            <h2>INR {invoiceGrandTotal}</h2>
                        </div>
                        <div className='SalesInvoice-cards-img' style={{ background: '#2D3748' }}>
                        <IoCart />
                        </div>
                    </div>
                    {/* <div className="card inovices-card w-100 invoices-number-cards-body-y-align">
                    <div className="card-body invoices-number-cards-body">
                        <div className="dash-widget-header invoices-number-cards-flex-top">
                            <span className="inovices-widget-icon bg-primary-light">
                                <img src={TransactionMinus} alt="pic" />
                            </span>
                            <div className="dash-count invoices-number-cards-flex-top-count">
                                <div className="dash-title invoices-number-main-parent-cart-title">Total Outstanding</div>
                                <div className="dash-counts">
                                    <p>{totalOutstandingAmount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center invoices-number-cards-flex-bottom">
                            <p className="inovices-all invoices-number-main-parent-cart-bottom-title">
                                No of Invoice{" "}
                                <span className="rounded-circle bg-light-gray">{outStandingLength}</span>
                            </p>
                        </div>
                    </div>
                </div> */}
                </div>
            </div>

        </>
    )
}

export default NumberCardsSales