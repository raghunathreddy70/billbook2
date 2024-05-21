import React, { useState } from "react";
import AllInvoices from "../SalesToggleComponents.jsx/AllInvoices";
import PaidInvoices from "../SalesToggleComponents.jsx/PaidInvoices";
import OutStanding from "../SalesToggleComponents.jsx/OutStanding";
import OverDue from "../SalesToggleComponents.jsx/OverDue";
import InvoiceList from "../../invoices/invoiceList";

const SalesPayments = () => {

    const [active, setActive] = useState(0);

    return (
        <div className="w-full">
            <InvoiceList active={true} />
            {/* {active === 0 && <AllInvoices active={active} setActive={setActive} />}
            {active === 1 && <PaidInvoices active={active} setActive={setActive} />}
            {active === 2 && <OutStanding active={active} setActive={setActive} />}
            {active === 3 && <OverDue active={active} setActive={setActive} />} */}
            {/* <div
                className="modal custom-modal fade"
                id="delete_modal"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="form-header">
                                <h3>Delete Invoice</h3>
                                <p>Are you sure want to delete?</p>
                            </div>
                            <div className="modal-btn delete-action">
                                <div className="row">
                                    <div className="col-6">
                                        <button
                                            type="reset"
                                            data-bs-dismiss="modal"
                                            className="w-100 btn btn-primary paid-continue-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            type="submit"
                                            data-bs-dismiss="modal"
                                            className="w-100 btn btn-primary paid-cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default SalesPayments