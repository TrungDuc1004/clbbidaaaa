import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/Axios";
import { toast } from "sonner";

const CartContext = createContext();

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [tableName, setTableName] = useState(null);
    const location = useLocation(); // phải gọi hook ở đầu component

    useEffect(() => {
        const tableParam = new URLSearchParams(location.search).get("table");
        console.log("🔍 tableParam from URL:", tableParam);
        if (tableParam) {
            setTableName(tableParam);
        }
    }, [location.search]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && tableName) {
            fetchCart(tableName);
        }
    }, [tableName]);

    const fetchCart = async (tableId) => {
        try {
            const res = await api.get(`/cart?tableId=${tableId}`);
            const cartItems = res.data;
    
            if (!Array.isArray(cartItems)) {
                toast.error("Dữ liệu giỏ hàng không hợp lệ!");
                return;
            }
    
            setCart(cartItems);
            const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
            setCartCount(totalQuantity);
        } catch (err) {
            console.error("Lỗi khi tải giỏ hàng", err);
            toast.error("Không thể tải giỏ hàng!");
        }
    };
    

    const handleAddToCart = (productId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Hãy đăng nhập trước!");
            return;
        }
        if (!tableName) {
            toast.error("Vui lòng chọn bàn trước khi thêm món!");
            return;
        }

        api.post("/cart/add-item", {
            tableId: tableName,
            productId,
            quantity: 1
        })
            .then(() => {
                fetchCart(tableName);
                toast.success("Sản phẩm đã được thêm vào bàn!");
            })
            .catch(() => {
                toast.error("Lỗi khi thêm sản phẩm!");
            });
    };

    const handleRemoveFromCart = (productId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Hãy đăng nhập trước!");
            return;
        }
        if (!tableName) {
            toast.error("Vui lòng chọn bàn trước khi xóa món!");
            return;
        }

        api.delete(`/cart/remove-item`, { data: { tableId: tableName, productId } })
            .then(() => {
                fetchCart(tableName);
                toast.success("Sản phẩm đã được xóa!");
            })
            .catch(() => {
                toast.error("Lỗi khi xóa sản phẩm!");
            });
    };

    return (
        <CartContext.Provider value={{ handleAddToCart, handleRemoveFromCart, cart, cartCount, tableName }}>
            {children}
        </CartContext.Provider>
    );
}

export { CartContext, CartProvider };
