import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, History, Plus, Ticket, Users, Trash2, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';

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

interface AdminDashboardProps {
  books: Book[];
  onViewOrderHistory: () => void;
  onViewVoucherInventory: () => void;
  onViewCustomerManagement: () => void;
  onBookClick?: (bookId: number) => void;
  onAddBook?: () => void;
  onDeleteBook?: () => void;
}

export function AdminDashboard({ books, onViewOrderHistory, onViewVoucherInventory, onViewCustomerManagement, onBookClick, onAddBook, onDeleteBook }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12; // Show 12 books per page (4 rows x 3 columns)

  const handleBookClick = (bookId: number) => {
    if (onBookClick) {
      onBookClick(bookId);
    }
  };

  const getStockBadgeColor = (status: string) => {
    if (status === 'Active') return '#22c55e';
    if (status === 'Inactive') return '#999';
    return '#999';
  };

  const getStockLabel = (status: string) => {
    if (status === 'Active') return 'Active';
    if (status === 'Inactive') return 'Inactive';
    return status;
  };

  // Filter books based on search query
  const filteredBooks = books.filter((book) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = book.title.toLowerCase().includes(query);
    const authorMatch = book.author.toLowerCase().includes(query);
    const isbnMatch = book.isbn?.toLowerCase().includes(query);
    
    return titleMatch || authorMatch || isbnMatch;
  });

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="size-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>Bảng điều khiển quản trị</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onDeleteBook} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="size-4" />
              Xóa sách
            </Button>
            <Button onClick={onAddBook} className="flex items-center gap-2">
              <Plus className="size-4" />
              Thêm sách
            </Button>
            <div className="h-8 w-px bg-border mx-2" />
            <Button variant="outline" className="flex items-center gap-2">
              <LogOut className="size-4" />
              Đăng xuất
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sách theo tên, tác giả hoặc ISBN..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="size-5" />
                Đơn hàng
              </CardTitle>
              <CardDescription>Xem và quản lý tất cả đơn hàng của khách</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onViewOrderHistory} className="w-full">
                Xem lịch sử đơn hàng
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="size-5" />
                Voucher
              </CardTitle>
              <CardDescription>Quản lý mã giảm giá cho giỏ hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onViewVoucherInventory} className="w-full">
                Xem kho voucher
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Khách hàng
              </CardTitle>
              <CardDescription>Tìm kiếm và chỉnh sửa hồ sơ khách hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onViewCustomerManagement} className="w-full">
                Xem quản lý khách hàng
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Books Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Kho sách</h2>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Tìm thấy {filteredBooks.length} kết quả
              </p>
            )}
          </div>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-muted-foreground">
                {searchQuery ? 'Không tìm thấy sách nào phù hợp' : 'Không có sách nào trong kho'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBooks.map((book) => (
                <div 
                  key={book.id} 
                  className="bg-white rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] cursor-pointer hover:shadow-lg transition-all relative"
                  onClick={() => handleBookClick(book.id)}
                >
                  {/* Image Container */}
                  <div className="content-stretch flex flex-col h-[220.425px] items-start overflow-clip rounded-[4px] m-4">
                    <div className="h-[220.425px] relative shrink-0 w-full">
                      <ImageWithFallback
                        src={book.imageUrl || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                        alt={book.title}
                        className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="h-[48px] mx-4 overflow-clip">
                    <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] text-[16px] text-neutral-950">
                      {book.title}
                    </p>
                  </div>

                  {/* Author */}
                  <div className="h-[20px] mx-4 mt-2">
                    <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] text-[#4a5565] text-[14px]">
                      {book.author}
                    </p>
                  </div>

                  {/* Stock Information */}
                  <div className="mx-4 mt-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] text-[14px] text-[#4a5565]">
                          Tồn kho
                        </p>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-[4px]"
                        style={{ backgroundColor: getStockBadgeColor(book.status) }}
                      >
                        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] text-[14px] text-white">
                          {book.quantity} cuốn
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p 
                        className="font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] text-[14px]"
                        style={{ color: getStockBadgeColor(book.status) }}
                      >
                        {getStockLabel(book.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="size-4" />
              Trang trước
            </Button>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </p>
              <span className="text-xs text-muted-foreground">
                ({filteredBooks.length} sách)
              </span>
            </div>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="flex items-center gap-2"
            >
              Trang sau
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}