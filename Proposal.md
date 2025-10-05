<!-----



Conversion time: 0.919 seconds.


Using this Markdown file:

1. Paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β44
* Sun Oct 05 2025 09:49:28 GMT-0700 (PDT)
* Source doc: CO3103-Proposal-Nhom9
* Tables are currently converted to HTML tables.
----->



            **ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH**


                **TRƯỜNG ĐẠI HỌC BÁCH KHOA**



**ĐỒ ÁN TỔNG HỢP - HƯỚNG CÔNG NGHỆ PHẦN MỀM**

** NHÓM: 9*** ***– HK 251**

**GVHD: TS. LÊ XUÂN BÁCH**


<table>
  <tr>
   <td><strong>STT</strong>
   </td>
   <td><strong>MSSV</strong>
   </td>
   <td><strong>HỌ</strong>
   </td>
   <td><strong>TÊN</strong>
   </td>
   <td><strong>BIỆT DANH</strong>
   </td>
  </tr>
  <tr>
   <td>1
   </td>
   <td>2310365
   </td>
   <td>Nguyễn Chu Nguyên
   </td>
   <td>Chương
   </td>
   <td>9A
   </td>
  </tr>
  <tr>
   <td><span style="text-decoration:underline;">2</span>
   </td>
   <td><span style="text-decoration:underline;">2311142</span>
   </td>
   <td><span style="text-decoration:underline;">Hoàng Thế</span>
   </td>
   <td><span style="text-decoration:underline;">Huy</span>
   </td>
   <td><span style="text-decoration:underline;">9B</span>
   </td>
  </tr>
  <tr>
   <td>3
   </td>
   <td>2211190
   </td>
   <td>Lê Huỳnh
   </td>
   <td>Huy
   </td>
   <td>9C
   </td>
  </tr>
  <tr>
   <td>4
   </td>
   <td>2311191
   </td>
   <td>Nguyễn Mạnh
   </td>
   <td>Huy
   </td>
   <td>9D
   </td>
  </tr>
  <tr>
   <td>5
   </td>
   <td>2311289
   </td>
   <td>Ngô Thanh 
   </td>
   <td>Hùng 
   </td>
   <td>9E
   </td>
  </tr>
</table>


**TP. HỒ CHÍ MINH, THÁNG 9 - NĂM 2025**



**ĐỀ TÀI**

**Website bán sách, tài liệu học tập cho sinh viên**



1. **Tính ứng dụng**

    **a. Động cơ và phạm vi**


    -** **Động cơ và mục tiêu: Việc mua giáo trình, tài liệu học tập là nhu cầu không thể thiếu của sinh viên. Tuy nhiên quá trình tìm kiếm và mua tài liệu vẫn còn rời rạc, khó tiếp cận do nhiều trường chỉ có kênh mua sách trực tiếp mà chưa triển khai việc mua bán online, dẫn đến sự bất tiện cho sinh viên, đặc biệt là khi muốn tham khảo tài liệu giáo trình của các trường khác, hoặc mua trong những ngày cuối tuần, lễ, tết. Đó cũng chính là lý do ra đời cho hệ thống website mini e‑commerce mua bán sách giáo trình dành cho sinh viên: dễ dùng, nhanh chóng, thuận tiện và luôn mở cửa.


    - Phạm vi: Dự án tập trung chủ yếu cho sinh viên Trường Đại học Bách Khoa và các sinh viên trên địa bàn thành phố Hồ Chí Minh. Có khả năng mở rộng lên phạm vi các tỉnh miền Nam và cả nước.


    **b. Phân tích tổng quan**


    - Yêu cầu chức năng: Đăng ký, đăng nhập; quản lý sản phẩm; quản lý giỏ hàng; mua hàng; thanh toán (trực tiếp, trực tuyến); tìm kiếm sách theo từ khóa; đánh giá nhận xét từ người mua;...


    - Yêu cầu phi chức năng: 100% người dùng sử dụng được các chức năng chính (đăng nhập, tìm sách) sau 15 phút thao tác trên trang web (tính khả dụng); mật khẩu tài khoản được mã hóa (tính bảo mật); downtime của website mỗi tháng không quá 1 giờ (tính tin cậy);...

2. **Tính kỹ thuật**

    **a. Phát triển theo Sprint**


    - Sprint 1 (4 tuần): Hiện thực MVP (UI và các nhánh chức năng chính)


    - Sprint 2 (3 tuần): Hoàn thiện các chức năng của sản phẩm và báo cáo chi tiết


    **b. Phân công**


    - Backend: 9A, 9C, 9E


    - Frontend: 9B, 9D


    **c. Công nghệ đề xuất**


    - Backend: Java Spring Boot


    - Frontend: ReactJS


    - Database: PostgreSQL/MongoDB


    - Version Control: Git, GitHub


    **d. Mô hình thiết kế**


    - Kiến trúc: MVC


    - Module hóa các chức năng của hệ thống: module đăng nhập/đăng xuất; module quản lý tài khoản; module thanh toán;...

3. **Tính sáng tạo/nâng cao**

    - Tích hợp API/dịch vụ ngoài: Đăng nhập từ bên thứ 3 (google,...), tích hợp dịch vụ thanh toán trực tuyến, chatbox để hỗ trợ người dùng,... 


    - Đề xuất các sách liên quan dựa trên nội dung tìm kiếm, ngành học, khóa,…

4. **Kế hoạch thực hiện**

    - Kế hoạch và thời gian thực tế có thể thay đổi phụ thuộc vào tiến độ công việc, khả năng của từng thành viên trong nhóm và kế hoạch thực hiện của giảng viên hướng dẫn.


<table>
  <tr>
   <td>
STT
   </td>
   <td>Nhiệm vụ
   </td>
   <td>Thời gian
   </td>
   <td>Phân công
   </td>
  </tr>
  <tr>
   <td>1
   </td>
   <td>Thảo luận nhóm, chọn đề tài và viết Proposal
   </td>
   <td>Tuần 38
   </td>
   <td>9A, 9B
   </td>
  </tr>
  <tr>
   <td>2
   </td>
   <td>Requirement: Yêu cầu về chức năng (Functional) và phi chức năng (Non-Functional), Use-case diagram, Use-case scenarios
   </td>
   <td>Tuần 39 - 40
   </td>
   <td>9A, 9B, 9C, 9D, 9E
   </td>
  </tr>
  <tr>
   <td>3
   </td>
   <td>Vẽ Sequence và Activity Diagram cho các chức năng chính
   </td>
   <td>Tuần 41
   </td>
   <td>9A, 9C, 9E
   </td>
  </tr>
  <tr>
   <td>4
   </td>
   <td>UI design (mockup/wireframe) và mô tả Screen flow
   </td>
   <td>Tuần 42 - 43
   </td>
   <td>9B, 9D
   </td>
  </tr>
  <tr>
   <td>5
   </td>
   <td>Thiết kế cơ sở dữ liệu (ERD, lược đồ quan hệ), kiến trúc phần mềm, Class diagram
   </td>
   <td>Tuần 42 - 43
   </td>
   <td>9A, 9C, 9E
   </td>
  </tr>
  <tr>
   <td>6
   </td>
   <td>Hiện thực sản phẩm khả thi tối thiểu (MVP) bao gồm: hiện thực UI và các nhánh chức năng chính (Sprint 1)
   </td>
   <td>Tuần 44 - 47
   </td>
   <td>9A, 9B, 9C, 9D, 9E
   </td>
  </tr>
  <tr>
   <td>7
   </td>
   <td>Hoàn thiện đầy đủ các chức năng của sản phẩm (Sprint 2) 
   </td>
   <td>Tuần 48 - 50
   </td>
   <td>9A, 9B, 9C, 9D, 9E
   </td>
  </tr>
  <tr>
   <td>8
   </td>
   <td>Làm slide thuyết trình và hoàn thiện báo cáo
   </td>
   <td>Tuần 51
   </td>
   <td>9A, 9B, 9C, 9D, 9E
   </td>
  </tr>
</table>

