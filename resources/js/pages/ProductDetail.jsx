import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        api.get(`/products/${id}`).then((res) => {
            setProduct(res.data);
            const firstImg = res.data.anh_sps?.[0]?.ten_file_anh || res.data.anh_dai_dien || '';
            setActiveImage(firstImg);
        });
    }, [id]);

    const handleQuantityChange = (value) => {
        const next = Math.max(1, value);
        setQuantity(next);
    };

    if (!product) {
        return <div className="container-fluid px-xl-5">Đang tải...</div>;
    }

    return (
        <div className="container-fluid pb-5 product-detail">
            <div className="row px-xl-5">
                <div className="col-lg-6 mb-30">
                    <div className="product-detail__image-card">
                        {activeImage ? (
                            <img className="product-detail__image" src={`/assets/img/ImageCamera/${activeImage}`} alt={product.ten_sp} />
                        ) : (
                            <div className="text-center text-muted py-5">Chưa có ảnh</div>
                        )}
                    </div>
                    <div className="product-detail__thumbs">
                        {(product.anh_sps || []).map((img) => (
                            <button
                                key={img.ten_file_anh}
                                className={`product-detail__thumb ${activeImage === img.ten_file_anh ? 'is-active' : ''}`}
                                onClick={() => setActiveImage(img.ten_file_anh)}
                                type="button"
                            >
                                <img src={`/assets/img/ImageCamera/${img.ten_file_anh}`} alt="thumb" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-lg-6 h-auto mb-30">
                    <div className="product-detail__info">
                        <h2 className="product-detail__title">{product.ten_sp}</h2>
                        <div className="product-detail__rating">
                            <div className="product-detail__stars">
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star-o"></i>
                            </div>
                            <span className="product-detail__reviews">(99 đánh giá)</span>
                        </div>
                        <div className="product-detail__price">{(product.gia_lon_nhat || 0).toLocaleString('vi-VN')} VND</div>
                        <p className="product-detail__desc">{product.gioi_thieu_sp}</p>
                        <div className="product-detail__actions">
                            <div className="product-detail__qty">
                                <button type="button" onClick={() => handleQuantityChange(quantity - 1)}>-</button>
                                <input
                                    type="text"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(Number(e.target.value) || 1)}
                                />
                                <button type="button" onClick={() => handleQuantityChange(quantity + 1)}>+</button>
                            </div>
                            <button className="product-detail__add" type="button" onClick={() => addItem(product, quantity)}>
                                <i className="fa fa-shopping-cart mr-2"></i> Add To Cart
                            </button>
                        </div>
                        <div className="product-detail__share">
                            <span>Share on:</span>
                            <div className="product-detail__share-icons">
                                <i className="fab fa-facebook-f"></i>
                                <i className="fab fa-twitter"></i>
                                <i className="fab fa-linkedin-in"></i>
                                <i className="fab fa-instagram"></i>
                            </div>
                        </div>
                        <div className="product-detail__meta">
                            {[
                                { label: 'Hãng', value: product.hang_sx?.hang_sx },
                                { label: 'Loại', value: product.loai_sp?.loai },
                                { label: 'Chất liệu', value: product.chat_lieu?.chat_lieu },
                                { label: 'Xuất xứ', value: product.quoc_gia?.ten_nuoc },
                                { label: 'Model', value: product.model },
                                { label: 'Bảo hành', value: product.thoi_gian_bao_hanh ? `${product.thoi_gian_bao_hanh} tháng` : '' },
                            ]
                                .filter((item) => item.value)
                                .map((item) => (
                                    <div key={item.label} className="product-detail__meta-row">
                                        <span>{item.label}:</span>
                                        <strong>{item.value}</strong>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
