import { ChevronRight, List } from "lucide-react"
import "./CategorySidebar.css"

const categories = [
  "Kỹ thuật",
  "Xã Hội",
  "Y - Sinh học",
  "Tâm Lý học",
  "Tài chính - Kinh Tế",
  "Khoa Học Tự Nhiên",
  "Kỹ Năng - Nghiệp vụ",
  "Công Nghệ Thông Tin",
  "Đại cương - Môi Trường",
  "Pháp Luật",
  "Ngoại ngữ",
  "Nông - Lâm - Ngư",
]

export default function CategorySidebar() {
  return (
    <aside className="category-sidebar">
      <div className="sidebar-header">
        <List size={20} />
        <span>DANH MỤC SÁCH</span>
      </div>

      <div className="categories-list">
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            <span>{category}</span>
            <ChevronRight size={18} />
          </div>
        ))}
      </div>

      <button className="view-all-categories">
        <List size={16} />
        Tất cả danh mục
      </button>
    </aside>
  )
}
