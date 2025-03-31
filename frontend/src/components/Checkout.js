import React, { useContext, useState, useEffect } from "react";
import { ProfileContext } from './contexts/ProfileContext';
import { ToastContext } from "./contexts/ToastContext";
import { useNavigate } from 'react-router-dom';
import '../css/Checkout.css';
import api from "../api/Axios";


function Checkout() {
    const { username, phonenumber, address, city, country } = useContext(ProfileContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    const [checkoutData, setCheckoutData] = useState({ Items: [], total: 0 });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Người dùng chưa đăng nhập.');
        } else {
            const data = JSON.parse(localStorage.getItem("checkoutData")) || { Items: [], total: 0 };
            setCheckoutData(data);
        }
    }, []);

    // Tính tổng tiền lại (tránh lỗi khi dữ liệu trống)
    const totalAmount = checkoutData.Items.reduce((sum, item) => sum + (item.newPrice * item.quantity), 0);

    const handleOrder = () => {
        if (checkoutData.Items.length === 0) {
            alert('Giỏ hàng rỗng, không thể đặt hàng!');
            return;
        }

        const products = checkoutData.Items.map(item => ({
            productId: item._id,
            name: item.name,
            image: item.image,
            newPrice: item.newPrice,
            quantity: item.quantity,
        }));

        const orderData = {
            products,
            total: totalAmount, // Dùng tổng đã tính lại
        };

        api.post('/order', orderData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(response => {
                showToast({ title: "Đặt hàng thành công!", type: "success" });

                // Xóa giỏ hàng sau khi đặt hàng thành công
                api.put('/cart').catch(error => console.error('Lỗi khi cập nhật giỏ hàng:', error));

                localStorage.removeItem('checkoutData');
                navigate('/order');
            })
            .catch(error => {
                console.error('Lỗi khi đặt hàng:', error.response?.data || error.message);
                alert('Có lỗi xảy ra khi đặt hàng!');
            });
    };

    return (
        <div>
            <div className="row">
                <div className="col col-12 img-extra">Thanh toán</div>
            </div>

            <div className="row info-checkout-container">
                <div className="col col-6 info-buyer">
                    <h3>Thông tin người mua:</h3>
                    <p>- Tên người dùng: <span>{username}</span></p>
                    <p>- Số điện thoại: <span>{phonenumber}</span></p>
                    <p>- Địa chỉ: <span>{address}</span></p>
                    <p>- Thành phố: <span>{city}</span></p>
                    <p>- Nước: <span>{country}</span></p>
                </div>

                <div className="col col-6 infor-checkout">
                    <h3 className="infor-checkout-title">Thông tin thanh toán</h3>
                    <div className="infor-checkout-box">
                        {checkoutData.Items.length > 0 ? (
                            checkoutData.Items.map((item) => (
                                <div key={item._id}>
                                    <p>
                                        <span className="infor-checkout-name">{item.name}</span>
                                        - (Số lượng: {item.quantity} - Giá: {item.newPrice}đ)
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>Không có sản phẩm trong giỏ hàng.</p>
                        )}
                    </div>
                    <div className="infor-checkout-Pee">
                        <p>Số lượng: {checkoutData.Items.length}</p>
                        <p>Giá tổng sản phẩm: {totalAmount}đ</p>
                        <h3>Tổng cộng: {totalAmount}đ</h3>
                    </div>
                    <button onClick={handleOrder} className="infor-checkout-button">Thanh toán</button>

                </div>
            </div>
        </div>
    );
}

export default Checkout;
