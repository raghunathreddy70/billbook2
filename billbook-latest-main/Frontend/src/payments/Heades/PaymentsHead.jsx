import React, { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import {
    Recepit,
    ArchiveBook,
    Clipboard,
} from "../../_components/imagepath";
import useGetApis from "../../ApiHooks/useGetApi";

const PaymentsHead = ({ setActive, active }) => {
    const { fetchInvoices, fetchPurchases, fetchExpenses } = useGetApis();

    const [totalValues, setTotalValues] = useState({
        invoicesGrandTotal: 0,
        invoicesLength: 0,
        purchsesGrandTotal: 0,
        purchasesLength: 0,
        expensesGrandTotal: 0,
        expensesLength: 0
    })


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                let { invoicesGrandTotal, invoicesLength } = await fetchInvoices();
                let { purchsesGrandTotal, purchasesLength } = await fetchPurchases();
                let { expensesGrandTotal, expensesLength } = await fetchExpenses();
                setTotalValues({ ...totalValues, invoicesGrandTotal, invoicesLength, purchsesGrandTotal, purchasesLength, expensesGrandTotal, expensesLength })
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchDetails();

    }, []);




    return (
        <>

            {/* /Page Header */}
            {/* Search Filter */}
            <div id="filter_inputs" className="card filter-card">
                <div className="card-body pb-0">
                    <div className="row">
                        <div className="col-sm-6 col-md-3">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-3">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-3">
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Search Filter */}
            {/* Inovices card */}
            <div className="row invoices-number-main-parent">
                <div className={`col-xl-4 col-lg-4 col-sm-6 col-5 d-flex cursor-pointer ${active === 0 && "transition-transform duration-75 scale-105"}`} onClick={() => setActive(0)}>
                    <div className="card inovices-card w-100 invoices-number-cards-body-y-align">
                        <div className={`card-body invoices-number-cards-body`}>
                            <div className="dash-widget-header invoices-number-cards-flex-top">
                                <span className="inovices-widget-icon bg-info-light">
                                    <img src={Recepit} alt="pic" />
                                </span>
                                <div className="dash-count invoices-number-cards-flex-top-count">
                                    <div className="dash-title  invoices-number-main-parent-cart-title">Sales Invoices</div>
                                    <div className="dash-counts">
                                        <p>{totalValues?.invoicesGrandTotal}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center invoices-number-cards-flex-bottom">
                                <p className="inovices-all invoices-number-main-parent-cart-bottom-title">
                                    No of Invoice{" "}
                                    <span className="rounded-circle bg-light-gray">{totalValues?.invoicesLength}</span>
                                </p>
                                <p className="inovice-trending text-success-light invoices-number-cards-flex-range">
                                    02{" "}
                                    <span className="ms-2">
                                        <FeatherIcon icon="trending-up" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`col-xl-4 col-lg-4 col-sm-6 col-5 d-flex cursor-pointer ${active === 1 && "transition-transform duration-75 scale-105"}`} onClick={() => setActive(1)}>
                    <div className="card inovices-card w-100 invoices-number-cards-body-y-align">
                        <div className="card-body invoices-number-cards-body">
                            <div className="dash-widget-header invoices-number-cards-flex-top">
                                <span className="inovices-widget-icon bg-warning-light">
                                    <img src={ArchiveBook} alt="pic" />
                                </span>
                                <div className="dash-count invoices-number-cards-flex-top-count">
                                    <div className="dash-title invoices-number-main-parent-cart-title">Purchases Invoices</div>
                                    <div className="dash-counts">
                                        <p>{totalValues?.purchsesGrandTotal}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center invoices-number-cards-flex-bottom">
                                <p className="inovices-all invoices-number-main-parent-cart-bottom-title">
                                    No of Invoice{" "}
                                    <span className="rounded-circle bg-light-gray">{totalValues?.purchasesLength}</span>
                                </p>
                                <p className="inovice-trending text-success-light invoices-number-cards-flex-range">
                                    03{" "}
                                    <span className="ms-2">
                                        <FeatherIcon icon="trending-down" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`col-xl-4 col-lg-4 col-sm-6 col-5 d-flex cursor-pointer ${active === 2 && "transition-transform duration-75 scale-105"}`} onClick={() => setActive(2)}>
                    <div className="card inovices-card w-100 invoices-number-cards-body-y-align">
                        <div className="card-body invoices-number-cards-body">
                            <div className="dash-widget-header invoices-number-cards-flex-top">
                                <span className="inovices-widget-icon bg-primary-light">
                                    <img src={Clipboard} alt="pic" />
                                </span>
                                <div className="dash-count invoices-number-cards-flex-top-count">
                                    <div className="dash-title invoices-number-main-parent-cart-title">Expenses</div>
                                    <div className="dash-counts">
                                        <p>{totalValues?.expensesGrandTotal}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center invoices-number-cards-flex-bottom">
                                <p className="inovices-all invoices-number-main-parent-cart-bottom-title">
                                    No of Invoice{" "}
                                    <span className="rounded-circle bg-light-gray">{totalValues?.expensesLength}</span>
                                </p>
                                <p className="inovice-trending text-success-light invoices-number-cards-flex-range">
                                    05{" "}
                                    <span className="ms-2">
                                        <FeatherIcon icon="trending-down" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex">
                    <div className="card inovices-card w-100">
                        <div className="card-body">
                            <div className="dash-widget-header">
                                <span className="inovices-widget-icon bg-primary-light">
                                    <img src={TransactionMinus} alt="" />
                                </span>
                                <div className="dash-count">
                                    <div className="dash-title">Total Outstanding</div>
                                    <div className="dash-counts">
                                        <p>{totalOutstandingAmount.totalOutstandingAmount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="inovices-all">
                                    No of Invoice{" "}
                                    <span className="rounded-circle bg-light-gray">{totalOutstandingAmount.length}</span>
                                </p>
                                <p className="inovice-trending text-success-light">
                                    04{" "}
                                    <span className="ms-2">
                                        <FeatherIcon icon="trending-up" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex">
                    <div className="card inovices-card w-100">
                        <div className="card-body">
                            <div className="dash-widget-header">
                                <span className="inovices-widget-icon bg-green-light">
                                    <img src={MessageEdit} alt="" />
                                </span>
                                <div className="dash-count">
                                    <div className="dash-title">Draft</div>
                                    <div className="dash-counts">
                                        <p>$125,586</p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="inovices-all">
                                    No of Invoice{" "}
                                    <span className="rounded-circle bg-light-gray">06</span>
                                </p>
                                <p className="inovice-trending text-danger-light">
                                    02{" "}
                                    <span className="ms-2">
                                        <FeatherIcon icon="trending-down" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex">
                    <div className="card inovices-card w-100">
                        <div className="card-body">
                            <div className="dash-widget-header">
                                <span className="inovices-widget-icon bg-danger-light">
                                    <img src={Rotate} alt="" />
                                </span>
                                <div className="dash-count">
                                    <div className="dash-title">Recurring</div>
                                    <div className="dash-counts">
                                        <p>$86,892</p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="inovices-all">
                                    No of Invoice{" "}
                                    <span className="rounded-circle bg-light-gray">03</span>
                                </p>
                                <p className="inovice-trending text-success-light">
                                    02{" "}
                                    <span className="ms-2">
                                        <FeatherIcon icon="trending-up" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            {/* /Inovices card */}
            {/* All Invoice */}
        </>
    );
}

export default PaymentsHead