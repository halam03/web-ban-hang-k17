<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('t_user')->insert([
            [
                'username' => 'admin@camera.shop',
                'password' => Hash::make('admin123'),
                'loai_user' => 0,
            ],
            [
                'username' => 'user@camera.shop',
                'password' => Hash::make('user123'),
                'loai_user' => 1,
            ],
        ]);

        DB::table('t_chat_lieu')->insert([
            ['ma_chat_lieu' => 'n', 'chat_lieu' => 'Nhua cung'],
            ['ma_chat_lieu' => 't', 'chat_lieu' => 'Titan'],
            ['ma_chat_lieu' => 'al', 'chat_lieu' => 'Nhom'],
        ]);

        DB::table('t_quoc_gia')->insert([
            ['ma_nuoc' => 'jap', 'ten_nuoc' => 'Nhat'],
            ['ma_nuoc' => 'my', 'ten_nuoc' => 'My'],
        ]);

        DB::table('t_hang_sx')->insert([
            ['ma_hang_sx' => 'fu', 'hang_sx' => 'FujiFilm', 'ma_nuoc_thuong_hieu' => 'jap'],
            ['ma_hang_sx' => 'ca', 'hang_sx' => 'Canon', 'ma_nuoc_thuong_hieu' => 'jap'],
            ['ma_hang_sx' => 'mi', 'hang_sx' => 'Minolta', 'ma_nuoc_thuong_hieu' => 'jap'],
            ['ma_hang_sx' => 'so', 'hang_sx' => 'Sony', 'ma_nuoc_thuong_hieu' => 'jap'],
            ['ma_hang_sx' => 'ni', 'hang_sx' => 'Nikon', 'ma_nuoc_thuong_hieu' => 'jap'],
        ]);

        DB::table('t_loai_sp')->insert([
            ['ma_loai' => 'fi', 'loai' => 'May film'],
            ['ma_loai' => 'pro', 'loai' => 'May anh chuyen nghiep'],
        ]);

        DB::table('t_loai_dt')->insert([
            ['ma_dt' => 'dl', 'ten_loai' => 'Du lich'],
            ['ma_dt' => 'dn', 'ten_loai' => 'Doanh nhan'],
            ['ma_dt' => 'ls', 'ten_loai' => 'Lich su'],
            ['ma_dt' => 'nd', 'ten_loai' => 'Nang dong'],
        ]);

        DB::table('t_danh_muc_sp')->insert([
            [
                'ma_sp' => 'FujiFilmGFX100',
                'ten_sp' => 'May anh FujiFilm GFX100',
                'ma_chat_lieu' => 'n',
                'ma_hang_sx' => 'fu',
                'ma_nuoc_sx' => 'jap',
                'gioi_thieu_sp' => 'GFX100 ket hop nhieu thap ky kinh nghiem de tao nen mot may anh medium format.',
                'ma_loai' => 'fi',
                'ma_dt' => 'nd',
                'anh_dai_dien' => 'FujiFilmGFX10001.jpg',
                'gia_lon_nhat' => 120000000,
            ],
            [
                'ma_sp' => 'FujiFilmGFX100S',
                'ten_sp' => 'May anh FujiFilm GFX100S',
                'ma_chat_lieu' => 't',
                'ma_hang_sx' => 'fu',
                'ma_nuoc_sx' => 'jap',
                'gioi_thieu_sp' => 'GFX100S ket hop do phan giai cao va than may nhe.',
                'ma_loai' => 'fi',
                'ma_dt' => 'nd',
                'anh_dai_dien' => 'FujiFilmGFX100S01.jpg',
                'gia_lon_nhat' => 120000000,
            ],
            [
                'ma_sp' => 'CanonPowerShotG7XMarkIII',
                'ten_sp' => 'May anh Canon PowerShot G7X Mark III',
                'ma_chat_lieu' => 't',
                'ma_hang_sx' => 'ca',
                'ma_nuoc_sx' => 'jap',
                'gioi_thieu_sp' => 'Cam bien 1.0 inch va ong kinh f/1.8-2.8 cho chat luong anh tot.',
                'ma_loai' => 'pro',
                'ma_dt' => 'nd',
                'anh_dai_dien' => 'CanonPowerShotG7XMarkIII01.png',
                'gia_lon_nhat' => 81200000,
            ],
            [
                'ma_sp' => 'SonyAlphaILCE-7RM5',
                'ten_sp' => 'May anh Sony Alpha ILCE-7RM5',
                'ma_chat_lieu' => 'n',
                'ma_hang_sx' => 'so',
                'ma_nuoc_sx' => 'jap',
                'gioi_thieu_sp' => 'A7R V so huu cam bien 61MP va bo xu ly Bionz XR.',
                'ma_loai' => 'pro',
                'ma_dt' => 'nd',
                'anh_dai_dien' => 'SonyAlphaILCE-7RM501.jpg',
                'gia_lon_nhat' => 565000000,
            ],
            [
                'ma_sp' => 'NikonZ6II',
                'ten_sp' => 'May anh Nikon Z6 II',
                'ma_chat_lieu' => 'al',
                'ma_hang_sx' => 'ni',
                'ma_nuoc_sx' => 'jap',
                'gioi_thieu_sp' => 'Z6 II can bang giua toc do va hieu nang thieu sang.',
                'ma_loai' => 'fi',
                'ma_dt' => 'nd',
                'anh_dai_dien' => 'NikonZ6II01.jpg',
                'gia_lon_nhat' => 125000000,
            ],
            [
                'ma_sp' => 'MinoltaXD-11SLR',
                'ten_sp' => 'May anh Minolta XD-11 SLR',
                'ma_chat_lieu' => 't',
                'ma_hang_sx' => 'mi',
                'ma_nuoc_sx' => 'jap',
                'gioi_thieu_sp' => 'May anh phim SLR co dien phu hop cho nguoi yeu thich analog.',
                'ma_loai' => 'fi',
                'ma_dt' => 'nd',
                'anh_dai_dien' => 'MinoltaXD-11SLR01.jpg',
                'gia_lon_nhat' => 61200000,
            ],
        ]);

        DB::table('t_anh_sp')->insert([
            ['ma_sp' => 'FujiFilmGFX100', 'ten_file_anh' => 'FujiFilmGFX10001.jpg'],
            ['ma_sp' => 'FujiFilmGFX100', 'ten_file_anh' => 'FujiFilmGFX10002.jpg'],
            ['ma_sp' => 'FujiFilmGFX100', 'ten_file_anh' => 'FujiFilmGFX10003.jpg'],
            ['ma_sp' => 'FujiFilmGFX100S', 'ten_file_anh' => 'FujiFilmGFX100S01.jpg'],
            ['ma_sp' => 'FujiFilmGFX100S', 'ten_file_anh' => 'FujiFilmGFX100S02.jpg'],
            ['ma_sp' => 'FujiFilmGFX100S', 'ten_file_anh' => 'FujiFilmGFX100S03.jpg'],
            ['ma_sp' => 'CanonPowerShotG7XMarkIII', 'ten_file_anh' => 'CanonPowerShotG7XMarkIII01.png'],
            ['ma_sp' => 'CanonPowerShotG7XMarkIII', 'ten_file_anh' => 'CanonPowerShotG7XMarkIII02.png'],
            ['ma_sp' => 'CanonPowerShotG7XMarkIII', 'ten_file_anh' => 'CanonPowerShotG7XMarkIII03.png'],
            ['ma_sp' => 'SonyAlphaILCE-7RM5', 'ten_file_anh' => 'SonyAlphaILCE-7RM501.jpg'],
            ['ma_sp' => 'SonyAlphaILCE-7RM5', 'ten_file_anh' => 'SonyAlphaILCE-7RM502.jpg'],
            ['ma_sp' => 'SonyAlphaILCE-7RM5', 'ten_file_anh' => 'SonyAlphaILCE-7RM503.jpg'],
            ['ma_sp' => 'NikonZ6II', 'ten_file_anh' => 'NikonZ6II01.jpg'],
            ['ma_sp' => 'NikonZ6II', 'ten_file_anh' => 'NikonZ6II02.jpg'],
            ['ma_sp' => 'NikonZ6II', 'ten_file_anh' => 'NikonZ6II03.jpg'],
            ['ma_sp' => 'MinoltaXD-11SLR', 'ten_file_anh' => 'MinoltaXD-11SLR01.jpg'],
            ['ma_sp' => 'MinoltaXD-11SLR', 'ten_file_anh' => 'MinoltaXD-11SLR02.jpg'],
            ['ma_sp' => 'MinoltaXD-11SLR', 'ten_file_anh' => 'MinoltaXD-11SLR03.jpg'],
        ]);

        DB::table('t_khach_hang')->insert([
            [
                'ma_khach_hang' => 'user@camera.shop',
                'username' => 'user@camera.shop',
                'ten_khach_hang' => 'Demo User',
                'so_dien_thoai' => '0900000000',
                'dia_chi' => 'Ha Noi',
                'ghi_chu' => 'Khach hang demo',
            ],
        ]);
    }
}