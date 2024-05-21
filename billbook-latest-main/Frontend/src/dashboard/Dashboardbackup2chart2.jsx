import React, { useEffect, useState } from "react";
import "./Dashboardbackup2.css";
import useGetApis from "../ApiHooks/useGetApi";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../_components/paginationfunction";
import { CiBank } from "react-icons/ci";

const Dashboardbackup2chart2 = () => {
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const { getApiData } = useGetApis();
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        let data = await getApiData({
          endpoint: `/api/paymentDetails/payment`,
        });
        setDataSource(data);
        setTotalPages(data?.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSalesData();
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "paymentDate",
      render: (text, record) => {
        const formattedDate = new Date(record.paymentDate).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Vocher Name",
      dataIndex: "voucherName",
    },
    {
      title: "Payment Number",
      dataIndex: "paymentNumber",
    },

    {
      title: "Customer Name",
      dataIndex: "customername",
      render: (text, record) => <div>{text?.name}</div>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
  ];

  //   const formatCount = (count) => {
  //     return count === 2500 ? '2500+' : count;
  // };

  return (
    <>
      <div className="row">
        <div className="Dashboardbackup2chart2-parent col-sm-7">
          <div className="Dashboardbackup2chart2-parent-title border-b-2 border-gray-9">
            <h4 className="text-base ">Latest Transactions</h4>
          </div>
          {/* 
          <hr /> */}
          <div className="Dashboardbackup2chart2-sub2">
            <div className="row">
              <div className="col-sm-12">
                <div className=" card-table">
                  <div className="card-body vendors">
                    <div className="table-responsive table-hover table-striped">
                      <Table
                        pagination={{
                          pageSize: 4,
                          total: totalPages,
                          onChange: (page) => {
                            fetchData(page);
                          },

                          // showTotal: (total, range) =>
                          //   `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          // showSizeChanger: true,
                          // onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        // dataSource={customers}
                        dataSource={dataSource}
                        loading={loading}
                        columns={columns}
                        rowKey={(record) => record.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-sm-4 col-md-5">
          <div className="Dashboardbackup2-sub2-subparent">
            <div className="Dashboardbackup2-sub2-subparent-sub1">
              {/* <div className="Dashboardbackup2-sub2-subparent-image">
                <img src="/images/arrowimage.png" alt="" />
              </div> */}
              <CiBank />
              <p>Total Cash+Bank Balance</p>
            </div>
            <div className="Dashboardbackup2-sub2-subparent-sub2">
              {/* <p>{formatCount(totalRevenue)}</p> */}
              <p>1000000</p>
            </div>
          </div>

          <div className="col-6 col-sm-4 col-md-12 range-bar-charts-parent">
            <div className="dashboard-outdoor-creative-design ">
              <div className="card">
                <div className="card-body row">
                  <div className="cord-body-div1 col-md-2">
                    <div className="dashboard-outdoor-creative-design-image">
                      <img src="/dashboardwritten.png" alt="" />
                    </div>
                  </div>
                  <div className="cord-body-div2 col-md-7">
                    <h2>Creative Outdoor Adds</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Iste, doloremque distinctio minus
                    </p>
                  </div>
                  <div className="cord-body-div3 col-md-3">
                    <button>See More</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboardbackup2chart2;
