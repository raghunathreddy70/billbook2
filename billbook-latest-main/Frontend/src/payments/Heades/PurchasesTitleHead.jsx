import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import React from 'react';
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";

const PurchasesTitleHead = ({ isEnabled, handleCheckboxChange, currencyOptions }) => {

    return (
        <div className="page-header">
            <div className="content-page-header">
                <h5>Purchase Invoice</h5>
                <div className="row">
                    <div className="list-btn">
                        <ul className="filter-list">
                            <li>
                                <Link className="btn btn-filters w-auto popup-toggle me-2" to='#' data-bs-toggle="modal" data-bs-target="#con-close-modal" >
                                    <FeatherIcon icon="settings" />
                                </Link>
                            </li>
                            <div
                                id="con-close-modal"
                                className="modal fade"
                                tabIndex={-1}
                                role="dialog"
                                aria-hidden="true"
                                style={{ display: "none" }}
                            >
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h4 className="modal-title">Quick Payment In Settings</h4>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            />
                                        </div>
                                        <div className="modal-body p-4">
                                            <div className="row">
                                                <div className="col-lg-12 col-md-6 col-sm-12">
                                                    <div className="form-group manage-business-enable-tds">
                                                        <p>Payment In Prefix & Sequence Number</p>
                                                        <span>
                                                            <label className="switch">
                                                                <input type="checkbox" checked={isEnabled} onChange={handleCheckboxChange} />
                                                                <span className="slider round"></span>
                                                            </label>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {isEnabled && (
                                                <div>
                                                    <div className="row">
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="form-group">
                                                                <label>Prefix</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Prefix"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                                            <div className="form-group">
                                                                <label>Sequence Number</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Sequence No"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group">
                                                            <p>Payment In Number:&nbsp;</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary waves-effect me-2"
                                                data-bs-dismiss="modal"
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-info waves-effect waves-light"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <li>
                                <Link className="btn btn-filters w-auto popup-toggle me-2" to='/add-purchases'>
                                    Create Purchase Invoice
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="form-group">
                        <Select2
                            className="w-100"
                            data={currencyOptions}
                            options={{
                                placeholder: "Last 365 Days",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchasesTitleHead