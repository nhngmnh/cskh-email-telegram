# Sử dụng image Node.js 18 chính thức
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json trước
COPY package*.json ./

# Cài dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng ứng dụng (giả sử chạy ở cổng 4000)
EXPOSE 4000

# Lệnh chạy service
CMD ["npm","run","server"]
