import React from "react";

import Book1 from "../assets/DSA.jpg";
import Book2 from "../assets/PPL.png";
import Book3 from "../assets/OS.jpg";

const mockBooks = [
  { id: 1, title: "Data Structures and Algorithms", author: "Le Thanh A", price: "3.620.000₫", img: Book1 },
  { id: 2, title: "Principles of Programming", author: "Nguyen Van B", price: "7.240.000₫", img: Book2 },
  { id: 3, title: "Operating Systems", author: "Pham Thi C", price: "2.415.000₫", img: Book3 },
];

function BookCard({ book }) {
  return (
    <div className="card">
      <img src={book.img} alt={book.title} />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p style={{ marginTop: 8, fontWeight: 600 }}>{book.price}</p>
    </div>
  );
}

export default function BookList() {
  return (
    <div className="book-grid" role="list">
      {mockBooks.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}
