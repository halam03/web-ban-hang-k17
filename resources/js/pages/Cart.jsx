import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { confirmDelete, notifySuccess } from '../utils/notify';

const Cart = () => {
    const { items, updateItem, total, clear } = useCart();

    const handleClear = async () => {
        if (items.length === 0) return;
        const ok = await confirmDelete('Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?');
        if (!ok) return;
        clear();
        notifySuccess('Đã xóa giỏ hàng.');
    };

    return (
        <div className="container-fluid">
            <div className="row px-xl-5">
                <div className="col-lg-8 table-responsive mb-5">
                    <table className="table table-light table-borderless table-hover text-center mb-0">
                        <thead className="thead-dark">
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Tổng</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle">
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="4">Giỏ hàng trống</td>
                                </tr>
                            )}
                            {items.map((item) => (
                                <tr key={item.product.ma_sp}>
                                    <td className="align-middle">
                                        <img src={`/assets/img/ImageCamera/${item.product.anh_dai_dien}`} alt="" style={{ width: 50 }} />
                                        <span className="ml-2">{item.product.ten_sp}</span>
                                    </td>
                                    <td className="align-middle">{(item.product.gia_lon_nhat || 0).toLocaleString('vi-VN')} VND</td>
                                    <td className="align-middle">
                                        <div className="input-group quantity mx-auto" style={{ width: 100 }}>
                                            <div className="input-group-btn">
                                                <button className="btn btn-sm btn-primary btn-minus" type="button" onClick={() => updateItem(item.product.ma_sp, Math.max(item.quantity - 1, 1))}>
                                                    <i className="fa fa-minus"></i>
                                                </button>
                                            </div>
                                            <input type="text" className="form-control form-control-sm bg-secondary border-0 text-center" value={item.quantity} readOnly />
                                            <div className="input-group-btn">
                                                <button className="btn btn-sm btn-primary btn-plus" type="button" onClick={() => updateItem(item.product.ma_sp, item.quantity + 1)}>
                                                    <i className="fa fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="align-middle">{((item.product.gia_lon_nhat || 0) * item.quantity).toLocaleString('vi-VN')} VND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-lg-4">
                    <div className="bg-light p-30 mb-5">
                        <div className="border-bottom pb-2">
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
                            <Link className="btn btn-block btn-primary font-weight-bold my-3 py-3" to="/checkout">
                                Tiếp tục thanh toán
                            </Link>
                            <button className="btn btn-block btn-outline-secondary" type="button" onClick={clear}>Xóa giỏ hàng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
