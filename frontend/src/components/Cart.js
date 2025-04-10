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
            const response = await api.get('/cart');
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
            await api.post('/bookings/add-item', {
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

    const getTotalFoodPrice = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
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
                                <img src={booking.image} alt={booking.tableName} className="cart-image" />
                                <div className="cart-details">
                                    <span className="cart-number">{index + 1}. {booking.tableName} - {new Date(booking.time).toLocaleString()}</span>
                                    <span className="cart-location">Vị trí: {booking.location || 'Chưa xác định'}</span>
                                    <span className="cart-total">Giá bàn: {booking.totalPrice || 0} đ/1h</span>
                                </div>
                                <div className="booking-buttons" style={{ textAlign: "right" }}>
                                    <Link to={`/menu?table=${booking.tableName}`}>
                                        <button className="order-btn" onClick={() => addToCart(booking.tableId, product[0]?._id)}>
                                            Order thêm {product[0]?.name}
                                        </button>
                                    </Link>
                                    <button className="pay-btn">Thanh toán</button>
                                </div>
                            </div>

                            {booking.orderedItems && booking.orderedItems.length > 0 && (
                                <div className="ordered-items">
                                    <h4>Đồ ăn kèm:</h4>
                                    <div className="food-list">
                                        {booking.orderedItems.map((item, index) => (
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
                <span>
                    Tổng tiền: {
                        bookedTables.reduce((sum, booking) => {
                            const table = booking.tables?.[0];
                            const tablePrice = booking.totalPrice || 0;
                            const foodPrice = getTotalFoodPrice(table?.orderedItems);
                            return sum + tablePrice + foodPrice;
                        }, 0)
                    } đ
                </span>
                <button className="pay-btn">Thanh toán tất cả</button>
            </div>
        </div>
    );
}

export default Cart;
