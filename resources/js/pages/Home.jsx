import { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get('/products', { params: { per_page: 8 } }).then((res) => {
            setProducts(res.data.data || []);
        });
        api.get('/meta/categories').then((res) => {
            setCategories(res.data || []);
        });
    }, []);

    return (
        <>
            <div className="container-fluid mb-3">
                <div className="row px-xl-5">
                    <div className="col-lg-8">
                        <div id="header-carousel" className="carousel slide carousel-fade mb-30 mb-lg-0" data-ride="carousel">
                            <ol className="carousel-indicators">
                                <li data-target="#header-carousel" data-slide-to="0" className="active"></li>
                                <li data-target="#header-carousel" data-slide-to="1"></li>
                                <li data-target="#header-carousel" data-slide-to="2"></li>
                            </ol>
                            <div className="carousel-inner">
                                <div className="carousel-item position-relative active" style={{ height: 430 }}>
                                    <img className="position-absolute w-100 h-100" src="/assets/img/ImageCamera/banner1.jpeg" style={{ objectFit: 'cover' }} />
                                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                        <div className="p-3" style={{ maxWidth: 700 }}>
                                            <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Máy film</h1>
                                            <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Khám phá dòng máy film cổ điển.</p>
                                            <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="/shop">Mua ngay</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item position-relative" style={{ height: 430 }}>
                                    <img className="position-absolute w-100 h-100" src="/assets/img/ImageCamera/banner2.jpg" style={{ objectFit: 'cover' }} />
                                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                        <div className="p-3" style={{ maxWidth: 700 }}>
                                            <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Máy chuyên nghiệp</h1>
                                            <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Thiết bị chuyên nghiệp cho studio.</p>
                                            <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="/shop">Mua ngay</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item position-relative" style={{ height: 430 }}>
                                    <img className="position-absolute w-100 h-100" src="/assets/img/ImageCamera/banner3.jpg" style={{ objectFit: 'cover' }} />
                                    <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                                        <div className="p-3" style={{ maxWidth: 700 }}>
                                            <h1 className="display-4 text-white mb-3 animate__animated animate__fadeInDown">Sản phẩm mới</h1>
                                            <p className="mx-md-5 px-5 animate__animated animate__bounceIn">Cập nhật sản phẩm mới nhất.</p>
                                            <a className="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="/shop">Mua ngay</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="product-offer mb-30" style={{ height: 200 }}>
                            <img className="img-fluid" src="/assets/img/ImageCamera/banner2.jpg" alt="offer" />
                            <div className="offer-text">
                                <h6 className="text-white text-uppercase">Giảm 20%</h6>
                                <h3 className="text-white mb-3">Ưu đãi đặc biệt</h3>
                                <a href="/shop" className="btn btn-primary">Mua ngay</a>
                            </div>
                        </div>
                        <div className="product-offer mb-30" style={{ height: 200 }}>
                            <img className="img-fluid" src="/assets/img/ImageCamera/banner3.jpg" alt="offer" />
                            <div className="offer-text">
                                <h6 className="text-white text-uppercase">Giảm 20%</h6>
                                <h3 className="text-white mb-3">Ưu đãi đặc biệt</h3>
                                <a href="/shop" className="btn btn-primary">Mua ngay</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid pt-5">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Danh mục</span></h2>
                <div className="row px-xl-5 pb-3">
                    {categories.map((category, index) => {
                        const images = ['/assets/img/ImageCamera/banner1.jpeg', '/assets/img/ImageCamera/banner2.jpg', '/assets/img/ImageCamera/banner3.jpg'];
                        const image = images[index % images.length];
                        return (
                            <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={category.ma_loai}>
                                <a className="cat-item img-zoom d-flex align-items-center mb-4" href={`/shop?category=${category.ma_loai}`}>
                                    <div className="overflow-hidden" style={{ width: 100, height: 100 }}>
                                        <img className="img-fluid" src={image} alt={category.loai} />
                                    </div>
                                    <div className="flex-fill pl-3">
                                        <h6>{category.loai}</h6>
                                        <small className="text-body">{category.danh_muc_sps_count ?? 0} sản phẩm</small>
                                    </div>
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="container-fluid pt-5 pb-3">
                <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">Sản phẩm nổi bật</span></h2>
                <div className="row px-xl-5">
                    {products.map((product) => (
                        <ProductCard key={product.ma_sp} product={product} />
                    ))}
                </div>
            </div>

            <div className="container-fluid pt-5 pb-3">
                <div className="row px-xl-5">
                    <div className="col-md-6">
                        <div className="product-offer mb-30" style={{ height: 300 }}>
                            <img className="img-fluid" src="/assets/img/ImageCamera/MinoltaXD-11SLR01.jpg" alt="offer" />
                            <div className="offer-text">
                                <h6 className="text-white text-uppercase">Giảm 20%</h6>
                                <h3 className="text-white mb-3">Ưu đãi đặc biệt</h3>
                                <a href="/shop" className="btn btn-primary">Mua ngay</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="product-offer mb-30" style={{ height: 300 }}>
                            <img className="img-fluid" src="/assets/img/ImageCamera/FujiFilmGFX10001.jpg" alt="offer" />
                            <div className="offer-text">
                                <h6 className="text-white text-uppercase">Giảm 20%</h6>
                                <h3 className="text-white mb-3">Ưu đãi đặc biệt</h3>
                                <a href="/shop" className="btn btn-primary">Mua ngay</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
