import { Modal } from 'antd';
import React from 'react';
import Select2 from "react-select2-wrapper";

const SelectBank = ({ bankoptions, formData, handleAccountChange, visible, onCancel }) => {

    console.log("formDra", formData)
    return (
        <>
            <Modal
                visible={visible}
                onCancel={onCancel}
                className="add-bank-account-header-line"
                title="Add Bank Details "
                footer={null}
            >
                <div>
                    <div>
                        <label htmlFor="accountSelect">Choose Account:</label>
                        <Select2
                            data={bankoptions}
                            options={{
                                placeholder: "Choose Bank",
                            }}
                            value={formData?.bankDetails?.selectBank}
                            onChange={handleAccountChange}
                        />
                    </div>
                </div>
            </Modal>
           
        </>
    )
}

export default SelectBank