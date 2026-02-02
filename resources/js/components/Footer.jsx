const Footer = () => (
    <div className="container-fluid bg-dark text-secondary mt-5 pt-5">
        <div className="row px-xl-5 pt-5">
            <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
                <h5 className="text-secondary text-uppercase mb-4">Liên hệ</h5>
                <p className="mb-4">Camera Shop - Thiết bị nhiếp ảnh chính hãng.</p>
                <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3"></i>123 Street, Hanoi, VN</p>
                <p className="mb-2"><i className="fa fa-envelope text-primary mr-3"></i>info@camera.shop</p>
                <p className="mb-0"><i className="fa fa-phone-alt text-primary mr-3"></i>+012 345 6789</p>
            </div>
            <div className="col-lg-8 col-md-12">
                <div className="row">
                    <div className="col-md-4 mb-5">
                        <h5 className="text-secondary text-uppercase mb-4">Danh mục</h5>
                        <div className="d-flex flex-column justify-content-start">
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Trang chủ</span>
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Sản phẩm</span>
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Chi tiết</span>
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Giỏ hàng</span>
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Thanh toán</span>
                            <span className="text-secondary"><i className="fa fa-angle-right mr-2"></i>Liên hệ</span>
                        </div>
                    </div>
                    <div className="col-md-4 mb-5">
                        <h5 className="text-secondary text-uppercase mb-4">Tài khoản</h5>
                        <div className="d-flex flex-column justify-content-start">
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Trang chủ</span>
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Sản phẩm</span>
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Chi tiết</span>
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Giỏ hàng</span>
                            <span className="text-secondary mb-2"><i className="fa fa-angle-right mr-2"></i>Thanh toán</span>
                            <span className="text-secondary"><i className="fa fa-angle-right mr-2"></i>Liên hệ</span>
                        </div>
                    </div>
                    <div className="col-md-4 mb-5">
                        <h5 className="text-secondary text-uppercase mb-4">Đăng ký nhận tin</h5>
                        <p>Nhận thông tin ưu đãi mới.</p>
                        <form>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Email" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">Đăng ký</button>
                                </div>
                            </div>
                        </form>
                        <h6 className="text-secondary text-uppercase mt-4 mb-3">Kết nối</h6>
                        <div className="d-flex">
                            <span className="btn btn-primary btn-square mr-2"><i className="fab fa-twitter"></i></span>
                            <span className="btn btn-primary btn-square mr-2"><i className="fab fa-facebook-f"></i></span>
                            <span className="btn btn-primary btn-square mr-2"><i className="fab fa-linkedin-in"></i></span>
                            <span className="btn btn-primary btn-square"><i className="fab fa-instagram"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row border-top mx-xl-5 py-4" style={{ borderColor: 'rgba(256, 256, 256, .1)' }}>
            <div className="col-md-6 px-xl-0">
                <p className="mb-md-0 text-center text-md-left text-secondary">
                    © Camera Shop. All Rights Reserved.
                </p>
            </div>
            <div className="col-md-6 px-xl-0 text-center text-md-right">
                <img className="img-fluid" src="/assets/Camera/img/payments.png" alt="payments" />
            </div>
        </div>
    </div>
);

export default Footer;
