import React,{useState} from 'react'
// import { Button, Modal } from 'antd';
import { PiImageSquareThin } from "react-icons/pi";
import Select2 from 'react-select2-wrapper';
export const EditManageBusinessDetails = () => {
    const [open3, setOpen3] = useState(false);
    const [bgOptions, setbgOptions] = useState([
		{ id: 1, text: 'Retailer' },
		{ id: 2, text: 'Wholesaler' },
		{ id: 3, text: 'Distributor' },
		{ id: 4, text: 'Manufacturer' },
		{ id: 5, text: 'Services' }
	])
    const [brtOptions, setbrtOptions] = useState([
		{ id: 1, text: 'Public limited company' },
		{ id: 2, text: 'Partnership firm' },
		{ id: 3, text: 'One Person Company' },
		{ id: 4, text: 'Business not registered' },
		{ id: 5, text: 'Services' }
	])
  return (
    <div>
        

							<div className=''>
								<div className='manage-business-buttons-two'>
									<ul className="nav nav-tabs border-0">
										<li className="nav-item">
											<a
												className="nav-link active"
												href="#profiletab"
												data-bs-toggle="tab"
											>
												Custemer Details
											</a>
										</li>
										<li className="nav-item">
											<a
												className="nav-link"
												href="#basictab2"
												data-bs-toggle="tab"
											>
												Business Details
											</a>
										</li>
									</ul>
								</div>
								<div className="tab-content ">
									<div className="tab-pane show active" id="profiletab">
										<div className="row my-4">
											{/* <h5 className='editing-company-details-page-h5' ></h5> */}

											<div className="col-lg-3 col-md-12 col-sm-12">
												<div className="form-group">
													<label class="upload-image-manage-business">
														<input type="file" name="" id="" className='' />
														<span>
															{/* <i className="fe fe-check-square me-2" /> */}
															{/* <FeatherIcon icon="image" /> */}
															<PiImageSquareThin size={40} />
														</span>
														<div className='upload-image-manage-business-text'>
															<p className='upload-image-manage-business-p'>Upload Image</p>
														</div>
													</label>
												</div>
											</div>

											<div className="col-lg-8 col-md-6 col-sm-12">
												<div className="form-group">
													<label>Business Name</label>
													<input
														type="text"
														className="form-control"
														placeholder="Enter Name"
													/>
												</div>
											</div>
										</div>
										<div className='row'>
											<div className="col-lg-6 col-md-6 col-sm-12">
												<div className="form-group">
													<label>Company Phone Number</label>
													<input
														type="text"
														className="form-control"

														placeholder="Enter company phone number"
													/>
												</div>
											</div>
											<div className="col-lg-6 col-md-6 col-sm-12">
												<div className="form-group">
													<label>Company E-Mail</label>
													<input
														type="email"
														className="form-control"

														placeholder="Enter Email Address"
													/>
												</div>
											</div>
										</div>
										<div className="col-lg-12 col-md-6 col-sm-12">
											<div className="form-group">
												<label>Billing Address</label>
												<input
													type="text"
													className="form-control"
													placeholder="Enter billing address"
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-lg-6 col-md-6 col-sm-12">
												<div className="form-group">
													<label>State</label>
													<input
														type="text"
														className="form-control"
														placeholder="Enter state"
													/>
												</div>
											</div>
											<div className="col-lg-6 col-md-6 col-sm-12">
												<div className="form-group">
													<label>Pincode</label>
													<input
														type="text"
														className="form-control"
														placeholder="Enter pincode"
													/>
												</div>
											</div>
										</div>
										<div className="col-lg-12 col-md-6 col-sm-12">
											<div className="form-group">
												<label>City</label>
												<input
													type="text"
													className="form-control"
													placeholder="Enter city"
												/>
											</div>
										</div>
									</div>
									<div className="tab-pane" id="basictab2">
										<div className="row">
											<h5 className='editing-company-details-page-h5'></h5>
											<div className="col-lg-6 col-md-6 col-sm-12">
												<div className="form-group">
													<label>Business Type <span className='manage-business-e-invoicing-p'>(Select multiple, if applicable)</span></label>
													<Select2 className="w-100" data={bgOptions} options={{ placeholder: 'Choose your business type', }} />
												</div>
											</div>
											<div className="col-lg-6 col-md-6 col-sm-12">
												<div className="form-group">
													<label>Industry Type</label>
													<Select2 className="w-100" data={bgOptions} options={{ placeholder: 'Choose your industry type', }} />
												</div>
											</div>
											<div className="col-lg-6 col-md-6 col-sm-12">
												<div className="form-group">
													<label>Business Registration Type</label>
													<Select2 className="w-100" data={brtOptions} options={{ placeholder: 'Choose your business registration type', }} />
												</div>
											</div>

											<div className="col-lg-12 col-md-12 col-sm-12">
												<div className="manage-business-note">
													<h6>Note:&nbsp;</h6>
													<p>Details added below will be shown on your Invoices</p>
												</div>
											</div>
											<div className="col-lg-12 col-md-12 col-sm-12">
												<div className="form-group row">
													<label>Terms and Conditions</label>
													<textarea name="" id="" cols="70" rows="5">
														1. Goods once sold will not be taken back or exchanged
														2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only
													</textarea>
												</div>
											</div>

											<div className="col-12 col-xl mb-3">Signature</div>
											<div className="col-lg-12 col-md-12 col-sm-12">
												<div className="form-group">
													<label class="custom-file-upload">
														<input type="file" />
														+ Add Signature
													</label>
												</div>
											</div>


										</div>
									</div>
								</div>
							</div>
					
    </div>
  )
}
