import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { notifyError, notifyInfo, notifySuccess } from '../utils/notify';

const Checkout = () => {
    const { items, total, clear } = useCart();
    const { user } = useAuth();
    const [form, setForm] = useState({
        ten_khach_hang: '',
        ngay_sinh: '',
        so_dien_thoai: '',
        dia_chi: '',
        ghi_chu: '',
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (items.length === 0) {
            notifyInfo('Bạn chưa có sản phẩm trong giỏ hàng.');
            return;
        }
        const payload = {
            order: {
                tong_tien_hd: total + 10000,
                phuong_thuc_thanh_toan: 0,
                ghi_chu: form.ghi_chu,
                status: 0,
            },
            items: items.map((item) => ({
                product_id: item.product.ma_sp,
                quantity: item.quantity,
            })),
            customer: user
                ? {
                      ten_khach_hang: form.ten_khach_hang,
                      ngay_sinh: form.ngay_sinh || null,
                      so_dien_thoai: form.so_dien_thoai,
                      dia_chi: form.dia_chi,
                  }
                : {
                      ten_khach_hang: form.ten_khach_hang,
                      ngay_sinh: form.ngay_sinh || null,
                      so_dien_thoai: form.so_dien_thoai,
                      dia_chi: form.dia_chi,
                  },
        };

        try {
            await api.post('/orders', payload);
            clear();
            notifySuccess('Đơn hàng đã được ghi nhận.');
        } catch (err) {
            notifyError('Không thể tạo đơn hàng.');
        }
    };

    return (
        <div className="container-fluid">
            <div className="row px-xl-5">
                <div className="col-lg-8">
                    <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Thông tin thanh toán</span></h5>
                    <div className="bg-light p-30 mb-5">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Họ tên</label>
                                    <input className="form-control" name="ten_khach_hang" type="text" value={form.ten_khach_hang} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Ngày sinh</label>
                                    <input className="form-control" name="ngay_sinh" type="date" value={form.ngay_sinh} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Số điện thoại</label>
                                    <input className="form-control" name="so_dien_thoai" type="text" value={form.so_dien_thoai} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Địa chỉ</label>
                                    <input className="form-control" name="dia_chi" type="text" value={form.dia_chi} onChange={handleChange} required />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label>Ghi chú</label>
                                    <textarea className="form-control" name="ghi_chu" value={form.ghi_chu} onChange={handleChange}></textarea>
                                </div>
                            </div>
                            <button className="btn btn-block btn-primary font-weight-bold py-3" type="submit">Đặt hàng</button>
                        </form>
                    </div>
                </div>
                <div className="col-lg-4">
                    <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Tổng đơn hàng</span></h5>
                    <div className="bg-light p-30 mb-5">
                        <div className="border-bottom">
                            {items.map((item) => (
                                <div key={item.product.ma_sp} className="d-flex justify-content-between">
                                    <p>{item.product.ten_sp}</p>
                                    <p>{((item.product.gia_lon_nhat || 0) * item.quantity).toLocaleString('vi-VN')} VND</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-bottom pt-3 pb-2">
                            <div className="d-flex justify-content-between mb-3">
                                <h6>Tạm tính</h6>
                                <h6>{total.toLocaleString('vi-VN')} VND</h6>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h6 className="font-weight-medium">Phí vận chuyển</h6>
                                <h6 className="font-weight-medium">10.000 VND</h6>
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="d-flex justify-content-between mt-2">
                                <h5>Tổng cộng</h5>
                                <h5>{(total + 10000).toLocaleString('vi-VN')} VND</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
