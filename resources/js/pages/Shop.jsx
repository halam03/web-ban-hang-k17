import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

const priceOptions = [
    { id: 'all', label: 'Tất cả', value: 'all' },
    { id: 'price-1', label: '0 - 10.000.000 VND', value: '0-10000000' },
    { id: 'price-2', label: '10.000.000 - 30.000.000 VND', value: '10000000-30000000' },
    { id: 'price-3', label: '30.000.000 - 50.000.000 VND', value: '30000000-50000000' },
    { id: 'price-4', label: '50.000.000 - 70.000.000 VND', value: '50000000-70000000' },
    { id: 'price-5', label: '70.000.000 - 100.000.000 VND', value: '70000000-100000000' },
    { id: 'price-6', label: '> 100.000.000 VND', value: '100000000-1000000000' },
];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page') || 1);
    const category = searchParams.get('category') || '';

    const queryParams = useMemo(() => {
        const params = { page, per_page: 8 };
        if (search) params.search = search;
        if (category) params.category = category;
        if (selectedPrices.length > 0) params.price_ranges = selectedPrices;
        return params;
    }, [page, search, category, selectedPrices]);

    useEffect(() => {
        api.get('/products', { params: queryParams }).then((res) => {
            setProducts(res.data.data || []);
            setPagination({ current_page: res.data.current_page, last_page: res.data.last_page });
        });
    }, [queryParams]);

    useEffect(() => {
        api.get('/meta/categories').then((res) => {
            setCategories(res.data || []);
        });
    }, []);

    useEffect(() => {
        setSelectedCategory(category);
    }, [category]);

    const togglePrice = (value) => {
        if (value === 'all') {
            setSelectedPrices(['all']);
            return;
        }
        setSelectedPrices((prev) => {
            const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev.filter((v) => v !== 'all'), value];
            return next;
        });
    };

    const changeCategory = (value) => {
        setSelectedCategory(value);
        const params = {};
        if (search) params.search = search;
        if (value) params.category = value;
        setSearchParams(params);
    };

    const changePage = (nextPage) => {
        const params = { page: String(nextPage) };
        if (search) params.search = search;
        if (category) params.category = category;
        setSearchParams(params);
    };

    return (
        <div className="container-fluid">
            <div className="row px-xl-5">
                <div className="col-12">
                    <nav className="breadcrumb bg-light mb-30">
                        <span className="breadcrumb-item text-dark">Trang chủ</span>
                        <span className="breadcrumb-item text-dark">Sản phẩm</span>
                        <span className="breadcrumb-item active">Danh sách</span>
                    </nav>
                </div>
            </div>
            <div className="row px-xl-5">
                <div className="col-lg-3 col-md-4">
                    <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Danh mục</span></h5>
                    <div className="bg-light p-4 mb-30">
                        <div className="custom-control custom-radio mb-3">
                            <input
                                type="radio"
                                className="custom-control-input"
                                id="cat-all"
                                name="category"
                                checked={!selectedCategory}
                                onChange={() => changeCategory('')}
                            />
                            <label className="custom-control-label" htmlFor="cat-all">Tất cả</label>
                        </div>
                        {categories.map((item) => (
                            <div key={item.ma_loai} className="custom-control custom-radio mb-3">
                                <input
                                    type="radio"
                                    className="custom-control-input"
                                    id={`cat-${item.ma_loai}`}
                                    name="category"
                                    checked={selectedCategory === item.ma_loai}
                                    onChange={() => changeCategory(item.ma_loai)}
                                />
                                <label className="custom-control-label" htmlFor={`cat-${item.ma_loai}`}>
                                    {item.loai} ({item.danh_muc_sps_count ?? 0})
                                </label>
                            </div>
                        ))}
                    </div>
                    <h5 className="section-title position-relative text-uppercase mb-3"><span className="bg-secondary pr-3">Lọc theo giá</span></h5>
                    <div className="bg-light p-4 mb-30">
                        {priceOptions.map((option) => (
                            <div key={option.id} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={option.id}
                                    checked={selectedPrices.includes(option.value)}
                                    onChange={() => togglePrice(option.value)}
                                />
                                <label className="custom-control-label" htmlFor={option.id}>{option.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-lg-9 col-md-8">
                    <div className="row pb-3">
                        {products.map((product) => (
                            <ProductCard key={product.ma_sp} product={product} />
                        ))}
                        <div className="col-12">
                            <nav>
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" type="button" onClick={() => changePage(pagination.current_page - 1)}>Trước</button>
                                    </li>
                                    <li className="page-item active"><span className="page-link">{pagination.current_page}</span></li>
                                    <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                        <button className="page-link" type="button" onClick={() => changePage(pagination.current_page + 1)}>Sau</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
