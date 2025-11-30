import Header from "../../components/Header/Header"
import CategorySidebar from "../../components/CategorySidebar/CategorySidebar"
import FeaturedCarousel from "../../components/FeaturedCarousel/FeaturedCarousel"
import ProductSection from "../../components/ProductSection/ProductSection"
import Footer from "../../components/Footer/Footer"
import "./Home.css"
import dsaImage from "../../assets/DSA.jpg"
import osImage from "../../assets/OS.jpg"
import pplImage from "../../assets/PPL.png"

export default function Home({ onNavigate, currentUser, setCurrentUser }) {
  const bookImages = [dsaImage, osImage, pplImage]

  const newBooks = [
    {
      id: 1,
      title: "Book 1",
      image: bookImages[0],
    },
    {
      id: 2,
      title: "Book 2",
      image: bookImages[1],
    },
    {
      id: 3,
      title: "Book 3",
      image: bookImages[2],
    },
    {
      id: 4,
      title: "Book 4",
      image: bookImages[0],
    },
  ]

  const featuredBooks = [
    {
      id: 1,
      title: "Giáo trình Văn lý đại cương (Tập I & II)",
      author: "PGS.TS Nguyễn Thị Hảo",
      image: bookImages[0],
      price: 120000,
      originalPrice: 150000,
      rating: 5,
      reviews: 125,
      badge: "Sale",
    },
    {
      id: 2,
      title: "Nhập môn Tiếng Trung Quốc (Quyển 1)",
      author: "TS. Lê Thị Thu Hà",
      image: bookImages[1],
      price: 95000,
      originalPrice: 120000,
      rating: 5,
      reviews: 98,
      badge: null,
    },
    {
      id: 3,
      title: "300 Bài tập cơ bản và nâng cao môn hóa học",
      author: "TS. Nguyễn Văn Minh",
      image: bookImages[2],
      price: 85000,
      originalPrice: 100000,
      rating: 5,
      reviews: 156,
      badge: "Sale",
    },
    {
      id: 4,
      title: "Luận án Hóa học",
      author: "PGS. Trần Thanh Hải",
      image: bookImages[0],
      price: 110000,
      originalPrice: 140000,
      rating: 4,
      reviews: 89,
      badge: null,
    },
    {
      id: 5,
      title: "Phát triển Bền vững: Cơ Lý hóa",
      author: "GS.TS Lê Anh Tuấn",
      image: bookImages[1],
      price: 130000,
      originalPrice: 160000,
      rating: 5,
      reviews: 142,
      badge: null,
    },
    {
      id: 6,
      title: "Vật Lý Phóng Xạ và Ứng Dụng",
      author: "TS. Nguyễn Quốc Hùng",
      image: bookImages[2],
      price: 98000,
      originalPrice: 120000,
      rating: 5,
      reviews: 167,
      badge: "Hot",
    },
  ]

  return (
    <div className="home-container">
      <Header onNavigate={onNavigate} currentUser={currentUser} setCurrentUser={setCurrentUser} />

      <div className="home-content">
        <CategorySidebar />

        <main className="home-main">
          <FeaturedCarousel books={newBooks} />

          <ProductSection title="Sách nổi bật" viewAllLink="Xem toàn bộ" books={featuredBooks} onNavigate={onNavigate} />
        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
