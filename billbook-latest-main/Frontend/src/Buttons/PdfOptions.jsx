import React from 'react'
import { Link } from "react-router-dom";
const PdfOptions = () => {
    return (
        <>
            <div className="dropdown-menu dropdown-menu-end">
                <ul className="d-block">
                    <li>
                        <Link
                            className="d-flex align-items-center download-item"
                            to="#"
                            download=""
                            onClick={handlePDFDownload}
                        >
                            <i className="far fa-file-pdf me-2" />
                            PDF
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="d-flex align-items-center download-item"
                            to="#"
                            download=""
                            onClick={handleCSVDownload}
                        >
                            <i className="far fa-file-text me-2" />
                            CSV
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default PdfOptions