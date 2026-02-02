-- MySQL schema + seed for QLBanMayAnh (ASCII content)
CREATE DATABASE IF NOT EXISTS qlbanmayanh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qlbanmayanh;

DROP TABLE IF EXISTS t_chi_tiet_hdb;
DROP TABLE IF EXISTS t_hoa_don_ban;
DROP TABLE IF EXISTS t_anh_sp;
DROP TABLE IF EXISTS t_danh_muc_sp;
DROP TABLE IF EXISTS t_loai_dt;
DROP TABLE IF EXISTS t_loai_sp;
DROP TABLE IF EXISTS t_quoc_gia;
DROP TABLE IF EXISTS t_hang_sx;
DROP TABLE IF EXISTS t_chat_lieu;
DROP TABLE IF EXISTS t_khach_hang;
DROP TABLE IF EXISTS t_user;

CREATE TABLE t_user (
    username VARCHAR(100) PRIMARY KEY,
    password VARCHAR(256) NOT NULL,
    loai_user TINYINT NULL
) ENGINE=InnoDB;

CREATE TABLE t_khach_hang (
    ma_khach_hang VARCHAR(25) PRIMARY KEY,
    username VARCHAR(100) NULL,
    ten_khach_hang VARCHAR(100) NULL,
    ngay_sinh DATE NULL,
    so_dien_thoai VARCHAR(15) NULL,
    dia_chi VARCHAR(150) NULL,
    loai_khach_hang TINYINT NULL,
    anh_dai_dien VARCHAR(100) NULL,
    ghi_chu VARCHAR(100) NULL,
    CONSTRAINT fk_khachhang_user FOREIGN KEY (username) REFERENCES t_user(username) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE t_chat_lieu (
    ma_chat_lieu VARCHAR(25) PRIMARY KEY,
    chat_lieu VARCHAR(150) NULL
) ENGINE=InnoDB;

CREATE TABLE t_hang_sx (
    ma_hang_sx VARCHAR(25) PRIMARY KEY,
    hang_sx VARCHAR(100) NULL,
    ma_nuoc_thuong_hieu VARCHAR(25) NULL
) ENGINE=InnoDB;

CREATE TABLE t_quoc_gia (
    ma_nuoc VARCHAR(25) PRIMARY KEY,
    ten_nuoc VARCHAR(100) NULL
) ENGINE=InnoDB;

CREATE TABLE t_loai_sp (
    ma_loai VARCHAR(25) PRIMARY KEY,
    loai VARCHAR(100) NULL
) ENGINE=InnoDB;

CREATE TABLE t_loai_dt (
    ma_dt VARCHAR(25) PRIMARY KEY,
    ten_loai VARCHAR(100) NULL
) ENGINE=InnoDB;

CREATE TABLE t_danh_muc_sp (
    ma_sp VARCHAR(50) PRIMARY KEY,
    ten_sp VARCHAR(150) NULL,
    ma_chat_lieu VARCHAR(25) NULL,
    model VARCHAR(55) NULL,
    ma_hang_sx VARCHAR(25) NULL,
    ma_nuoc_sx VARCHAR(25) NULL,
    ma_dac_tinh VARCHAR(25) NULL,
    website VARCHAR(155) NULL,
    thoi_gian_bao_hanh FLOAT NULL,
    gioi_thieu_sp TEXT NULL,
    chiet_khau FLOAT NULL,
    ma_loai VARCHAR(25) NULL,
    ma_dt VARCHAR(25) NULL,
    anh_dai_dien VARCHAR(100) NULL,
    gia_nho_nhat DECIMAL(18,2) NULL,
    gia_lon_nhat DECIMAL(18,2) NULL,
    CONSTRAINT fk_sp_chat_lieu FOREIGN KEY (ma_chat_lieu) REFERENCES t_chat_lieu(ma_chat_lieu) ON DELETE SET NULL,
    CONSTRAINT fk_sp_hang_sx FOREIGN KEY (ma_hang_sx) REFERENCES t_hang_sx(ma_hang_sx) ON DELETE SET NULL,
    CONSTRAINT fk_sp_quoc_gia FOREIGN KEY (ma_nuoc_sx) REFERENCES t_quoc_gia(ma_nuoc) ON DELETE SET NULL,
    CONSTRAINT fk_sp_loai FOREIGN KEY (ma_loai) REFERENCES t_loai_sp(ma_loai) ON DELETE SET NULL,
    CONSTRAINT fk_sp_dt FOREIGN KEY (ma_dt) REFERENCES t_loai_dt(ma_dt) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE t_anh_sp (
    ma_sp VARCHAR(50) NOT NULL,
    ten_file_anh VARCHAR(100) NOT NULL,
    vi_tri SMALLINT NULL,
    PRIMARY KEY (ma_sp, ten_file_anh),
    CONSTRAINT fk_anh_sp FOREIGN KEY (ma_sp) REFERENCES t_danh_muc_sp(ma_sp) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE t_hoa_don_ban (
    ma_hoa_don INT PRIMARY KEY,
    ngay_hoa_don VARCHAR(255) NULL,
    ma_khach_hang VARCHAR(25) NULL,
    tong_tien_hd DECIMAL(18,2) NULL,
    giam_gia_hd FLOAT NULL,
    phuong_thuc_thanh_toan TINYINT NULL,
    ma_so_thue VARCHAR(100) NULL,
    thong_tin_thue VARCHAR(250) NULL,
    ghi_chu VARCHAR(100) NULL,
    status INT NULL,
    CONSTRAINT fk_hdb_khachhang FOREIGN KEY (ma_khach_hang) REFERENCES t_khach_hang(ma_khach_hang) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE t_chi_tiet_hdb (
    id INT PRIMARY KEY,
    ma_hoa_don INT NOT NULL,
    ma_sp VARCHAR(50) NOT NULL,
    so_luong_ban INT NULL,
    don_gia_ban DECIMAL(18,2) NULL,
    giam_gia FLOAT NULL,
    ghi_chu VARCHAR(100) NULL,
    CONSTRAINT fk_cthdb_hdb FOREIGN KEY (ma_hoa_don) REFERENCES t_hoa_don_ban(ma_hoa_don) ON DELETE CASCADE,
    CONSTRAINT fk_cthdb_sp FOREIGN KEY (ma_sp) REFERENCES t_danh_muc_sp(ma_sp) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed data (from Laravel seeder)
INSERT INTO t_user (username, password, loai_user) VALUES
('admin@camera.shop', '\$2y\$10\$gm5lfXP/xJKFetaJq5aOgOgZM/xfEsFVjmTmprTy6vbkt4ePr8e4O', 0),
('user@camera.shop', '\$2y\$10\$itumG8tadPwUZqxQ2HTiR\.nF/8IlYLYQ/lnO9G3aq3TWF8DIaFg5q', 1);

INSERT INTO t_chat_lieu (ma_chat_lieu, chat_lieu) VALUES
('n', 'Nhua cung'),
('t', 'Titan'),
('al', 'Nhom');

INSERT INTO t_quoc_gia (ma_nuoc, ten_nuoc) VALUES
('jap', 'Nhat'),
('my', 'My');

INSERT INTO t_hang_sx (ma_hang_sx, hang_sx, ma_nuoc_thuong_hieu) VALUES
('fu', 'FujiFilm', 'jap'),
('ca', 'Canon', 'jap'),
('mi', 'Minolta', 'jap'),
('so', 'Sony', 'jap'),
('ni', 'Nikon', 'jap');

INSERT INTO t_loai_sp (ma_loai, loai) VALUES
('fi', 'May film'),
('pro', 'May anh chuyen nghiep');

INSERT INTO t_loai_dt (ma_dt, ten_loai) VALUES
('dl', 'Du lich'),
('dn', 'Doanh nhan'),
('ls', 'Lich su'),
('nd', 'Nang dong');

INSERT INTO t_danh_muc_sp (ma_sp, ten_sp, ma_chat_lieu, ma_hang_sx, ma_nuoc_sx, gioi_thieu_sp, ma_loai, ma_dt, anh_dai_dien, gia_lon_nhat) VALUES
('FujiFilmGFX100', 'May anh FujiFilm GFX100', 'n', 'fu', 'jap', 'GFX100 ket hop nhieu thap ky kinh nghiem de tao nen mot may anh medium format.', 'fi', 'nd', 'FujiFilmGFX10001.jpg', 120000000),
('FujiFilmGFX100S', 'May anh FujiFilm GFX100S', 't', 'fu', 'jap', 'GFX100S ket hop do phan giai cao va than may nhe.', 'fi', 'nd', 'FujiFilmGFX100S01.jpg', 120000000),
('CanonPowerShotG7XMarkIII', 'May anh Canon PowerShot G7X Mark III', 't', 'ca', 'jap', 'Cam bien 1.0 inch va ong kinh f/1.8-2.8 cho chat luong anh tot.', 'pro', 'nd', 'CanonPowerShotG7XMarkIII01.png', 81200000),
('SonyAlphaILCE-7RM5', 'May anh Sony Alpha ILCE-7RM5', 'n', 'so', 'jap', 'A7R V so huu cam bien 61MP va bo xu ly Bionz XR.', 'pro', 'nd', 'SonyAlphaILCE-7RM501.jpg', 565000000),
('NikonZ6II', 'May anh Nikon Z6 II', 'al', 'ni', 'jap', 'Z6 II can bang giua toc do va hieu nang thieu sang.', 'fi', 'nd', 'NikonZ6II01.jpg', 125000000),
('MinoltaXD-11SLR', 'May anh Minolta XD-11 SLR', 't', 'mi', 'jap', 'May anh phim SLR co dien phu hop cho nguoi yeu thich analog.', 'fi', 'nd', 'MinoltaXD-11SLR01.jpg', 61200000);

INSERT INTO t_anh_sp (ma_sp, ten_file_anh) VALUES
('FujiFilmGFX100', 'FujiFilmGFX10001.jpg'),
('FujiFilmGFX100', 'FujiFilmGFX10002.jpg'),
('FujiFilmGFX100', 'FujiFilmGFX10003.jpg'),
('FujiFilmGFX100S', 'FujiFilmGFX100S01.jpg'),
('FujiFilmGFX100S', 'FujiFilmGFX100S02.jpg'),
('FujiFilmGFX100S', 'FujiFilmGFX100S03.jpg'),
('CanonPowerShotG7XMarkIII', 'CanonPowerShotG7XMarkIII01.png'),
('CanonPowerShotG7XMarkIII', 'CanonPowerShotG7XMarkIII02.png'),
('CanonPowerShotG7XMarkIII', 'CanonPowerShotG7XMarkIII03.png'),
('SonyAlphaILCE-7RM5', 'SonyAlphaILCE-7RM501.jpg'),
('SonyAlphaILCE-7RM5', 'SonyAlphaILCE-7RM502.jpg'),
('SonyAlphaILCE-7RM5', 'SonyAlphaILCE-7RM503.jpg'),
('NikonZ6II', 'NikonZ6II01.jpg'),
('NikonZ6II', 'NikonZ6II02.jpg'),
('NikonZ6II', 'NikonZ6II03.jpg'),
('MinoltaXD-11SLR', 'MinoltaXD-11SLR01.jpg'),
('MinoltaXD-11SLR', 'MinoltaXD-11SLR02.jpg'),
('MinoltaXD-11SLR', 'MinoltaXD-11SLR03.jpg');

INSERT INTO t_khach_hang (ma_khach_hang, username, ten_khach_hang, so_dien_thoai, dia_chi, ghi_chu) VALUES
('user@camera.shop', 'user@camera.shop', 'Demo User', '0900000000', 'Ha Noi', 'Khach hang demo');

