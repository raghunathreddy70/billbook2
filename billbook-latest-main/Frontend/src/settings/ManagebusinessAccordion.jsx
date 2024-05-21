import React from 'react'
import { Collapse } from 'antd';
const { Panel } = Collapse;
const ManagebusinessAccordion = () => {
    return (
        <div>
            <Collapse accordion>
                <Panel header="Sales Invoice #1" key="1" className='managebusiness-accordion'>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                            <div className="form-group reminder-profile-settings-2row">
                                <div className="form-group reminder-profile-settings-2row-sub">
                                    <h6>Sales Invoice</h6>
                                    <p className='manage-business-e-invoicing-p'>Get reminded to collect payments on time</p>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>3 days before due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>On due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                            <div className="form-group reminder-profile-settings-2row">
                                <div className="form-group reminder-profile-settings-2row-sub">
                                    <h6>Sales Invoice</h6>
                                    <p className='manage-business-e-invoicing-p'>Get reminded to collect payments on time</p>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>3 days before due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>On due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
                <Panel header="Sales Invoice #2" key="2" className='managebusiness-accordion'>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                            <div className="form-group reminder-profile-settings-2row">
                                <div className="form-group reminder-profile-settings-2row-sub">
                                    <h6>Sales Invoice</h6>
                                    <p className='manage-business-e-invoicing-p'>Get reminded to collect payments on time</p>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>3 days before due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>On due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                            <div className="form-group reminder-profile-settings-2row">
                                <div className="form-group reminder-profile-settings-2row-sub">
                                    <h6>Sales Invoice</h6>
                                    <p className='manage-business-e-invoicing-p'>Get reminded to collect payments on time</p>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>3 days before due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>On due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                            <div className="form-group reminder-profile-settings-2row">
                                <div className="form-group reminder-profile-settings-2row-sub">
                                    <h6>Sales Invoice</h6>
                                    <p className='manage-business-e-invoicing-p'>Get reminded to collect payments on time</p>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>3 days before due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                    <div className='reminder-profile-settings-checkbox-parent'>
                                        <h6>On due date</h6>
                                        <input type="checkbox" name="" id="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </div>
    )
}

export default ManagebusinessAccordion;

