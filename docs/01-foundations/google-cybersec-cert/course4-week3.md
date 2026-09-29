---
title: "Tools of the Trade: Linux and SQL - Week 3"
sidebar_position: 23
---

## SQL vs Linux Filtering và Truy vấn Cơ sở dữ liệu 🗃️🐧

Trong phần này, chúng ta sẽ cùng nhau khám phá sự khác biệt giữa việc lọc dữ liệu trong **Linux** và **SQL**, đồng thời tìm hiểu cách truy vấn cơ sở dữ liệu với các từ khóa cơ bản như `SELECT`, `FROM`, và `ORDER BY`. Ngoài ra, chúng ta sẽ tìm hiểu về cơ sở dữ liệu **Chinook** và cách sử dụng mệnh đề `WHERE` để lọc dữ liệu.

### SQL Filtering vs Linux Filtering 🔍

#### 1. **Mục đích**

- **Linux**: Lọc dữ liệu trong file và thư mục trên hệ thống. Ví dụ: tìm kiếm file, quản lý quyền truy cập, hoặc quản lý tiến trình.
- **SQL**: Lọc dữ liệu trong cơ sở dữ liệu (database). Ví dụ: truy vấn và thao tác dữ liệu trong các bảng.

#### 2. **Cú pháp**

- **Linux**: Sử dụng các lệnh như `find`, `grep`, `sed`, `cut`.
- **SQL**: Sử dụng ngôn ngữ SQL với các từ khóa như `SELECT`, `WHERE`, `JOIN`.

#### 3. **Cấu trúc**

- **SQL**: Dữ liệu được tổ chức trong các bảng với cột và hàng cụ thể, giúp việc truy vấn và phân tích dễ dàng hơn.
- **Linux**: Dữ liệu thường được hiển thị dưới dạng văn bản, không có cấu trúc rõ ràng.

#### 4. **Kết hợp bảng**

- **SQL**: Cho phép kết hợp dữ liệu từ nhiều bảng bằng các lệnh như `JOIN`.
- **Linux**: Không hỗ trợ kết hợp dữ liệu từ nhiều nguồn.

#### 5. **Trường hợp sử dụng**

- **SQL**: Phù hợp khi làm việc với dữ liệu có cấu trúc trong cơ sở dữ liệu.
- **Linux**: Phù hợp khi làm việc với file văn bản hoặc dữ liệu không có cấu trúc.

### Truy vấn Cơ sở dữ liệu với SQL 🛠️

#### 1. **`SELECT` và `FROM`**

- **`SELECT`**: Chỉ định các cột bạn muốn trả về. Ví dụ: `SELECT customerid, city`.
- **`FROM`**: Chỉ định bảng bạn muốn truy vấn. Ví dụ: `FROM customers`.
- **Ví dụ**:

  ```sql
  SELECT customerid, city, country
  FROM customers;
  ```

#### 2. **`ORDER BY`**: Sắp xếp kết quả

- **Sắp xếp tăng dần (mặc định)**:

  ```sql
  SELECT customerid, city, country
  FROM customers
  ORDER BY city;
  ```

- **Sắp xếp giảm dần**:

  ```sql
  SELECT customerid, city, country
  FROM customers
  ORDER BY city DESC;
  ```

### Cơ sở dữ liệu Chinook 🎵

- **Mô tả**: Chinook là một cơ sở dữ liệu mẫu mô phỏng dữ liệu của một công ty truyền thông kỹ thuật số. Nó bao gồm các bảng như `employees`, `customers`, và `invoices`.
- **Ví dụ truy vấn**:

  ```sql
  SELECT customerid, city, country
  FROM customers;
  ```

### Mệnh đề `WHERE` và các toán tử cơ bản 🔍

#### 1. **`WHERE`**: Lọc dữ liệu theo điều kiện

- **Ví dụ**:

  ```sql
  SELECT firstname, lastname, title, email
  FROM employees
  WHERE title = 'IT Staff';
  ```

#### 2. **`LIKE` và Wildcards**

- **Wildcards**:
  - `%`: Thay thế cho bất kỳ số lượng ký tự nào.
  - `_`: Thay thế cho một ký tự duy nhất.
- **Ví dụ**:

  ```sql
  SELECT lastname, firstname, title, email
  FROM employees
  WHERE title LIKE 'IT%';
  ```

### Kết luận 📌

- **Linux** và **SQL** đều là công cụ mạnh mẽ để lọc dữ liệu, nhưng chúng phù hợp với các tình huống khác nhau.
- **SQL** cung cấp cấu trúc dữ liệu rõ ràng và khả năng kết hợp dữ liệu từ nhiều bảng, trong khi **Linux** phù hợp để làm việc với file và thư mục.
- Các từ khóa cơ bản như `SELECT`, `FROM`, `ORDER BY`, và `WHERE` là nền tảng quan trọng để truy vấn và lọc dữ liệu trong SQL.

---

## So sánh các loại JOIN trong SQL và Học SQL liên tục 🗃️📚

Trong phần này, chúng ta sẽ cùng nhau tìm hiểu về các loại **JOIN** trong SQL, bao gồm **INNER JOIN**, **LEFT JOIN**, **RIGHT JOIN**, và **FULL OUTER JOIN**. Ngoài ra, chúng ta sẽ khám phá cách sử dụng các hàm tổng hợp (aggregate functions) như `COUNT`, `SUM`, và `AVG` để thực hiện các phép tính trên dữ liệu.

### Các loại JOIN trong SQL 🔗

#### 1. **INNER JOIN**

- **Mục đích**: Trả về các hàng có giá trị khớp trên một cột cụ thể trong cả hai bảng.
- **Cú pháp**:

  ```sql
  SELECT *
  FROM employees
  INNER JOIN machines ON employees.device_id = machines.device_id;
  ```

- **Lưu ý**: Chỉ trả về các hàng có sự khớp giữa hai bảng.

#### 2. **LEFT JOIN**

- **Mục đích**: Trả về tất cả các hàng từ bảng bên trái (left table) và chỉ các hàng khớp từ bảng bên phải (right table).
- **Cú pháp**:

  ```sql
  SELECT *
  FROM employees
  LEFT JOIN machines ON employees.device_id = machines.device_id;
  ```

- **Kết quả**: Tất cả các hàng từ `employees` và chỉ các hàng khớp từ `machines`.

#### 3. **RIGHT JOIN**

- **Mục đích**: Trả về tất cả các hàng từ bảng bên phải (right table) và chỉ các hàng khớp từ bảng bên trái (left table).
- **Cú pháp**:

  ```sql
  SELECT *
  FROM employees
  RIGHT JOIN machines ON employees.device_id = machines.device_id;
  ```

- **Kết quả**: Tất cả các hàng từ `machines` và chỉ các hàng khớp từ `employees`.

#### 4. **FULL OUTER JOIN**

- **Mục đích**: Trả về tất cả các hàng từ cả hai bảng, bất kể có khớp hay không.
- **Cú pháp**:

  ```sql
  SELECT *
  FROM employees
  FULL OUTER JOIN machines ON employees.device_id = machines.device_id;
  ```

- **Kết quả**: Tất cả các hàng từ cả `employees` và `machines`.

### Hàm tổng hợp (Aggregate Functions) 📊

#### 1. **`COUNT`**: Đếm số lượng hàng

- **Ví dụ**:

  ```sql
  SELECT COUNT(firstname)
  FROM customers;
  ```

- **Kết quả**: Trả về tổng số lượng khách hàng.

#### 2. **`SUM`**: Tính tổng giá trị của một cột

- **Ví dụ**:

  ```sql
  SELECT SUM(quantity)
  FROM orders;
  ```

- **Kết quả**: Trả về tổng số lượng sản phẩm đã đặt.

#### 3. **`AVG`**: Tính giá trị trung bình của một cột

- **Ví dụ**:

  ```sql
  SELECT AVG(price)
  FROM products;
  ```

- **Kết quả**: Trả về giá trung bình của các sản phẩm.

### Tiếp tục học SQL 📚

- **Tìm kiếm tài nguyên trực tuyến**: Có rất nhiều tài nguyên trực tuyến giúp bạn học SQL, từ các khóa học đến các bài viết hướng dẫn.
- **Thực hành liên tục**: Thử nghiệm với các cơ sở dữ liệu khác nhau để củng cố kiến thức và kỹ năng của bạn.
- **Áp dụng vào công việc**: Sử dụng SQL để phân tích dữ liệu trong các tình huống thực tế, đặc biệt là trong lĩnh vực bảo mật.

### Kết luận 📌

- **JOIN** là công cụ mạnh mẽ để kết hợp dữ liệu từ nhiều bảng trong SQL. Mỗi loại JOIN có mục đích và cách sử dụng khác nhau.
- **Hàm tổng hợp** như `COUNT`, `SUM`, và `AVG` giúp bạn thực hiện các phép tính trên dữ liệu một cách hiệu quả.
- **Học SQL liên tục** là cách tốt nhất để nâng cao kỹ năng và áp dụng SQL vào các tình huống thực tế trong công việc của bạn.
