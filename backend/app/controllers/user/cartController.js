const Product = require('../../models/Product');
const ProductCart = require('../../models/ProductCart');
const Table = require('../../models/Table');
const Booking = require('../../models/Booking');

// 🛒 Thêm sản phẩm vào giỏ hàng (POST /bookings/add-item)

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { tableId, productId, quantity = 1 } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'Không có userId!' });
        }
        if (!tableId || !productId) {
            return res.status(400).json({ message: 'Thiếu thông tin bàn hoặc sản phẩm!' });
        }

        // Kiểm tra bàn & sản phẩm có tồn tại
        const product = await Product.findById(productId);
        const table = await Table.findById(tableId);

        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        if (!table) return res.status(404).json({ message: 'Không tìm thấy bàn!' });

        // 👉 Kiểm tra người dùng đã đặt bàn chưa
        const existingBooking = await Booking.findOne({ userId, tableId, status: "booked" });

        if (!existingBooking) {
            return res.status(403).json({ message: 'Bạn chưa đặt bàn này hoặc bàn chưa được xác nhận!' });
        }

        // 👉 Nếu đã đặt bàn, xử lý thêm sản phẩm
        let cartItem = await ProductCart.findOne({ userId, productId, tableId });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = new ProductCart({
                userId,
                tableId,
                tableName: table.name,
                productId,
                name: product.name,
                image: product.image,
                price: product.price,
                quantity
            });
            await cartItem.save();
        }

        return res.status(200).json({ message: 'Thêm sản phẩm thành công!' });
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        return res.status(500).json({ message: 'Lỗi server!' });
    }
};


// 🛒 Lấy danh sách sản phẩm trong bàn (GET /bookings/cart)
exports.getCart = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });
        }

        // Lấy danh sách bookings của user đã được xác nhận
        const bookings = await Booking.find({ userId, status: 'booked' })
            .populate('tables.tableId'); // Lấy thông tin bàn (name, image...)

        const formatted = bookings.map(booking => {
            const table = booking.tables[0]; // chỉ xử lý 1 bàn mỗi booking
            return {
                _id: booking._id,
                time: table.time,
                location: table.location,
                totalPrice: booking.totalPrice,
                tableId: table.tableId?._id,
                tableName: table.tableId?.name,
                image: table.tableId?.image,
                orderedItems: table.orderedItems || []
            };
        });

        return res.json(formatted);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bàn:", error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};


// ❌ Xóa sản phẩm khỏi bàn (DELETE /bookings/cart/:id)
exports.deleteCartItem = async (req, res) => {
    try {
        await ProductCart.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'Đã xóa sản phẩm khỏi bàn' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        return res.status(500).json({ message: 'Lỗi server, vui lòng thử lại!' });
    }
};

// 🔄 Cập nhật số lượng sản phẩm (PUT /bookings/cart/:id)
exports.updateCartQuantity = async (req, res) => {
    try {
        const { action } = req.body;
        const update = action === 'increase'
            ? { $inc: { quantity: 1 } }
            : action === 'decrease'
                ? { $inc: { quantity: -1 } }
                : null;

        if (!update) {
            return res.status(400).json({ message: 'Hành động không hợp lệ!' });
        }

        await ProductCart.updateOne({ _id: req.params.id }, update);
        return res.status(200).json({ message: 'Cập nhật số lượng thành công' });
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng:', error);
        return res.status(500).json({ message: 'Lỗi server, vui lòng thử lại!' });
    }
};

// 🗑️ Xóa toàn bộ giỏ hàng của user (DELETE /bookings/cart)
exports.clearCart = async (req, res) => {
    try {
        await ProductCart.deleteMany({ userId: req.user.userId });
        return res.status(200).json({ message: 'Đã xóa toàn bộ giỏ hàng' });
    } catch (error) {
        console.error('Lỗi khi xóa giỏ hàng:', error);
        return res.status(500).json({ message: 'Lỗi server, vui lòng thử lại!' });
    }
};
