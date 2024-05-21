import { Button, Input, Popconfirm, Radio } from 'antd'
import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

const SendEmail = ({ endpoint, defaultMail, modalRef }) => {
    const [active, setActive] = useState(1);
    const [customMail, setCusrtomMail] = useState('');
    const [isValid, setIsValid] = useState(true);

    const handleSubmit = async () => {
        let ver = validate({ data: active === 1 ? defaultMail : customMail });
        setIsValid(ver)
        if (ver) {
            try {
                let { data } = await axios.post(`http://localhost:8000/api/addInvoice/sendInvoiceTesting`, { mail: active === 1 ? defaultMail : customMail, endpoint })
                toast.success(data)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const validate = ({ data }) => {
        let valid = true;
        let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(data)) {
            valid = false
        }
        return valid
    }


    return (
            <div
            ref={modalRef}
                className="modal custom-modal fade"
                id="email_details"
                role="dialog"
                tabIndex="-1"
                aria-labelledby="emailDetailsLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content">
                        <div className="modal-header border-0 pb-0 flex justify-between">
                            <div className="form-header modal-header-title text-start mb-0">
                                <h4 className="mb-0">Share Invoice via Mail</h4>
                            </div>
                            <button
                                type="button"
                                className="close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <span className="align-center" aria-hidden="true">
                                    ×
                                </span>
                            </button>
                        </div>
                        <div className="modal-body email-modal-invoice">
                            <Radio.Group value={active} className='flex justify-between' onChange={(e) => setActive(e.target.value)}>
                                <Radio value={1}>Registered Mail</Radio>
                                <Radio value={2}>Custom Mail</Radio>
                            </Radio.Group>
                            <Input onChange={(e) => setCusrtomMail(e.target.value)} placeholder="Enter Mail" value={active === 1 ? defaultMail : customMail} className={`form-control  ${!isValid && "is-invalid"} my-[15px] hover:!border-[#d9d9d9] focus:!border-[#d9d9d9] focus:!shadow-none ${active === 1 && "cursor-not-allowed"} `} disabled={active === 1 ? true : false} />
                            {!isValid && (
                                <div className="error-message text-danger">
                                    please enter valid email address
                                </div>
                            )}
                            <div className='flex justify-end'>
                                <Popconfirm
                                    placement="left"
                                    title={"Confirm to send mail!"}
                                    okText="Send"
                                    cancelText="Cancel"
                                    onConfirm={handleSubmit}
                                >
                                    <Button className='border-[#674bee] text-[#674bee] opacity-100 hover:!bg-[#674bee] hover:!border-[#674bee] hover:!text-white'>
                                        Send Mail
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    )
}

export default SendEmail