import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select2 from 'react-select2-wrapper';
import DatePicker from 'react-datepicker';
import Header from '../layouts/Header'
import Sidebar from '../layouts/Sidebar'

const AddEstimate = () => {

    const [menu, setMenu] = useState(false)

    const toggleMobileMenu = () => {
        setMenu(!menu)
    }
    const [date, setDate] = useState(new Date());
    const [options, setOptions] = useState([
        { id: 1, text: 'Select Customer' },
        { id: 2, text: 'Brian Johnson' },
        { id: 3, text: 'Marie Canales' },
        { id: 4, text: 'Barbara Moore' },
        { id: 5, text: 'Greg Lynch' },
        { id: 6, text: 'Karlene Chaidez' }
    ]);

    useEffect(() => {
        let elements = Array.from(document.getElementsByClassName('react-datepicker-wrapper'));
        elements.map(element => element.classList.add("width-100"))
    }, []);


    const handleChange = (date) => {
        setDate(date)
    }

    return (

        <>
            <div className={`main-wrapper ${menu ? 'slide-nav' : ''}`}>

                <Header onMenuClick={(value) => setMenu(!menu)} />
                <Sidebar />
                <div className="page-wrapper">
                    <div className="content container-fluid">

                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-12">
                                    <h3 className="page-title">Estimate</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to="/index">Dashboard</Link></li>
                                        <li className="breadcrumb-item"><Link to="/estimates">Estimate</Link></li>
                                        <li className="breadcrumb-item active">Add Estimate</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form action="#">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>Customer:</label>
                                                        <Select2
                                                            className="w-100"
                                                            data={options}
                                                            options={{
                                                                placeholder: 'Select Customer',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>From</label>
                                                        <div className="cal-icon">
                                                            <DatePicker
                                                                selected={date}
                                                                onChange={handleChange}
                                                                className="form-control datetimepicker"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label>To</label>
                                                        <div className="cal-icon">
                                                            <DatePicker
                                                                selected={date}
                                                                onChange={handleChange}
                                                                className="form-control datetimepicker"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mt-3">
                                                    <div className="form-group">
                                                        <label>Estimate Number</label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mt-3">
                                                    <div className="form-group">
                                                        <label>Ref Number</label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive mt-4">
                                                <table className="table table-stripped table-center table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Items</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Amount</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <input type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" disabled />
                                                            </td>
                                                            <td className="add-remove text-end">
                                                                <i className="fas fa-plus-circle"></i > <i className="fas fa-minus-circle"></i>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <input type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" disabled />
                                                            </td>
                                                            <td className="add-remove text-end">
                                                                <i className="fas fa-plus-circle"></i > <i className="fas fa-minus-circle"></i>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="table-responsive mt-4">
                                                <table className="table table-stripped table-center table-hover">
                                                    <thead></thead>
                                                    <tbody>
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td className="text-end">Sub Total</td>
                                                            <td className="text-end">0</td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td className="text-end">Discount</td>
                                                            <td className="text-end">0</td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td className="text-end">Total</td>
                                                            <td className="text-end">0</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="text-end mt-4">
                                                <button type="submit" className="btn btn-primary">Add Estimate</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AddEstimate;