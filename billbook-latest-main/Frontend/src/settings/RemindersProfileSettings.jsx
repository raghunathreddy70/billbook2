import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { img2 } from "../_components/imagepath"
import SettingSidebar from '../layouts/SettingsSidebar'
import FeatherIcon from 'feather-icons-react';
import { BiSolidKeyboard } from "react-icons/bi";
import ManagebusinessAccordion from './ManagebusinessAccordion';

const RemindersProfileSettings = () => {

	const [menu, setMenu] = useState(false)

	const toggleMobileMenu = () => {
		setMenu(!menu)
	}

	const formHandler = (e) => {
		console.log(e);
	}
	return (
		<div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>
			<div className="page-wrapper">
				<div className="content container-fluid">
					<div className="page-header">
						<div className="content-page-header accountprofilesettings-page-header">
							<div className="">
								<h6 className='reminder-settings-heading'>Reminder Settings</h6>
								<p>Select Which Reminders Are Sent To You And Your Parties</p>
							</div>
							{/* <div className="">
								<ul className="icons-list accountprofilesettings-ul-flex-buttons">
									<li>
										<i
											className="fa fa-address-card"
											data-bs-toggle="tooltip"
											title="fa fa-address-card"
										/>
									</li>
									<button type="button" className="btn accountprofilesettings-button-top btn-info me-1">
										Chat Support
									</button>
									<button type="button" className="btn accountprofilesettings-button-top btn-secondary me-1">
										Cancel
									</button>
									<button type="button" className="btn accountprofilesettings-button-top btn-primary me-1">
										Save Changes
									</button>
								</ul>
							</div> */}
							<div className="list-btn">
								<ul className="filter-list">
									<li>
										<Link className="btn btn-import" to="#" style={{ backgroundColor: 'transparent', color: 'black', border: 'none' }}>
											<span>
												{/* <i className="fe fe-check-square me-2" /> */}
												{/* <FeatherIcon icon="check-square" /> */}
												<BiSolidKeyboard size={23} />
											</span>
										</Link>
									</li>
									<li>
										<Link className="btn btn-import" to="#" style={{ backgroundColor: 'white', color: 'black' }}>
											Cancel
										</Link>
									</li>
									<li>
										<Link className="btn btn-import" to="#" style={{ backgroundColor: '#cac5f0', color: 'white' }}>
											Save Changes
										</Link>
									</li>
								</ul>
							</div>

						</div>
					</div>
					<div className='ReminderProfileSettings-parent'>
						<div className="row">
							<div className="col-md-12">
								<div className="row">
									<div className="col-lg-6 col-md-6 col-sm-6 mb-4">
										<div className="form-group manage-business-e-invoicing">
											<div className="">
												<h6 className='SendbillingSMS'>Send billing SMS to Party</h6>
												<p className='manage-business-e-invoicing-p'>Send SMS to your Party on creating any transaction</p>
											</div>
											<span>
												<label class="switch">
													<input type="checkbox" />
													<span class="slider round"></span>
												</label>
											</span>
										</div>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 mb-4">
										<div className="form-group manage-business-e-invoicing">
											<div className="">
												<h6 className='SendbillingSMS'>Get payment reminders on WhatsApp</h6>
												<p className='manage-business-e-invoicing-p'>Get WhatsApp alerts when you have to collect payment from customers</p>
											</div>
											<span>
												<label class="switch">
													<input type="checkbox" />
													<span class="slider round"></span>
												</label>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<ManagebusinessAccordion />
					</div>
				</div>
			</div>
		</div>
	);

}
export default RemindersProfileSettings;