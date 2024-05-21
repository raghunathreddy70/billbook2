import React from 'react'
import { Modal } from "antd";
import Select2 from "react-select2-wrapper";


const SelectGowdown = ({ isAnotherModalVisible, handleAnotherModalCancel, handleAnotherModalOk, GodownList, GodownOptions, selectedGodown, handleSelectGodown }) => {
    return (
        <Modal className="select-godown"
            title="Select Godown"
            open={isAnotherModalVisible}
            onCancel={handleAnotherModalCancel}
            onOk={handleAnotherModalOk}
            // footer={[
            //   <Button key="back" className="btn btn-secondary waves-effect me-2" onClick={handleAnotherModalCancel}>
            //     Cancel
            //   </Button>,
            //   <Button
            //     key="submit"
            //     type="primary"
            //     className="btn btn-info waves-effect waves-light"
            //     onClick={() => handleProductSelect(selectedProductModal)}
            //   >
            //     Select
            //   </Button>,
            // ]}
            footer={null}
        >
            <div className="my-3">
                {GodownList.length > 0 ?
                    <>
                        {GodownList && GodownList.length > 0 &&
                            <Select2
                                className="w-100"
                                data={GodownOptions}
                                value={selectedGodown}
                                options={{ placeholder: "Select godown" }}
                                onChange={(e) => handleSelectGodown(e.target.value)}
                            />
                        }
                    </> :
                    <>
                        No Godown data? Click on Okay to continue
                    </>
                }
            </div>

        </Modal>
    )
}

export default SelectGowdown