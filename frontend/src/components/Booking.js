import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios";
import { toast } from "sonner";
import { CartContext } from "./contexts/CartContext";

function Booking({ table }) {
    const [selectedTime, setSelectedTime] = useState("");
    const [numberOfPlayers, setNumberOfPlayers] = useState(1);
    const [error, setError] = useState(false);
    const dateTimeRef = useRef(null);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const navigate = useNavigate();

    // Hàm làm tròn thời gian thành bội số của 5 phút
    const roundToNearestFiveMinutes = (date) => {
        const minutes = date.getMinutes();
        const roundedMinutes = Math.round(minutes / 5) * 5; 
        date.setMinutes(roundedMinutes);
        date.setSeconds(0); // Đặt giây về 0 để tránh lỗi
        return date;
    };

    // Khi người dùng chọn thời gian
    const handleTimeChange = (e) => {
        const inputTime = new Date(e.target.value);
        if (isNaN(inputTime.getTime())) {
            setError(true);
            return;
        }
        const roundedTime = roundToNearestFiveMinutes(inputTime);
        setSelectedTime(roundedTime.toISOString().slice(0, 16)); // Định dạng lại thành yyyy-MM-ddTHH:mm
        setError(false);
    };

    const handleBooking = async () => {
        if (!token) {
            toast.error("Bạn chưa đăng nhập!", {
                action: {
                    label: "Đăng nhập",
                    onClick: () => navigate("/login"),
                },
            });
            return;
        }

        if (!selectedTime) {
            toast.error("Vui lòng chọn thời gian hợp lệ!");
            setError(true);
            dateTimeRef.current.focus();
            return;
        }

        try {
            await api.post("/bookings", {
                userId,
                username,
                tables:
                [
                    {
                        tableId: table._id,
                        name: table.name,
                        image: table.image,
                        location: table.location,
                        time: selectedTime,
                        numberOfPlayers,
                    },
                ],
                totalPrice: table.newPrice,
            });
            localStorage.setItem("selectedTableName", table.name)
            toast.success("Đặt bàn thành công!");
            navigate("/booked-tables");
        } catch (error) {
            console.error("Lỗi khi đặt bàn:", error);
            toast.error("Đặt bàn thất bại! Vui lòng thử lại.");
        }
    };

    return (
        <div className="booking-container">
            <label>Chọn thời gian đặt bàn:</label>
            <input
                ref={dateTimeRef}
                type="datetime-local"
                className={error ? "input-error" : ""}
                value={selectedTime}
                onChange={handleTimeChange} // Cập nhật khi chọn thời gian
            />
            {error && <p className="error-text">Vui lòng nhập thời gian </p>}

            <label>Số người chơi:</label>
            <input
                type="number"
                min="1"
                value={numberOfPlayers}
                onChange={(e) =>
                    setNumberOfPlayers(parseInt(e.target.value) || 1)
                }
            />

            <button onClick={handleBooking} className="book-btn">
                Đặt bàn
            </button>
        </div>
    );
}

export default Booking;
