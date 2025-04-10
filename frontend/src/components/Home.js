import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faChevronRight, faRightLeft, faUtensils, faHeadset } from "@fortawesome/free-solid-svg-icons";
import "../css/Home.css";
import "../css/Menu.css";

function Home() {
  const images = ["/img/bida.jpg", "/img/anh3.jpg"];
  const [imageIndex, setImageIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const changeImage = () => {
    setFade(true);
    setTimeout(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setFade(false);
    }, 200);
  };

  useEffect(() => {
    const interval = setInterval(changeImage, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="row home">
        <div className={`row col-12 image-container ${fade ? "image-fade" : "image-visible"}`}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.50)), url(${images[imageIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button className="change-image-btn" onClick={changeImage}>
            <FontAwesomeIcon className="icon" icon={faChevronRight} />
          </button>

          <div className="col col-6 introduce-home">
            <span>Làm cho quá trình đặt bàn của bạn trở nên dễ dàng hơn</span>
            <p>
              Website cung cấp thông tin chi tiết về bàn bida, tình trạng bàn
              cùng danh sách đồ ăn, thức uống có sẵn. Hệ thống tìm kiếm và bộ
              lọc giúp khách hàng dễ dàng chọn bàn theo loại bàn, giá thuê hoặc
              khu vực trong CLB, đồng thời lựa chọn món ăn và đồ uống phù hợp.
            </p>
            <Link to="/table">
              <button>Đặt bàn ngay</button>
            </Link>
          </div>

          <div className="col col-6 home_image">
            <img src="/img/ballbida.png" alt="Bida Ball"></img>
          </div>
        </div>
      </div>

      <div className="row commit-sign">
        <div className="col col-3 sign commit-sign_green">
          <FontAwesomeIcon className="commit-sign_green-award" icon={faAward} />
          <p>Trang thiết bị hiện đại <br /> Đảm bảo trải nghiệm tốt nhất</p>
        </div>

        <div className="col col-3 sign commit-sign_orange">
          <FontAwesomeIcon className="commit-sign_orange-swap" icon={faRightLeft} />
          <p>Hỗ trợ thay đổi <br /> hoặc hủy đặt bàn dễ dàng</p>
        </div>

        <div className="col col-3 sign commit-sign_blue">
          <FontAwesomeIcon className="commit-sign_blue-headset" icon={faHeadset} />
          <p>Tư vấn viên tận tình <br /> Nhiều kinh nghiệm</p>
        </div>

        <div className="col col-3 sign commit-sign_yellow">
          <FontAwesomeIcon className="commit-sign_yellow-truck" icon={faUtensils} />
          <p>Đồ ăn, thức uống đa dạng <br /> Phục vụ ngay tại bàn</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
