# Base image
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các package
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Expose cổng ứng dụng (tùy app của bạn dùng cổng nào — ví dụ 4000)
EXPOSE 4000

# Lệnh khởi chạy server
CMD ["npm", "run", "server"]
