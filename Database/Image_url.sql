ALTER TABLE Book
ADD COLUMN image_url VARCHAR(255);

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/gt1_sp4ppx.png'
WHERE BookID = 1;  -- Giải tích 1

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/gt2_t092j9.png'
WHERE BookID = 2;  -- Giải tích 2

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/dai-so-tuyen-tinh_obctdr.png'
WHERE BookID = 3;  -- Đại số tuyến tính

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/vl1_fdcvde.png'
WHERE BookID = 4;  -- Vật lý A1

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741849/vl2_brdi1j.png'
WHERE BookID = 5;  -- Vật lý A2

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/btvl1_aqr9yf.png'
WHERE BookID = 6;  -- Bài tập Vật lý A1

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/btvl2_ueghlv.png'
WHERE BookID = 7;  -- Bài tập Vật lý A2

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741847/hdc_my4z4z.png'
WHERE BookID = 8;  -- Hóa đại cương A1

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741848/xstk_lbjtsi.png'
WHERE BookID = 9;  -- Xác suất thống kê

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741849/trr_pz7f2s.png'
WHERE BookID = 10; -- Toán rời rạc

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741847/pldc_eaaqje.png'
WHERE BookID = 11; -- Pháp luật đại cương

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741851/triet_uony7j.png'
WHERE BookID = 12; -- Triết học Mác - Lênin

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741847/ktct_ivie0s.png'
WHERE BookID = 13; -- Kinh tế chính trị Mác - Lênin

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741846/CNXH_bgfczp.png'
WHERE BookID = 14; -- Chủ nghĩa xã hội khoa học

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741847/tthcm_pnrddd.png'
WHERE BookID = 15; -- Tư tưởng Hồ Chí Minh

UPDATE Book
SET image_url = 'https://res.cloudinary.com/daxcsg1et/image/upload/v1764741845/lsa_n5nfre.png'
WHERE BookID = 16; -- Lịch sử Đảng CSVN

