import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../components/AdminDashboard';

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

interface DashboardProps {
  books: Book[];
  handleLogout?: () => void;
}

export function Dashboard({ books, handleLogout }: DashboardProps) {
  const navigate = useNavigate();

  return (
    <AdminDashboard
      books={books}
      onViewOrderHistory={() => navigate('/orders')}
      onViewVoucherInventory={() => navigate('/vouchers')}
      onViewCustomerManagement={() => navigate('/customers')}
      onBookClick={(bookId) => navigate(`/book/${bookId}`)}
      onAddBook={() => navigate('/book/add')}
      onDeleteBook={() => navigate('/book/delete')}
      onLogout={handleLogout}
    />
  );
}