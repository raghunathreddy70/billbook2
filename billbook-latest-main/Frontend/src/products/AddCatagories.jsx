import React from 'react'

export const AddCatagories = () => {
  return (
    <div>
        <div className="row">
            <div className="col-md-12">
              <div className="">
                <div className="form-group-item border-0 pb-0 mb-0">
                  <div className="row">
                    <div className="col-lg-12 col-sm-12">
                      <div className="form-group">
                        <label>
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${!validation.categoryName.isValid ? "is-invalid" : ""}`}
                          placeholder="Enter Title"
                          value={formData.categoryName}
                          onChange={(e) => changeHandle('categoryName', e.target.value)}
                        />
                        {!validation.categoryName.isValid && <div className="error-message text-danger">{validation.categoryName.message}</div>}

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}
