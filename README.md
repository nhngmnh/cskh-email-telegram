## 📝 Thông tin chung

Hệ thống chăm sóc khách hàng qua email được xây dựng theo kiến trúc microservice, sử dụng IMAP để nhận email và Kafka để truyền dữ liệu giữa các thành phần. Hệ thống tự động phân phối email đến tư vấn viên theo nhiều chiến lược khác nhau (round-robin, random, least-tickets) và hỗ trợ phản hồi trực tiếp từ giao diện người dùng.
