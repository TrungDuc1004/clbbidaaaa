import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Cart.css';
import api from '../api/Axios';
import { toast } from 'sonner';

function Cart() {
    const [bookedTables, setBookedTables] = useState([]);
    const [product, setProduct] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }
        fetchBookedTables();
        fetchProducts();
    }, [token, navigate]);

    const fetchBookedTables = async () => {
        try {
            const response = await api.get('/bookings/list');
            setBookedTables(response.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy bàn đã đặt:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/menu');
            setProduct(response.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        }
    };

    const addToCart = async (tableId, productId) => {
        try {
            await api.post('/cart/add-item', {
                tableId,
                productId,
                quantity: 1
            });
            toast.success("Đã thêm sản phẩm vào giỏ hàng!");
            fetchBookedTables();
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            toast.error("Không thể thêm sản phẩm!");
        }
    };

    return (
        <div className="cart-container">
            <div className="img-extra2">   
                <h1 style={{ textAlign: "center", color: "white" }}>Danh sách bàn đã đặt</h1>
            </div>
            {bookedTables.length === 0 ? (
                <p>Bạn chưa đặt bàn nào.</p>
            ) : (
                <div className="cart-list">
                    {bookedTables.map((booking, index) => (
                        <div key={booking._id} className="cart-item">
                            <div className="cart-info">
                                <img src={booking.tables[0].image} alt={booking.tables?.[0]?.tableId.name} className="cart-image" />
                                <div className="cart-details">
                                    <span className="cart-number">{index + 1}. {booking.tables?.[0]?.tableId.name} - {new Date(booking.tables[0].time).toLocaleString()}</span>
                                    <span className="cart-location">Vị trí: {booking.tables[0].location || 'Chưa xác định'}</span>
                                    <span className="cart-total">Giá bàn: {booking.totalPrice || 0} đ/1h</span>
                                </div>
                                <div className="booking-buttons" style={{ textAlign: "right" }}>
                                    <button className="order-btn" onClick={() => addToCart(booking.tables[0].tableId, product[0]?._id)}>Order thêm {product[0]?.name}</button>
                                    <button className="pay-btn">Thanh toán</button>
                                </div>
                            </div>
                            {booking.tables[0].orderedItems && booking.tables[0].orderedItems.length > 0 && (
                                <div className="ordered-items">
                                    <h4>Đồ ăn kèm:</h4>
                                    <div className="food-list">
                                        {booking.tables[0].orderedItems.map((item, index) => (
                                            <div key={index} className="food-item">
                                                <span>{item.name}</span>
                                                <span className="food-quantity">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div className="grand-total">
                <span>Tổng tiền: {bookedTables.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)} đ</span>
                <button className="pay-btn">Thanh toán tất cả</button>
            </div>
        </div>
    );
}

export default Cart;
