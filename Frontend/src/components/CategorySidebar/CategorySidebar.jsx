import { ChevronRight, List } from "lucide-react"
import "./CategorySidebar.css"

export default function CategorySidebar({
  categories = [],
  selectedCategoryId = null,
  onSelectCategory,
  onViewAllCategories,
}) {
  const handleSelect = (categoryId) => {
    if (onSelectCategory) onSelectCategory(categoryId)
  }

  return (
    <aside className="category-sidebar">
      <div className="sidebar-header">
        <List size={20} />
        <span>DANH MỤC SÁCH</span>
      </div>

      <div className="categories-list">
        {categories.map((category) => (
          <button
            key={category.id ?? category.name}
            className={`category-item ${selectedCategoryId === category.id ? "active" : ""}`}
            onClick={() => handleSelect(category.id)}
            type="button"
          >
            <span>{category.name}</span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>

      <button className="view-all-categories" type="button" onClick={onViewAllCategories}>
        <List size={16} />
        Tất cả danh mục
      </button>
    </aside>
  )
}
