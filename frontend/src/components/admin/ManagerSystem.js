import React from "react";
import { Link } from "react-router-dom";
import AllAccounts from "./AllAccounts";
import AllProducts from "./AllProducts";
import AllTables from "./AllTables";
import AllOrders from "./AllOrders";
import AllBookings from "./AllBookings";
import { useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faShoppingCart, faUser, faCrown, faCheck } from '@fortawesome/free-solid-svg-icons';
import '../../css/ManagerSystem.css'

function ManagerSystem() {
    const [activeTab, setActiveTab] = useState('users');

    // Nội dung hiển thị tương ứng
    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <AllAccounts />;
            case 'products':
                return <AllProducts />;
            case 'tables':
                return <AllTables />
            case 'orders':
                return <AllOrders />;
            case 'orders':
                return <AllBookings />;
            default:
                return;
        }
    };

    return (
        <div className="row commit-manager-system">
            {/* Sidebar */}
            <nav className="row nav-manager-left col col-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`${activeTab === 'users' ? 'nav-manager_active' : ''}`}
                    >
                        <FontAwesomeIcon className='faUser' icon={faUser} />Người dùng
                    </button>
                <Link to="/manager/admin/products">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={` ${activeTab === 'products' ? 'nav-manager_active' : ''}`}
                        style={{width: "100%"}}
                    >
                        <FontAwesomeIcon className='faUser' icon={faCalendar} />Sản phẩm
                    </button>
                </Link>

                <Link to="/manager/admin/tables">
                    <button
                        onClick={() => setActiveTab('tables')}
                        className={` ${activeTab === 'tables' ? 'nav-manager_active' : ''}`}
                        style={{width: "100%"}}

                    >
                        <FontAwesomeIcon className='faUser' icon={faCrown} />Bàn Bida
                    </button>
                </Link>

                <Link to="/manager/admin/orders">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={` ${activeTab === 'orders' ? 'nav-manager_active' : ''}`}
                        style={{width: "100%"}}

                    >
                        <FontAwesomeIcon className='faUser' icon={faShoppingCart} />Đơn hàng
                    </button>
                </Link>
                <Link to="/manager/admin/bookings">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={` ${activeTab === 'bookings' ? 'nav-manager_active' : ''}`}
                        style={{width: "100%"}}

                    >
                        <FontAwesomeIcon className='faUser' icon={faCheck} />Danh sách bàn đặt
                    </button>
                </Link>
            </nav>

            {/* Nội dung bên phải */}
            <main className="nav-manager-right col col-10">
                {renderContent()}
            </main>
        </div>
    );
};


export default ManagerSystem;
