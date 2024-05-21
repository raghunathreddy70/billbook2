import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { backendUrl } from "../backendUrl";
import { useSelector } from "react-redux";
import axios from "axios";

const DashboardTransactions = () => {
  const [open, setopen] = useState(false);
  const toggleDropdown = () => {
    setopen(!open);
  };

  const userData = useSelector((state) => state?.user?.userData);

  const [activities, setActivities] = useState([]);

  const fetchRecentActivities = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `http://localhost:8000/api/addInvoice/recentActivities/${userData?.data?._id}`
        );
        setActivities(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, [userData]);

  const [paymentDetails, setPaymentDetails] = useState([]);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (userData?.data?._id) {
          const response = await axios.get(
            `http://localhost:8000/api/paymentDetails/payment/${userData?.data?._id}`
          );
          setPaymentDetails(response.data.filter((item) => !item.isDeleted));
        }
      } catch (error) {
        console.error("Error fetching Payment details:", error);
      }
    };

    fetchPaymentDetails();
  }, [userData]);

  const [bankData, setBankData] = useState([]);

  const fetchData = async () => {
    try {
      if (userData?.data?._id) {
        const response = await axios.get(
          `${backendUrl}/api/BankDeatils/bank-details/${userData?.data?._id}`
        );
        console.log("Data:", response.data);
        setBankData(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData]);

  let totalAmount = 0;
  paymentDetails.forEach((payment) => {
    totalAmount += payment.amount;
  });

  const bankAmount = bankData?.reduce(
    (total, item) => total + item.openingBalance,
    0
  );

  const allAmount = parseFloat(totalAmount) + bankAmount;
  console.log("allAmount", allAmount);

  return (
    <>
      <div className="DashboardTransactions-parent">
        <div className="row">
          <div className="col-md-8">
            <div className="DashboardTransactionsTable">
              <div className="table-title-section">
                <div className="Table-title">
                  <h2>Recent Transactions</h2>
                  <BsCheckCircleFill />
                </div>
                <div className="download-options">
                  {/* Dropdown-style options */}
                  <div className="table-menu-icon" onClick={toggleDropdown}>
                    <img src="./newdashboard/downloadmenu.png" alt="" />
                    {open && (
                      <div className="dropdown-content">
                        <li>
                          <i className="far fa-file-pdf me-2"></i>PDF
                        </li>
                        <li>
                          <i className="far fa-file-text me-2"></i>CSV
                        </li>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Party Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <tr key={index}>
                        <td>{activity.partyName}</td>
                        <td>
                          {new Date(activity.date).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })}
                        </td>
                        <td>{activity.Amount}</td>
                        <td>{activity.type}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-4">
            <div className="Cash-Bank-Balance">
              <div className="ash-Bank-Balance-sub1">
                <h2>Cash & Bank Balance</h2>
                <h3>INR {allAmount}</h3>
              </div>
              <div className="ash-Bank-Balance-sub2">
                <img src="./newdashboard/Revenue.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="copyrights">
          <p>
            @ 2024 - 2025, Made with ❤️ by{" "}
            <span>
              {" "}
              <Link to="https://www.hirolainfotech.com/">
                Hirola Infotech Solutions Pvt Ltd{" "}
              </Link>{" "}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardTransactions;
