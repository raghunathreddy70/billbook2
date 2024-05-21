import React from "react";
import { Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const CashandBankSwiper = ({ bankData, handleAccountClick }) => {
 console.log("handleAccountClick", handleAccountClick)
  return (
    <div className="gallery">
      <Swiper
        modules={[Pagination, Scrollbar, A11y]}
        loop={true}
        centeredSlides={true}
        speed={400}
        slidesPerView={1}
        spaceBetween={0}
        pagination={{ clickable: true }}
        slidesPerGroup={1}
        className="atmcards-image"
        style={{
          backgroundImage: `url(./newdashboard/cashandbankcards.png)`,
          height: "270px",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        {bankData &&
          bankData.length > 0 &&
          bankData.map((account, index) => (
            <SwiperSlide key={index}>
              <li
                key={index}
                onClick={() => handleAccountClick(account, index)}
              >
                <div className="atm-cards-details">
                  <h5>{account.branchName}</h5>
                  <div className="account-number">
                    <h6>Acc Num</h6>
                    <h3>{account.bankAccountNumber}</h3>
                  </div>
                  <p>{account.accountHoldersName}</p>
                </div>
              </li>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* <SwiperSlide>
                    <div className="atm-cards-details">
                        <h5>AXIS BANK</h5>
                        <div className="account-number">
                            <h6>Acc Num</h6>
                            <h3>5760 ***********23</h3>
                        </div>
                        <p>Hirola Infotech Solutions Pvt Ltd</p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="atm-cards-details">
                        <h5>HDFC BANK</h5>
                        <div className="account-number">
                            <h6>Acc Num</h6>
                            <h3>1234 ***********56</h3>
                        </div>
                        <p>Hirola Infotech Solutions Pvt Ltd</p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="atm-cards-details">
                        <h5>ICICI BANK</h5>
                        <div className="account-number">
                            <h6>Acc Num</h6>
                            <h3>7890 ***********12</h3>
                        </div>
                        <p>Hirola Infotech Solutions Pvt Ltd</p>
                    </div>
                </SwiperSlide> */}
      {/* </Swiper> */}
    </div>
  );
};

export default CashandBankSwiper;
