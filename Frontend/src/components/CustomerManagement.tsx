import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Search, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  address?: string;
}

interface CustomerManagementProps {
  customers: Customer[];
  onBack: () => void;
  onCustomerClick: (customerId: number) => void;
}

export function CustomerManagement({ customers, onBack, onCustomerClick }: CustomerManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');

  console.log('🎨 CustomerManagement render - customers:', customers);
  console.log('📊 CustomerManagement - Total:', customers?.length || 0);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('vi-VN')}₫`;
  };

  const placeholderAvatar = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop';

  return (
    <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 p-12 overflow-auto mx-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 px-6 py-6">
              <ArrowLeft className="size-5" />
              Về bảng điều khiển
            </Button>
            <div className="flex items-center gap-3">
              <Users className="size-8 text-primary" />
              <h1 className="text-4xl">Quản lý khách hàng</h1>
            </div>
          </div>
          <div className="text-muted-foreground">
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'khách hàng' : 'khách hàng'}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khách hàng theo tên, email hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14"
          />
        </div>

        {/* Customers List */}
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <Card 
              key={customer.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
              onClick={() => onCustomerClick(customer.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Avatar */}
                  <Avatar className="size-16">
                    <AvatarImage src={placeholderAvatar} alt={customer.name} />
                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                  </Avatar>

                  {/* Customer Info */}
                  <div className="flex-1 grid grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tên</p>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Điện thoại</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Đơn hàng</p>
                        <p className="font-medium">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tổng chi</p>
                        <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="size-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl text-muted-foreground mb-2">
              {searchQuery ? 'Không tìm thấy khách hàng' : 'Chưa có khách hàng'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Thử điều chỉnh tiêu chí tìm kiếm của bạn' : 'Khách hàng sẽ xuất hiện ở đây khi họ đăng ký'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}