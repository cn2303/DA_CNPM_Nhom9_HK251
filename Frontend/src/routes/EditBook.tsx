import { useNavigate, useParams } from 'react-router-dom';
import { BookEdit } from '../components/BookEdit';
import { toast } from 'sonner@2.0.3';

interface Category {
  id: number;
  name: string;
}

interface BookCategory {
  id: {
    bookId: number;
    categoryId: number;
  };
  category: Category;
}

interface Book {
  id: number;
  isbn: string | null;
  title: string;
  language: string | null;
  author: string;
  publisher: string;
  description: string;
  status: string;
  size: string;
  type: string;
  price: number;
  quantity: number;
  publicationYear: number;
  imageUrl: string | null;
  categories: BookCategory[];
  numPage: number;
  averageRating: number;
  nation: string | null;
}

interface EditBookProps {
  books: Book[];
  onSave: (book: Book) => void;
  onDelete: (bookId: number) => void;
}

export function EditBook({ books, onSave, onDelete }: EditBookProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const book = books.find(b => b.id === Number(id));

  if (!book) {
    return (
      <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 p-12 flex items-center justify-center mx-auto">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Không tìm thấy sách</h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Quay về bảng điều khiển
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (updatedBook: Book) => {
    try {
      await onSave(updatedBook);
      toast.success('Đã cập nhật sách thành công!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Không thể cập nhật sách');
    }
  };

  const handleDelete = async (bookId: number) => {
    try {
      const bookToDelete = books.find(b => b.id === bookId);
      await onDelete(bookId);
      toast.success(`"${bookToDelete?.title}" đã được xóa`);
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa sách');
    }
  };

  return (
    <BookEdit
      book={book}
      onBack={() => navigate('/')}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}