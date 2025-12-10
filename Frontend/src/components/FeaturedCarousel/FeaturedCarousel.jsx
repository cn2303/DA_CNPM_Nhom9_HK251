"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "./FeaturedCarousel.css"

export default function FeaturedCarousel({ books, onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? books.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === books.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const handleBookClick = (bookId) => {
    if (onNavigate && bookId) {
      onNavigate("product-detail", bookId)
    }
  }

  return (
    <div className="featured-carousel">
      <h2 className="carousel-title">GIỚI THIỆU SÁCH MỚI</h2>

      <div className="carousel-container">
        <button className="carousel-arrow left" onClick={goToPrevious}>
          <ChevronLeft size={24} />
        </button>

        <div className="carousel-track">
          {books.map((book, index) => (
            <div 
              key={book.id} 
              className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleBookClick(book.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={book.image || "/placeholder.svg"} alt={book.title} />
            </div>
          ))}
        </div>

        <button className="carousel-arrow right" onClick={goToNext}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="carousel-indicators">
        {books.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
