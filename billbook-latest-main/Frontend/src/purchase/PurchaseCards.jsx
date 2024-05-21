import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import React from 'react'
import { MdArrowOutward } from 'react-icons/md'
import { FaRegFileAlt } from 'react-icons/fa'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoCart } from 'react-icons/io5'

const PurchaseCards = ({ invoiceGrandTotal, allInvoicelength, totalPaidAmount, paidAmountLength, totalOutstandingAmount, outStandingLength, purLength, totalPurAmount }) => {
    return (
        <>
            <div className="row invoices-number-main-parent my-4">
                
                
                <div className="col-xl-3 col-lg-3 col-sm-6 col-5 d-flex">
                    <div className='SalesInvoice-cards'>
                        <div className='SalesInvoice-cards-sub'>
                            <p>Total Purchases</p>
                            <h2> {purLength}</h2>
                        </div>
                        <div className='SalesInvoice-cards-img' style={{ background: '#2D3748' }}>
                            <FaRegFileAlt />
                        </div>
                    </div>
                    
                </div>
                <div className="col-xl-3 col-lg-3 col-sm-6 col-5 d-flex">
                    <div className='SalesInvoice-cards'>
                        <div className='SalesInvoice-cards-sub'>
                            <p>Total Purchases Amount</p>
                            <h2>INR {totalPurAmount}</h2>
                        </div>
                        <div className='SalesInvoice-cards-img' style={{ background: '#2D3748' }}>
                        <IoCart />
                        </div>
                    </div>
                    
                </div>
            </div>

        </>
    )
}

export default PurchaseCards