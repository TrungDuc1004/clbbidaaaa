import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../../api/Axios";
import { toast } from "sonner";

const CartContext = createContext();

function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);

    // Lấy số lượng sản phẩm trong giỏ hàng khi load trang
    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (token) {
            api.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    setCartCount(res.data.reduce((total, item) => total + item.quantity, 0));

                })
                .catch(() => {
                    toast.error("Không thể tải giỏ hàng!");
                });
        }
    }, []);


    const handleAddToCart = (productId) => {
        const token = localStorage.getItem("token");
        const selectedTableName = localStorage.getItem("selectedTableName")
        if (!token) {
            toast.error("Hãy đăng nhập trước!");
            return;
        }
        if (!selectedTableName) {
            toast.error("Bạn cần chọn bàn trước khi thêm món ăn!");
            return
        }
    
        api.post(`/cart/${productId}`, {tableName: selectedTableName}, )
            .then((res) => {
                // Lấy giỏ hàng mới sau khi thêm
                api.get("/cart")
                    .then((cartRes) => {
                        setCartCount(cartRes.data.reduce((total, item) => total + item.quantity, 0));
                    });
                toast.success("Sản phẩm đã được thêm!");
            })
            .catch(() => {
                toast.error("Lỗi khi thêm sản phẩm!");
            });
    };
    
    const handleRemoveFromCart = (productId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast("Hãy đăng nhập trước!");
            return;
        }
    
        api.delete(`/cart/${productId}`)
            .then(() => {
                // Lấy giỏ hàng mới sau khi xóa
                api.get("/cart", { headers: { Authorization: `Bearer ${token}` } })
                    .then((cartRes) => {
                        setCartCount(cartRes.data.reduce((total, item) => total + item.quantity, 0));
                    });
                toast({ title: "Sản phẩm đã được xóa!", type: "success" });
            })
            .catch(() => {
                toast({ title: "Lỗi khi xóa sản phẩm!", type: "warning" });
            });
    };
    
    return (
        <CartContext.Provider value={{ handleAddToCart, handleRemoveFromCart, cartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export { CartContext, CartProvider };
