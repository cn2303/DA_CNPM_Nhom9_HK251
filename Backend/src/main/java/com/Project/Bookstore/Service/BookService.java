package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Book;
import com.Project.Bookstore.Model.BookCategory;
import com.Project.Bookstore.Model.BookCategoryId;
import com.Project.Bookstore.Model.Category;
import com.Project.Bookstore.Repository.BookRepository;
import com.Project.Bookstore.Repository.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Year;
import java.util.Iterator;
import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public BookService(BookRepository bookRepository,  CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Book> getAllBook() {
        return this.bookRepository.findAll();
    }
    public Book getBookById(Integer id) {
        return bookRepository.findById(id).orElseThrow(()->new RuntimeException("No Book Found: " + id));
    }

//    public Book saveBook(Book book) {
//        if (book.getCategories() != null) {
//            for (BookCategory bc : book.getCategories()) {
//                bc.setBook(book);
//                bc.setId(new BookCategoryId(bc.getCategory().getId(), book.getId()));
//            }
//        }
//        return bookRepository.save(book);
//    }

    public Book saveBook(Book book) {
        if(book.getPublicationYear() <=0 || book.getPublicationYear()> Year.now().getValue())
            throw new IllegalArgumentException("Publication Year Must between 0 and "+ Year.now().getValue());
        if(book.getQuantity() <0)
            throw new IllegalArgumentException("Quantity Must Be Greater than 0");
        if (book.getPrice().compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Price Must Be Greater than 0");
        if (book.getCategories() != null) {
            for (BookCategory bc : book.getCategories()) {
                bc.setBook(book);
                Integer catId = bc.getCategory().getId();
                Category realCategory = categoryRepository.findById(catId).orElse(null);
                bc.setCategory(realCategory);
            }
        }
        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Book bookInput) {
        if(bookInput.getPublicationYear() == null||bookInput.getPublicationYear() <=0 || bookInput.getPublicationYear()> Year.now().getValue())
            throw new IllegalArgumentException("Publication Year Must between 0 and "+ Year.now().getValue());
        if(bookInput.getQuantity() == null || bookInput.getQuantity() <0)
            throw new IllegalArgumentException("Quantity Must Be Greater than 0");
        if (bookInput.getPrice()==null ||bookInput.getPrice().compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Price Must Be Greater than 0");
        if (bookInput.getNumPage() == null|| bookInput.getNumPage() <= 0)
            throw new IllegalArgumentException("Number of Pages Must Be Greater than 0");
        Book existingBook = bookRepository.findById(bookInput.getId())
                .orElseThrow(() -> new RuntimeException("No Book Found ID: " + bookInput.getId()));

        // Cập nhật thông tin cơ bản
        existingBook.setTitle(bookInput.getTitle());
        existingBook.setPrice(bookInput.getPrice());
        existingBook.setLanguage(bookInput.getLanguage());
        existingBook.setAuthor(bookInput.getAuthor());
        existingBook.setPublisher(bookInput.getPublisher());
        existingBook.setDescription(bookInput.getDescription());
        existingBook.setQuantity(bookInput.getQuantity());
        existingBook.setPublicationYear(bookInput.getPublicationYear());

        existingBook.setStatus(bookInput.getStatus());
        existingBook.setNumPage(bookInput.getNumPage());
        existingBook.setNation(bookInput.getNation());
        existingBook.setSize(bookInput.getSize());
        existingBook.setType(bookInput.getType());
        existingBook.setAverageRating(bookInput.getAverageRating());
        // XÓA TẤT CẢ categories cũ
        existingBook.getCategories().clear();

        // THÊM MỚI categories từ input
        if (bookInput.getCategories() != null) {
            for (BookCategory inputBc : bookInput.getCategories()) {
                Category realCategory = categoryRepository.findById(inputBc.getCategory().getId())
                        .orElseThrow(() -> new RuntimeException("Category not found: " + inputBc.getCategory().getId()));

                BookCategory newBc = new BookCategory();
                newBc.setBook(existingBook);
                newBc.setCategory(realCategory);
                newBc.setId(new BookCategoryId(existingBook.getId(), realCategory.getId()));

                existingBook.getCategories().add(newBc);
            }
        }

        return bookRepository.save(existingBook);
    }


    public void deleteBook(Integer id) {
        if(!this.bookRepository.existsById(id))
            throw new RuntimeException("No Book Found ID: " + id);
        bookRepository.deleteById(id);
    }
}
