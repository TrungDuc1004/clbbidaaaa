const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },

    tables: [
      {
        tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
        tableName: { type: String }, 
        image: { type: String },
        location: { type: String, required: true },
        pricePerHour: { type: Number }, // Thêm giá bàn mỗi giờ
        time: { type: Date }, // Thời gian bắt đầu đặt bàn
        numberOfPlayers: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["booked", "cancelled", "Completed"],
      default: "booked", // Mặc định là đã đặt bàn
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
