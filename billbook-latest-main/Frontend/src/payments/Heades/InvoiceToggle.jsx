import React from 'react'

const InvoiceToggle = ({ active, setActive }) => {
    return (
        <div className="card invoices-tabs-card">
            <div className="invoices-main-tabs pb-0 !border-b-2 border-[#e0e0e0]">
                <div className="row align-items-center">
                    <div className="col-lg-12">
                        <div className="invoices-tabs">
                            <ul>
                                <li className={` ${active === 0 && "active"} pb-[14px] cursor-pointer`} onClick={() => setActive(0)}>
                                    {/* <Link to="/invoice-list" className="active"> */}
                                    All Invoice
                                    {/* </Link> */}
                                </li>
                                { }
                                <li className={` ${active === 1 && "active"} pb-[14px] cursor-pointer`} onClick={() => setActive(1)}>
                                    {/* <Link to="/invoice-paid"> */}
                                    Paid
                                    {/* </Link> */}
                                </li>
                                <li className={` ${active === 2 && "active"} pb-[14px] cursor-pointer`} onClick={() => setActive(2)}>
                                    {/* <Link to="/invoice-outstanding"> */}
                                    Outstanding
                                    {/* </Link> */}
                                </li>
                                <li className={` ${active === 3 && "active"} pb-[14px] cursor-pointer`} onClick={() => setActive(3)}>
                                    {/* <Link to="/invoice-overdue"> */}
                                    Overdue
                                    {/* </Link> */}
                                </li>
                                {/* <li className={` ${active === 4 && "active"} pb-[14px] cursor-pointer`}>
                            <Link to="/invoice-draft">Draft</Link>
                        </li>
                        <li className={` ${active === 5 && "active"} pb-[14px]`}>
                            <Link to="/invoice-recurring">Recurring</Link>
                        </li>
                        <li className={` ${active === 6 && "active"} pb-[14px]`}>
                            <Link to="/invoice-cancelled">Cancelled</Link>
                        </li> */}
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceToggle