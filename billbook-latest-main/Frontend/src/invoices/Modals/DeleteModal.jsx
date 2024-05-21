import React from 'react'

const DeleteModal = ({ title, deleteFunction }) => {
    return (
        <div className="modal custom-modal fade" id="delete_modal_Comp" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="form-header">
                            <h3>{title}</h3>
                            <p>Are you sure want to delete?</p>
                        </div>
                        <div className="modal-btn delete-action">
                            <div className="row">
                                <div className="col-6">
                                    <button type="reset" onClick={deleteFunction} data-bs-dismiss="modal" className="w-100 btn btn-primary paid-continue-btn">
                                        Delete
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button type="submit" data-bs-dismiss="modal" className="w-100 btn btn-primary paid-continue-btn">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal