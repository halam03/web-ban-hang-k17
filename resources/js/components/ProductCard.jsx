import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addItem } = useCart();

    return (
        <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
            <div className="product-item bg-light mb-4">
                <div className="product-img position-relative overflow-hidden">
                    <img className="img-fluid w-100" src={`/assets/img/ImageCamera/${product.anh_dai_dien}`} alt={product.ten_sp} />
                    <div className="product-action">
                        <button className="btn btn-outline-dark btn-square" type="button" onClick={() => addItem(product)}>
                            <i className="fa fa-shopping-cart"></i>
                        </button>
                        <Link className="btn btn-outline-dark btn-square" to={`/product/${product.ma_sp}`}>
                            <i className="fa fa-search"></i>
                        </Link>
                    </div>
                </div>
                <div className="text-center py-4">
                    <Link className="h6 text-decoration-none text-truncate" to={`/product/${product.ma_sp}`}>{product.ten_sp}</Link>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                        <h5>{(product.gia_lon_nhat || 0).toLocaleString('vi-VN')} VND</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
