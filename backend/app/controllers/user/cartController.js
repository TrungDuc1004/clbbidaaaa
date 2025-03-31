const Product = require('../../models/Product');
const ProductCart = require('../../models/ProductCart');
const Table = require('../../models/Table');

// 🛒 Thêm sản phẩm vào giỏ hàng (POST /bookings/add-item)
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { tableId, productId, quantity = 1 } = req.body;

        if (!tableId || !productId) {
            return res.status(400).json({ message: 'Thiếu thông tin bàn hoặc sản phẩm!' });
        }

        // Tìm sản phẩm
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Tìm bàn
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Không tìm thấy bàn!' });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        let cartItem = await ProductCart.findOne({ userId, productId, tableId });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = new ProductCart({
                userId,
                tableId,
                tableName: table.name, // Lưu tên bàn để dễ hiển thị
                productId,
                name: product.name,
                image: product.image,
                price: product.price,
                quantity
            });
            await cartItem.save();
        }

        return res.status(200).json({ message: 'Thêm sản phẩm vào bàn thành công!' });
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        return res.status(500).json({ message: 'Lỗi server, vui lòng thử lại!' });
    }
};

// 🛒 Lấy danh sách sản phẩm trong bàn (GET /bookings/cart)
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(400).json({ message: 'Không tìm thấy userId!' });
        }

        // Lấy danh sách sản phẩm trong giỏ hàng theo userId
        const cartItems = await ProductCart.find({ userId }).populate('tableId', 'name location');

        // Nhóm sản phẩm theo từng bàn
        const groupedCart = cartItems.reduce((acc, item) => {
            const tableKey = item.tableId._id;
            if (!acc[tableKey]) {
                acc[tableKey] = {
                    tableId: item.tableId._id,
                    tableName: item.tableId.name,
                    location: item.tableId.location,
                    products: []
                };
            }
            acc[tableKey].products.push(item);
            return acc;
        }, {});

        const cartByTables = Object.values(groupedCart);
        return res.json(cartByTables);
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        return res.status(500).json({ message: 'Lỗi server, vui lòng thử lại!' });
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
