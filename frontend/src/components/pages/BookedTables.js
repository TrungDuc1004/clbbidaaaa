import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/BookedTables.css'
import api from '../../api/Axios';
import { toast } from 'sonner';

function BookedTables() {
    const [bookedTables, setBookedTables] = useState([]);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editTime, setEditTime] = useState('');
    const [editPlayers, setEditPlayers] = useState(1);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }
        fetchBookedTables();
    }, [token, navigate]);

    const fetchBookedTables = async () => {
        try {
            const response = await api.get('/bookings/list');
            console.log("Dữ liệu bàn đã đặt từ API:", response.data); // 🛠 Kiểm tra dữ liệu API trả về
            setBookedTables(response.data || []);
        } catch (error) {
            // console.error('Lỗi khi lấy bàn đã đặt:', error);
        }
    };

    const handleCancelBooking = async (bookingId, tableId) => {
        try {
            await api.delete(`/bookings/${bookingId}`);
            toast("Hủy đặt bàn thành công!");
            fetchBookedTables();
        } catch (error) {
            // console.error("Lỗi khi hủy đặt bàn:", error);
            // toast("Không thể hủy đặt bàn!");
        }
    };

    const handleEditBooking = (booking) => {
        setEditingBooking(booking._id);

        // Định dạng ngày & giờ chuẩn xác
        const formattedTime = new Date(booking.tables[0].time).toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }).slice(0, 16);

        setEditTime(formattedTime);
        setEditPlayers(booking.tables[0].numberOfPlayers);
    };

    const handleSaveBooking = async (bookingId) => {
        if (!editPlayers || editPlayers < 1) {
            toast("Số người chơi phải lớn hơn 0!");
            return
        }


        try {
            const localTime = new Date(editTime);
            const isoTime = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000).toISOString();

            await api.put(`/bookings/${bookingId}`, {
                time: isoTime,  // ✅ Giữ đúng giờ Việt Nam
                numberOfPlayers: editPlayers
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast("Cập nhật đặt bàn thành công!");
            setEditingBooking(null);
            fetchBookedTables(); // Load lại danh sách bàn đã đặt
        } catch (error) {
            // console.error("Lỗi khi cập nhật đặt bàn:", error);
            // toast("Không thể cập nhật đặt bàn!");
        }

    };



    return (
        <div className="booked-tables-container">
            <div className="img-extra2">
                <h1 style={{ textAlign: "center" }}>Bàn bạn đã đặt</h1>
            </div>

            {bookedTables.length === 0 ? (
                <p>Bạn chưa đặt bàn nào.</p>
            ) : (
                <div className="booked-table-list">
                    {bookedTables.map((booking) => (
                        <div key={booking._id} className="table-item booked">
                            <img src={booking.tables[0].image} alt={booking.tables[0].name} className="table-image" />
                            <h3>
                                {booking.tables?.[0]?.tableId?.name || "Không có tên bàn"}
                            </h3>


                            {editingBooking === booking._id ? (
                                <>
                                    <label>Thời gian:</label>
                                    <input
                                        type="datetime-local"
                                        value={editTime}
                                        onChange={(e) => setEditTime(e.target.value)}
                                    />
                                    <label>Số người chơi:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editPlayers}
                                        onChange={(e) => setEditPlayers(e.target.value)}
                                    />
                                    <button onClick={() => handleSaveBooking(booking._id)} className="save-btn">
                                        Lưu
                                    </button>
                                    <button onClick={() => setEditingBooking(null)} className="cancel-btn">
                                        Hủy
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p><strong>Thời gian:</strong> {new Date(booking.tables[0].time).toLocaleString()}</p>
                                    <p><strong>Số người chơi:</strong> {booking.tables[0].numberOfPlayers}</p>
                                    <div className="booking-actions">
                                        <button onClick={() => handleEditBooking(booking)} className="edit-btn">
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                    <div className="booking-buttons">
                                        <Link to="/table">
                                            <button onClick={() => handleCancelBooking(booking._id, booking.tables[0].tableId)} className="cancel-btn">
                                                Hủy đặt bàn
                                            </button>
                                        </Link>
                                        <Link to={`/menu?tableName=${booking.tables[0]?.name}`}>
                                            <button className="order-btn" >Order thêm</button>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookedTables;
