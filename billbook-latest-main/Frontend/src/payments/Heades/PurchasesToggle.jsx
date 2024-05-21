import React from 'react';
import { Link } from "react-router-dom";

const PurchasesToggle = ({ active, setActive }) => {
    return (
        <div className="card invoices-tabs-card">
            <div className="invoices-main-tabs pb-0 !border-b-2 border-[#e0e0e0]">
                <div className="row align-items-center">
                    <div className="col-lg-12">
                        <div className="invoices-tabs">
                            <ul>
                                <li className={` ${active === 0 && "active"} pb-[14px] cursor-pointer`} onClick={() => setActive(0)}>
                                    {/* <Link to="/all-purchases" className="active"> */}
                                    All Purchases
                                    {/* </Link> */}
                                </li>
                                <li className={` ${active === 1 && "active"} pb-[14px] cursor-pointer`} onClick={() => setActive(1)}>
                                    {/* <Link to="/paid-purchases"> */}
                                    Paid
                                    {/* </Link> */}
                                </li>
                                <li className={` ${active === 2 && "active"} pb-[14px] cursor-pointer`} onClick={() => setActive(2)}>
                                    {/* <Link to="/overdue-purchases"> */}
                                    Overdue
                                    {/* </Link> */}
                                </li>
                                <li className={` ${active === 3 && "active"} pb-[14px] cursor-pointer`} onClick={() => setActive(3)}>
                                    {/* <Link to="/outstanding-purchases"> */}
                                    Outstanding
                                    {/* </Link> */}
                                </li>
                                {/* <li>
                                    <Link to="/draft-purchases">Draft</Link>
                                </li>
                                <li>
                                    <Link to="/recurring-purchases">Recurring</Link>
                                </li>
                                <li>
                                    <Link to="/cancelled-purchases">Cancelled</Link>
                                </li>
                                <li>
                                    <Link to="/deleted-purchases">Deleted</Link>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchasesToggle