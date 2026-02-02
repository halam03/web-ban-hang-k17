import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const emptyForm = {
    ma_sp: '',
    ten_sp: '',
    ma_hang_sx: '',
    ma_loai: '',
    ma_dt: '',
    ma_chat_lieu: '',
    ma_nuoc_sx: '',
    gia_lon_nhat: '',
    anh_dai_dien: '',
    gioi_thieu_sp: '',
    images: [],
};

const emptyOrderForm = {
    status: 0,
    phuong_thuc_thanh_toan: 0,
    ghi_chu: '',
    ma_so_thue: '',
    thong_tin_thue: '',
};

const emptyUserForm = {
    username: '',
    password: '',
    loai_user: 1,
    ten_khach_hang: '',
    so_dien_thoai: '',
    dia_chi: '',
    ghi_chu: '',
};

const emptyCategoryForm = {
    ma_loai: '',
    loai: '',
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'analyze';
    const [tab, setTab] = useState(initialTab);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({ month: '', year: '', total: null });
    const [form, setForm] = useState(emptyForm);
    const [mainFile, setMainFile] = useState(null);
    const [mainPreview, setMainPreview] = useState('');
    const [detailFiles, setDetailFiles] = useState([]);
    const [detailPreviews, setDetailPreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderSearch, setOrderSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [detailModal, setDetailModal] = useState({ open: false, order: null });
    const [orderEditingId, setOrderEditingId] = useState(null);
    const [orderForm, setOrderForm] = useState(emptyOrderForm);
    const [showUserForm, setShowUserForm] = useState(false);
    const [userEditingId, setUserEditingId] = useState(null);
    const [userForm, setUserForm] = useState(emptyUserForm);
    const [productDetailModal, setProductDetailModal] = useState({ open: false, product: null });
    const [categorySearch, setCategorySearch] = useState('');
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [categoryEditingId, setCategoryEditingId] = useState(null);
    const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
    const [categoryError, setCategoryError] = useState('');
    const [rangeType, setRangeType] = useState('7d');
    const [statsRange, setStatsRange] = useState({ labels: [], revenues: [], orders: [] });

    const statusLabels = {
        0: 'Đang chờ',
        1: 'Đang giao',
        2: 'Đã giao',
        3: 'Đã hủy',
    };

    const deliveredStatus = 2;
    const statusOptions = [
        { value: 0, label: 'Đang chờ' },
        { value: 1, label: 'Đang giao' },
        { value: 2, label: 'Đã giao' },
        { value: 3, label: 'Đã hủy' },
    ];

    const paymentLabels = {
        0: 'Giao hàng (COD)',
        1: 'Chuyển khoản',
        2: 'Ví điện tử',
        3: 'Thẻ ngân hàng',
    };
    const parseOrderDate = (value) => {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const revenueMax = useMemo(() => Math.max(...statsRange.revenues, 0), [statsRange]);
    const orderMax = useMemo(() => Math.max(...statsRange.orders, 0), [statsRange]);

    const fetchProducts = () => api.get('/admin/products').then((res) => setProducts(res.data));
    const fetchOrders = () => api.get('/admin/orders').then((res) => setOrders(res.data));
    const fetchUsers = () => api.get('/admin/users').then((res) => setUsers(res.data));
    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories');
            setCategories(res.data || []);
        } catch (err) {
            const fallback = await api.get('/meta/categories');
            setCategories(fallback.data || []);
        }
    };
    const fetchCategoryOptions = () => api.get('/meta/categories').then((res) => setCategoryOptions(res.data || []));

    useEffect(() => {
        if (user?.loai_user === 0) {
            fetchProducts();
            fetchCategories();
            fetchCategoryOptions();
            fetchOrders();
            fetchUsers();
        }
    }, [user]);

    useEffect(() => {
        if (user?.loai_user !== 0) return;
        api.get('/admin/stats/range', { params: { range: rangeType } })
            .then((res) => setStatsRange(res.data || { labels: [], revenues: [], orders: [] }))
            .catch(() => setStatsRange({ labels: [], revenues: [], orders: [] }));
    }, [rangeType, user, orders]);

    useEffect(() => {
        const nextTab = searchParams.get('tab');
        if (nextTab) {
            setTab(nextTab);
        } else {
            setTab('analyze');
        }
    }, [searchParams]);

    useEffect(() => {
        if (!mainFile) return;
        const url = URL.createObjectURL(mainFile);
        setMainPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [mainFile]);

    useEffect(() => {
        if (!detailFiles.length) {
            setDetailPreviews([]);
            return;
        }
        const urls = detailFiles.map((file) => URL.createObjectURL(file));
        setDetailPreviews(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [detailFiles]);

    const filteredProducts = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return products;
        return products.filter((item) =>
            [item.ma_sp, item.ten_sp, item.hang_sx?.hang_sx]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(keyword))
        );
    }, [products, searchTerm]);

    const filteredOrders = useMemo(() => {
        const keyword = orderSearch.trim().toLowerCase();
        if (!keyword) return orders;
        return orders.filter((item) =>
            [String(item.ma_hoa_don), item.khach_hang?.ten_khach_hang, item.ma_khach_hang]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(keyword))
        );
    }, [orders, orderSearch]);

    const filteredUsers = useMemo(() => {
        const keyword = userSearch.trim().toLowerCase();
        if (!keyword) return users;
        return users.filter((item) =>
            [item.username, item.khach_hang?.ten_khach_hang, item.khach_hang?.so_dien_thoai]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(keyword))
        );
    }, [users, userSearch]);

    const filteredCategories = useMemo(() => {
        const keyword = categorySearch.trim().toLowerCase();
        if (!keyword) return categories;
        return categories.filter((item) =>
            [item.ma_loai, item.loai].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword))
        );
    }, [categories, categorySearch]);

    const totalRevenue = useMemo(() =>
        orders.reduce((sum, item) => {
            if (item.status !== deliveredStatus) return sum;
            return sum + (Number(item.tong_tien_hd) || 0);
        }, 0),
        [orders, deliveredStatus]
    );

    const totalOrders = orders.length;
    const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleMainFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setMainFile(file);
    };

    const handleDetailFilesChange = (e) => {
        const files = Array.from(e.target.files || []);
        setDetailFiles(files);
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setMainFile(null);
        setMainPreview('');
        setDetailFiles([]);
        setDetailPreviews([]);
        setExistingImages([]);
    };

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        setMainFile(null);
        setMainPreview('');
        setDetailFiles([]);
        setDetailPreviews([]);
        setExistingImages([]);
    };

    const openEdit = (item) => {
        setEditingId(item.ma_sp);
        setForm({
            ma_sp: item.ma_sp,
            ten_sp: item.ten_sp || '',
            ma_hang_sx: item.ma_hang_sx || '',
            ma_loai: item.ma_loai || '',
            ma_dt: item.ma_dt || '',
            ma_chat_lieu: item.ma_chat_lieu || '',
            ma_nuoc_sx: item.ma_nuoc_sx || '',
            gia_lon_nhat: item.gia_lon_nhat || '',
            anh_dai_dien: item.anh_dai_dien || '',
            gioi_thieu_sp: item.gioi_thieu_sp || '',
            images: item.anh_sps ? item.anh_sps.map((img) => img.ten_file_anh) : [],
        });
        setMainFile(null);
        setMainPreview(item.anh_dai_dien ? `/assets/img/ImageCamera/${item.anh_dai_dien}` : '');
        setDetailFiles([]);
        setDetailPreviews([]);
        setExistingImages(item.anh_sps ? item.anh_sps.map((img) => img.ten_file_anh) : []);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'images') return;
            if (value === null || value === undefined) return;
            payload.append(key, value);
        });
        if (mainFile) {
            payload.append('anh_dai_dien_file', mainFile);
        }
        if (detailFiles.length) {
            detailFiles.forEach((file) => payload.append('images_files[]', file));
        }
        if (editingId) {
            payload.append('_method', 'PUT');
            await api.post(`/admin/products/${editingId}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } else {
            await api.post('/admin/products', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
        resetForm();
        fetchProducts();
    };

    const handleDelete = async (maSp) => {
        await api.delete(`/admin/products/${maSp}`);
        fetchProducts();
    };

    const openProductDetail = (item) => {
        setProductDetailModal({ open: true, product: item });
    };

    const closeProductDetail = () => setProductDetailModal({ open: false, product: null });

    const handleStats = async () => {
        const res = await api.get('/admin/stats', { params: { month: stats.month, year: stats.year } });
        setStats((prev) => ({ ...prev, total: res.data.total }));
    };

    const openCategoryCreate = () => {
        setCategoryEditingId(null);
        setCategoryForm(emptyCategoryForm);
        setCategoryError('');
        setShowCategoryForm(true);
    };

    const openCategoryEdit = (item) => {
        setCategoryEditingId(item.ma_loai);
        setCategoryForm({ ma_loai: item.ma_loai, loai: item.loai || '' });
        setCategoryError('');
        setShowCategoryForm(true);
    };

    const closeCategoryForm = () => {
        setShowCategoryForm(false);
        setCategoryEditingId(null);
        setCategoryForm(emptyCategoryForm);
        setCategoryError('');
    };

    const handleCategoryChange = (e) => {
        setCategoryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (categoryEditingId) {
                await api.put(`/admin/categories/${categoryEditingId}`, { loai: categoryForm.loai });
            } else {
                await api.post('/admin/categories', categoryForm);
            }
            closeCategoryForm();
            fetchCategories();
        } catch (err) {
            setCategoryError('Không thể lưu danh mục. Vui lòng kiểm tra lại.');
        }
    };

    const handleCategoryDelete = async (maLoai) => {
        await api.delete(`/admin/categories/${maLoai}`);
        fetchCategories();
    };

    const openOrderDetail = async (orderId) => {
        const res = await api.get(`/admin/orders/${orderId}`);
        setDetailModal({ open: true, order: res.data });
    };

    const closeOrderDetail = () => setDetailModal({ open: false, order: null });

    const openOrderEdit = (order) => {
        setOrderEditingId(order.ma_hoa_don);
        setOrderForm({
            status: order.status ?? 0,
            phuong_thuc_thanh_toan: order.phuong_thuc_thanh_toan ?? 0,
            ghi_chu: order.ghi_chu || '',
            ma_so_thue: order.ma_so_thue || '',
            thong_tin_thue: order.thong_tin_thue || '',
        });
        setShowOrderForm(true);
    };

    const closeOrderForm = () => {
        setShowOrderForm(false);
        setOrderEditingId(null);
        setOrderForm(emptyOrderForm);
    };

    const handleOrderChange = (e) => {
        const { name, value } = e.target;
        setOrderForm((prev) => ({
            ...prev,
            [name]: name === 'status' || name === 'phuong_thuc_thanh_toan' ? Number(value) : value,
        }));
    };

    const handleOrderUpdate = async (e) => {
        e.preventDefault();
        if (!orderEditingId) return;
        if (orderForm.status === deliveredStatus) return;
        await api.put(`/admin/orders/${orderEditingId}`, orderForm);
        closeOrderForm();
        fetchOrders();
    };

    const handleOrderDelete = async (orderId) => {
        const ok = window.confirm('Bạn chắc chắn muốn xóa đơn hàng này?');
        if (!ok) return;
        await api.delete(`/admin/orders/${orderId}`);
        fetchOrders();
    };

    const openUserCreate = () => {
        setUserEditingId(null);
        setUserForm(emptyUserForm);
        setShowUserForm(true);
    };

    const openUserEdit = (item) => {
        setUserEditingId(item.username);
        setUserForm({
            username: item.username,
            password: '',
            loai_user: item.loai_user ?? 1,
            ten_khach_hang: item.khach_hang?.ten_khach_hang || '',
            so_dien_thoai: item.khach_hang?.so_dien_thoai || '',
            dia_chi: item.khach_hang?.dia_chi || '',
            ghi_chu: item.khach_hang?.ghi_chu || '',
        });
        setShowUserForm(true);
    };

    const closeUserForm = () => {
        setShowUserForm(false);
        setUserEditingId(null);
        setUserForm(emptyUserForm);
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({
            ...prev,
            [name]: name === 'loai_user' ? Number(value) : value,
        }));
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...userForm };
        if (!payload.password) {
            delete payload.password;
        }
        if (userEditingId) {
            await api.put(`/admin/users/${userEditingId}`, payload);
        } else {
            await api.post('/admin/users', payload);
        }
        closeUserForm();
        fetchUsers();
    };

    const handleUserDelete = async (username) => {
        const ok = window.confirm('Bạn chắc chắn muốn xóa tài khoản này?');
        if (!ok) return;
        await api.delete(`/admin/users/${username}`);
        fetchUsers();
    };

    if (user?.loai_user !== 0) {
        return (
            <div className="admin-card">Bạn không có quyền truy cập trang này.</div>
        );
    }

    return (
        <div className="admin-panel">
            {tab === 'analyze' && (
                <>
                    <div className="admin-card-grid">
                        <div className="admin-card">
                            <div className="admin-card__label">Tổng doanh thu</div>
                            <div className="admin-card__value">{totalRevenue.toLocaleString('vi-VN')} VND</div>
                        </div>
                        <div className="admin-card">
                            <div className="admin-card__label">Tổng đơn hàng</div>
                            <div className="admin-card__value">{totalOrders}</div>
                        </div>
                        <div className="admin-card">
                            <div className="admin-card__label">Đơn hàng trung bình</div>
                            <div className="admin-card__value">{avgOrder.toLocaleString('vi-VN')} VND</div>
                        </div>
                    </div>
                    <div className="admin-toolbar">
                        <h4 className="admin-section-title">Biểu đồ theo thời gian</h4>
                        <div className="admin-toolbar__actions">
                            <button className={`btn btn-sm ${rangeType === '7d' ? 'btn-primary' : 'btn-outline-secondary'}`} type="button" onClick={() => setRangeType('7d')}>
                                7 ngày
                            </button>
                            <button className={`btn btn-sm ${rangeType === '30d' ? 'btn-primary' : 'btn-outline-secondary'}`} type="button" onClick={() => setRangeType('30d')}>
                                30 ngày
                            </button>
                            <button className={`btn btn-sm ${rangeType === '12m' ? 'btn-primary' : 'btn-outline-secondary'}`} type="button" onClick={() => setRangeType('12m')}>
                                12 tháng
                            </button>
                        </div>
                    </div>
                    <div className="admin-card-grid admin-card-grid--charts">
                        <div className="admin-card">
                            <h4 className="admin-section-title">
                                Doanh thu {rangeType === '12m' ? '12 tháng' : rangeType === '30d' ? '30 ngày' : '7 ngày'} gần nhất
                            </h4>
                            <div className="admin-chart">
                                {statsRange.labels.map((label, index) => {
                                    const value = statsRange.revenues[index] || 0;
                                    const height = revenueMax ? Math.round((value / revenueMax) * 100) : 0;
                                    return (
                                        <div className="admin-chart__bar" key={`${label}-${index}`}>
                                            <div className="admin-chart__bar-inner" style={{ height: `${height}%` }}></div>
                                            <span className="admin-chart__label">{label}</span>
                                            <span className="admin-chart__value">{value.toLocaleString('vi-VN')}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="admin-card">
                            <h4 className="admin-section-title">
                                Số đơn hàng {rangeType === '12m' ? '12 tháng' : rangeType === '30d' ? '30 ngày' : '7 ngày'} gần nhất
                            </h4>
                            <div className="admin-chart admin-chart--secondary">
                                {statsRange.labels.map((label, index) => {
                                    const count = statsRange.orders[index] || 0;
                                    const height = orderMax ? Math.round((count / orderMax) * 100) : 0;
                                    return (
                                        <div className="admin-chart__bar" key={`${label}-orders-${index}`}>
                                            <div className="admin-chart__bar-inner" style={{ height: `${height}%` }}></div>
                                            <span className="admin-chart__label">{label}</span>
                                            <span className="admin-chart__value">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {tab === 'products' && (
                <div className="admin-card">
                    <div className="admin-toolbar">
                        <h4 className="admin-section-title">Danh mục sản phẩm</h4>
                        <div className="admin-toolbar__actions">
                            <input
                                className="admin-search"
                                type="text"
                                placeholder="Tìm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-primary" type="button" onClick={openCreate}>
                                Tạo mới
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Ma SP</th>
                                    <th>Tên SP</th>
                                    <th>Giá</th>
                                    <th>Hãng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((item) => (
                                    <tr key={item.ma_sp}>
                                        <td>{item.ma_sp}</td>
                                        <td>{item.ten_sp}</td>
                                        <td>{(item.gia_lon_nhat || 0).toLocaleString('vi-VN')} VND</td>
                                        <td>{item.hang_sx?.hang_sx}</td>
                                        <td>
                                            <div className="admin-action-row">
                                                <button className="admin-icon-btn" type="button" title="Xem" aria-label="Xem" onClick={() => openProductDetail(item)}>
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="admin-icon-btn" type="button" title="Sửa" aria-label="Sửa" onClick={() => openEdit(item)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="admin-icon-btn" type="button" title="Xóa" aria-label="Xóa" onClick={() => handleDelete(item.ma_sp)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'categories' && (
                <div className="admin-card">
                    <div className="admin-toolbar">
                        <h4 className="admin-section-title">Quản lý danh mục</h4>
                        <div className="admin-toolbar__actions">
                            <input
                                className="admin-search"
                                type="text"
                                placeholder="Tìm danh mục..."
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                            />
                            <button className="btn btn-primary" type="button" onClick={openCategoryCreate}>
                                Tạo mới
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Tên danh mục</th>
                                    <th>Số sản phẩm</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((item) => (
                                    <tr key={item.ma_loai}>
                                        <td>{item.ma_loai}</td>
                                        <td>{item.loai}</td>
                                        <td>{item.danh_muc_sps_count ?? 0}</td>
                                        <td>
                                            <div className="admin-action-row">
                                                <button className="admin-icon-btn" type="button" title="Sửa" aria-label="Sửa" onClick={() => openCategoryEdit(item)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="admin-icon-btn" type="button" title="Xóa" aria-label="Xóa" onClick={() => handleCategoryDelete(item.ma_loai)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'orders' && (
                <div className="admin-card">
                    <div className="admin-toolbar">
                        <h4 className="admin-section-title">Danh sách đơn hàng</h4>
                        <input
                            className="admin-search"
                            type="text"
                            placeholder="Tìm đơn hàng..."
                            value={orderSearch}
                            onChange={(e) => setOrderSearch(e.target.value)}
                        />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Ma HD</th>
                                    <th>Khách hàng</th>
                                    <th>Trạng thái</th>
                                    <th>Thanh toán</th>
                                    <th>Tổng tiền</th>
                                    <th>Ngày</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.ma_hoa_don}>
                                        <td>{order.ma_hoa_don}</td>
                                        <td>{order.khach_hang?.ten_khach_hang || order.ma_khach_hang}</td>
                                        <td>{statusLabels[order.status] || 'Đang chờ'}</td>
                                        <td>{paymentLabels[order.phuong_thuc_thanh_toan] || 'Giao hàng'}</td>
                                        <td>{(order.tong_tien_hd || 0).toLocaleString('vi-VN')} VND</td>
                                        <td>{order.ngay_hoa_don}</td>
                                        <td>
                                            <div className="admin-action-row">
                                                <button className="admin-icon-btn" type="button" title="Chi tiết" aria-label="Chi tiết" onClick={() => openOrderDetail(order.ma_hoa_don)}>
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button
                                                    className="admin-icon-btn"
                                                    type="button"
                                                    title={order.status === deliveredStatus ? 'Đã giao - không thể sửa' : 'Cập nhật'}
                                                    aria-label="Cập nhật"
                                                    onClick={() => openOrderEdit(order)}
                                                    disabled={order.status === deliveredStatus}
                                                >
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="admin-icon-btn" type="button" title="Xóa" aria-label="Xóa" onClick={() => handleOrderDelete(order.ma_hoa_don)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'users' && (
                <div className="admin-card">
                    <div className="admin-toolbar">
                        <h4 className="admin-section-title">Quản lý người dùng</h4>
                        <div className="admin-toolbar__actions">
                            <input
                                className="admin-search"
                                type="text"
                                placeholder="Tìm người dùng..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                            />
                            <button className="btn btn-primary" type="button" onClick={openUserCreate}>
                                Tạo mới
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Vai trò</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((item) => (
                                    <tr key={item.username}>
                                        <td>{item.username}</td>
                                        <td>{item.khach_hang?.ten_khach_hang || '-'}</td>
                                        <td>{item.khach_hang?.so_dien_thoai || '-'}</td>
                                        <td>{item.loai_user === 0 ? 'Quản trị' : 'Khách hàng'}</td>
                                        <td>
                                            <div className="admin-action-row">
                                                <button className="admin-icon-btn" type="button" title="Sửa" aria-label="Sửa" onClick={() => openUserEdit(item)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="admin-icon-btn" type="button" title="Xóa" aria-label="Xóa" onClick={() => handleUserDelete(item.username)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="admin-modal">
                    <div className="admin-modal__backdrop" onClick={resetForm}></div>
                    <div className="admin-modal__content">
                        <div className="admin-modal__header">
                            <h5>{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</h5>
                            <button className="admin-modal__close" type="button" onClick={resetForm}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-4 form-group">
                                    <label>Ma SP</label>
                                    <input className="form-control" name="ma_sp" value={form.ma_sp} onChange={handleChange} required disabled={!!editingId} />
                                </div>
                                <div className="col-md-8 form-group">
                                    <label>Tên SP</label>
                                    <input className="form-control" name="ten_sp" value={form.ten_sp} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label>Mã hãng</label>
                                    <input className="form-control" name="ma_hang_sx" value={form.ma_hang_sx} onChange={handleChange} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label>Mã loại</label>
                                    <select className="form-control" name="ma_loai" value={form.ma_loai} onChange={handleChange}>
                                        <option value="">-- Chọn danh mục --</option>
                                        {categoryOptions.map((item) => (
                                            <option key={item.ma_loai} value={item.ma_loai}>
                                                {item.loai}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4 form-group">
                                    <label>Ma DT</label>
                                    <input className="form-control" name="ma_dt" value={form.ma_dt} onChange={handleChange} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label>Mã chất liệu</label>
                                    <input className="form-control" name="ma_chat_lieu" value={form.ma_chat_lieu} onChange={handleChange} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label>Mã nước</label>
                                    <input className="form-control" name="ma_nuoc_sx" value={form.ma_nuoc_sx} onChange={handleChange} />
                                </div>
                                <div className="col-md-4 form-group">
                                    <label>Giá</label>
                                    <input className="form-control" name="gia_lon_nhat" value={form.gia_lon_nhat} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Ảnh đại diện</label>
                                    <input className="form-control" type="file" accept="image/*" onChange={handleMainFileChange} />
                                    {(mainPreview || form.anh_dai_dien) && (
                                        <div className="admin-image-preview">
                                            <img src={mainPreview || `/assets/img/ImageCamera/${form.anh_dai_dien}`} alt="preview" />
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Ảnh chi tiết (chọn nhiều)</label>
                                    <input className="form-control" type="file" accept="image/*" multiple onChange={handleDetailFilesChange} />
                                    {existingImages.length > 0 && !detailFiles.length && (
                                        <div className="admin-image-grid">
                                            {existingImages.map((img) => (
                                                <img key={img} src={`/assets/img/ImageCamera/${img}`} alt="detail" />
                                            ))}
                                        </div>
                                    )}
                                    {detailPreviews.length > 0 && (
                                        <div className="admin-image-grid">
                                            {detailPreviews.map((src, idx) => (
                                                <img key={`${src}-${idx}`} src={src} alt="detail" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-12 form-group">
                                    <label>Giới thiệu</label>
                                    <textarea className="form-control" name="gioi_thieu_sp" value={form.gioi_thieu_sp} onChange={handleChange}></textarea>
                                </div>
                            </div>
                            <div className="admin-form-actions">
                                <button className="btn btn-primary" type="submit">
                                    {editingId ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                                <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {detailModal.open && (
                <div className="admin-modal">
                    <div className="admin-modal__backdrop" onClick={closeOrderDetail}></div>
                    <div className="admin-modal__content">
                        <div className="admin-modal__header">
                            <h5>Chi tiết đơn hàng #{detailModal.order?.ma_hoa_don}</h5>
                            <button className="admin-modal__close" type="button" onClick={closeOrderDetail}>
                                ×
                            </button>
                        </div>
                        <div className="admin-order-summary">
                            <div><strong>Khách hàng:</strong> {detailModal.order?.khach_hang?.ten_khach_hang || detailModal.order?.ma_khach_hang}</div>
                            <div><strong>Trạng thái:</strong> {statusLabels[detailModal.order?.status] || 'Đang chờ'}</div>
                            <div><strong>Thanh toán:</strong> {paymentLabels[detailModal.order?.phuong_thuc_thanh_toan] || 'Giao hàng'}</div>
                            <div><strong>Tổng tiền:</strong> {(detailModal.order?.tong_tien_hd || 0).toLocaleString('vi-VN')} VND</div>
                            {detailModal.order?.ghi_chu && (
                                <div><strong>Ghi chú:</strong> {detailModal.order?.ghi_chu}</div>
                            )}
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(detailModal.order?.chi_tiet_hdbs || []).map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.danh_muc_sp?.ten_sp}</td>
                                            <td>{item.so_luong_ban}</td>
                                            <td>{(item.don_Giá_ban || 0).toLocaleString('vi-VN')} VND</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {showOrderForm && (
                <div className="admin-modal">
                    <div className="admin-modal__backdrop" onClick={closeOrderForm}></div>
                    <div className="admin-modal__content">
                        <div className="admin-modal__header">
                            <h5>Cập nhật đơn hàng #{orderEditingId}</h5>
                            <button className="admin-modal__close" type="button" onClick={closeOrderForm}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleOrderUpdate}>
                            {orderForm.status === deliveredStatus && (
                                <div className="alert alert-info">
                                    Đơn hàng đã giao. Không thể chỉnh sửa nữa.
                                </div>
                            )}
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Trạng thái</label>
                                    <select
                                        className="form-control"
                                        name="status"
                                        value={orderForm.status}
                                        onChange={handleOrderChange}
                                        disabled={orderForm.status === deliveredStatus}
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Thanh toán</label>
                                    <select
                                        className="form-control"
                                        name="phuong_thuc_thanh_toan"
                                        value={orderForm.phuong_thuc_thanh_toan}
                                        onChange={handleOrderChange}
                                        disabled={orderForm.status === deliveredStatus}
                                    >
                                        <option value={0}>Giao hàng (COD)</option>
                                        <option value={1}>Chuyển khoản</option>
                                        <option value={2}>Ví điện tử</option>
                                        <option value={3}>Thẻ ngân hàng</option>
                                    </select>
                                </div>
                                <div className="col-md-12 form-group">
                                    <label>Ghi chú</label>
                                    <input className="form-control" name="ghi_chu" value={orderForm.ghi_chu} onChange={handleOrderChange} disabled={orderForm.status === deliveredStatus} />
                                </div>
                            </div>
                            <div className="admin-form-actions">
                                <button className="btn btn-primary" type="submit" disabled={orderForm.status === deliveredStatus}>
                                    Lưu
                                </button>
                                <button className="btn btn-outline-secondary" type="button" onClick={closeOrderForm}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCategoryForm && (
                <div className="admin-modal">
                    <div className="admin-modal__backdrop" onClick={closeCategoryForm}></div>
                    <div className="admin-modal__content">
                        <div className="admin-modal__header">
                            <h5>{categoryEditingId ? 'Cập nhật danh mục' : 'Thêm danh mục'}</h5>
                            <button className="admin-modal__close" type="button" onClick={closeCategoryForm}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCategorySubmit}>
                            {categoryError && (
                                <div className="alert alert-danger">{categoryError}</div>
                            )}
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Mã danh mục</label>
                                    <input
                                        className="form-control"
                                        name="ma_loai"
                                        value={categoryForm.ma_loai}
                                        onChange={handleCategoryChange}
                                        required
                                        disabled={!!categoryEditingId}
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Tên danh mục</label>
                                    <input
                                        className="form-control"
                                        name="loai"
                                        value={categoryForm.loai}
                                        onChange={handleCategoryChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="admin-form-actions">
                                <button className="btn btn-primary" type="submit">
                                    {categoryEditingId ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                                <button className="btn btn-outline-secondary" type="button" onClick={closeCategoryForm}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUserForm && (
                <div className="admin-modal">
                    <div className="admin-modal__backdrop" onClick={closeUserForm}></div>
                    <div className="admin-modal__content">
                        <div className="admin-modal__header">
                            <h5>{userEditingId ? 'Cập nhật người dùng' : 'Thêm người dùng'}</h5>
                            <button className="admin-modal__close" type="button" onClick={closeUserForm}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleUserSubmit}>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Email</label>
                                    <input className="form-control" name="username" value={userForm.username} onChange={handleUserChange} required disabled={!!userEditingId} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Mật khẩu {userEditingId ? '(bỏ trống nếu không đổi)' : ''}</label>
                                    <input className="form-control" name="password" type="password" value={userForm.password} onChange={handleUserChange} required={!userEditingId} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Vai trò</label>
                                    <select className="form-control" name="loai_user" value={userForm.loai_user} onChange={handleUserChange}>
                                        <option value={0}>Quản trị</option>
                                        <option value={1}>Khách hàng</option>
                                    </select>
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Tên khách hàng</label>
                                    <input className="form-control" name="ten_khach_hang" value={userForm.ten_khach_hang} onChange={handleUserChange} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Số điện thoại</label>
                                    <input className="form-control" name="so_dien_thoai" value={userForm.so_dien_thoai} onChange={handleUserChange} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Địa chỉ</label>
                                    <input className="form-control" name="dia_chi" value={userForm.dia_chi} onChange={handleUserChange} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label>Ghi chú</label>
                                    <input className="form-control" name="ghi_chu" value={userForm.ghi_chu} onChange={handleUserChange} />
                                </div>
                            </div>
                            <div className="admin-form-actions">
                                <button className="btn btn-primary" type="submit">
                                    {userEditingId ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                                <button className="btn btn-outline-secondary" type="button" onClick={closeUserForm}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {productDetailModal.open && (
                <div className="admin-modal">
                    <div className="admin-modal__backdrop" onClick={closeProductDetail}></div>
                    <div className="admin-modal__content">
                        <div className="admin-modal__header">
                            <h5>Chi tiết sản phẩm</h5>
                            <button className="admin-modal__close" type="button" onClick={closeProductDetail}>
                                ×
                            </button>
                        </div>
                        <div className="row">
                            <div className="col-md-5">
                                <div className="admin-image-preview" style={{ width: '100%', height: 260 }}>
                                    {productDetailModal.product?.anh_dai_dien ? (
                                        <img src={`/assets/img/ImageCamera/${productDetailModal.product.anh_dai_dien}`} alt="main" />
                                    ) : (
                                        <div className="text-muted">Chưa có ảnh</div>
                                    )}
                                </div>
                                {productDetailModal.product?.anh_sps?.length ? (
                                    <div className="admin-image-grid">
                                        {productDetailModal.product.anh_sps.map((img) => (
                                            <img key={img.ten_file_anh} src={`/assets/img/ImageCamera/${img.ten_file_anh}`} alt="detail" />
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                            <div className="col-md-7">
                                <div className="admin-order-summary">
                                    <div><strong>Mã SP:</strong> {productDetailModal.product?.ma_sp}</div>
                                    <div><strong>Tên SP:</strong> {productDetailModal.product?.ten_sp}</div>
                                    <div><strong>Giá:</strong> {(productDetailModal.product?.gia_lon_nhat || 0).toLocaleString('vi-VN')} VND</div>
                                    <div><strong>Hãng:</strong> {productDetailModal.product?.hang_sx?.hang_sx || '-'}</div>
                                    <div><strong>Danh mục:</strong> {productDetailModal.product?.loai_sp?.loai || '-'}</div>
                                    <div><strong>Chất liệu:</strong> {productDetailModal.product?.chat_lieu?.chat_lieu || '-'}</div>
                                    <div><strong>Xuất xứ:</strong> {productDetailModal.product?.quoc_gia?.ten_nuoc || '-'}</div>
                                    <div><strong>Model:</strong> {productDetailModal.product?.model || '-'}</div>
                                    <div><strong>Bảo hành:</strong> {productDetailModal.product?.thoi_gian_bao_hanh ? `${productDetailModal.product.thoi_gian_bao_hanh} tháng` : '-'}</div>
                                </div>
                                {productDetailModal.product?.gioi_thieu_sp && (
                                    <div className="mt-3">
                                        <strong>Giới thiệu:</strong>
                                        <p className="mb-0 mt-2">{productDetailModal.product.gioi_thieu_sp}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;








