import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layouts/Header'
import Sidebar from '../layouts/Sidebar'

const BasicTables = () => {

	const [menu, setMenu] = useState(false)

	const toggleMobileMenu = () => {
		setMenu(!menu)
	}

	return (

		<>
			<div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

				<Header onMenuClick={(value) => setMenu(!menu)} />
				<Sidebar />
				{/* Page wrapper */}
				<div className="page-wrapper">
					<div className="content container-fluid">

						{/* Page Header */}
						<div className="page-header">
							<div className="content-page-header">
								<h5>Basic Tables</h5>
							</div>
						</div>
						{/* /Page Header */}

						<div className="row">
							<div className="col-lg-6">
								<div className="card">
									<div className="card-header">
										<h4 className="card-title">Basic Table</h4>
									</div>
									<div className="card-body">
										<div className="table-responsive">
											<table className="table mb-0">
												<thead>
													<tr>
														<th>Firstname</th>
														<th>Lastname</th>
														<th>Email</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>John</td>
														<td>Doe</td>
														<td>john@example.com</td>
													</tr>
													<tr>
														<td>Mary</td>
														<td>Moe</td>
														<td>mary@example.com</td>
													</tr>
													<tr>
														<td>July</td>
														<td>Dooley</td>
														<td>july@example.com</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-6">
								<div className="card">
									<div className="card-header">
										<h5 className="card-title">Striped Rows</h5>
									</div>
									<div className="card-body">
										<div className="table-responsive">
											<table className="table table-striped mb-0">
												<thead>
													<tr>
														<th>Firstname</th>
														<th>Lastname</th>
														<th>Email</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>John</td>
														<td>Doe</td>
														<td>john@example.com</td>
													</tr>
													<tr>
														<td>Mary</td>
														<td>Moe</td>
														<td>mary@example.com</td>
													</tr>
													<tr>
														<td>July</td>
														<td>Dooley</td>
														<td>july@example.com</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6">
								<div className="card">
									<div className="card-header">
										<h5 className="card-title">Bordered Table</h5>
									</div>
									<div className="card-body">
										<div className="table-responsive">
											<table className="table table-bordered mb-0">
												<thead>
													<tr>
														<th>Firstname</th>
														<th>Lastname</th>
														<th>Email</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>John</td>
														<td>Doe</td>
														<td>john@example.com</td>
													</tr>
													<tr>
														<td>Mary</td>
														<td>Moe</td>
														<td>mary@example.com</td>
													</tr>
													<tr>
														<td>July</td>
														<td>Dooley</td>
														<td>july@example.com</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-6">
								<div className="card">
									<div className="card-header">
										<h5 className="card-title">Hover Rows</h5>
									</div>
									<div className="card-body">
										<div className="table-responsive">
											<table className="table table-hover mb-0">
												<thead>
													<tr>
														<th>Firstname</th>
														<th>Lastname</th>
														<th>Email</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>John</td>
														<td>Doe</td>
														<td>john@example.com</td>
													</tr>
													<tr>
														<td>Mary</td>
														<td>Moe</td>
														<td>mary@example.com</td>
													</tr>
													<tr>
														<td>July</td>
														<td>Dooley</td>
														<td>july@example.com</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6">
								<div className="card">
									<div className="card-header">
										<h5 className="card-title">Contextual classNamees</h5>
									</div>
									<div className="card-body">
										<div className="table-responsive">
											<table className="table mb-0">
												<thead>
													<tr>
														<th>Firstname</th>
														<th>Lastname</th>
														<th>Email</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>Default</td>
														<td>Defaultson</td>
														<td>def@somemail.com</td>
													</tr>
													<tr className="table-primary">
														<td>Primary</td>
														<td>Doe</td>
														<td>john@example.com</td>
													</tr>
													<tr className="table-secondary">
														<td>Secondary</td>
														<td>Moe</td>
														<td>mary@example.com</td>
													</tr>
													<tr className="table-success">
														<td>Success</td>
														<td>Dooley</td>
														<td>july@example.com</td>
													</tr>
													<tr className="table-danger">
														<td>Danger</td>
														<td>Refs</td>
														<td>bo@example.com</td>
													</tr>
													<tr className="table-warning">
														<td>Warning</td>
														<td>Activeson</td>
														<td>act@example.com</td>
													</tr>
													<tr className="table-info">
														<td>Info</td>
														<td>Activeson</td>
														<td>act@example.com</td>
													</tr>
													<tr className="table-light">
														<td>Light</td>
														<td>Activeson</td>
														<td>act@example.com</td>
													</tr>
													<tr className="table-dark">
														<td>Dark</td>
														<td>Activeson</td>
														<td>act@example.com</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-6">
								<div className="card">
									<div className="card-header">
										<h5 className="card-title">Responsive Tables</h5>
									</div>
									<div className="card-body">
										<div className="table-responsive">
											<table className="table table-nowrap mb-0">
												<thead>
													<tr>
														<th>#</th>
														<th>Firstname</th>
														<th>Lastname</th>
														<th>Age</th>
														<th>City</th>
														<th>Country</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>1</td>
														<td>Anna</td>
														<td>Pitt</td>
														<td>35</td>
														<td>New York</td>
														<td>USA</td>
													</tr>
													<tr>
														<td>1</td>
														<td>Anna</td>
														<td>Pitt</td>
														<td>35</td>
														<td>New York</td>
														<td>USA</td>
													</tr>
													<tr>
														<td>1</td>
														<td>Anna</td>
														<td>Pitt</td>
														<td>35</td>
														<td>New York</td>
														<td>USA</td>
													</tr>
													<tr>
														<td>1</td>
														<td>Anna</td>
														<td>Pitt</td>
														<td>35</td>
														<td>New York</td>
														<td>USA</td>
													</tr>
													<tr>
														<td>1</td>
														<td>Anna</td>
														<td>Pitt</td>
														<td>35</td>
														<td>New York</td>
														<td>USA</td>
													</tr>
													<tr>
														<td>1</td>
														<td>Anna</td>
														<td>Pitt</td>
														<td>35</td>
														<td>New York</td>
														<td>USA</td>
													</tr>
													<tr>
														<td>1</td>
														<td>Anna</td>
														<td>Pitt</td>
														<td>35</td>
														<td>New York</td>
														<td>USA</td>
													</tr>
													<tr>
														<td>1</td>
														<td>Anna</td>
														<td>Pitt</td>
														<td>35</td>
														<td>New York</td>
														<td>USA</td>
													</tr>
													<tr>
														<td>1</td>
														<td>Anna</td>
														<td>Pitt</td>
														<td>35</td>
														<td>New York</td>
														<td>USA</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
				{/* /Page wrapper */}
			</div>
		</>

	);

}
export default BasicTables;