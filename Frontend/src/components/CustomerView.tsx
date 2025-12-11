import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, ShoppingBag, Lock, MapPin, Calendar, User, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface Address {
  id: number;
  ward: string;
  city: string;
  addressDetail: string;
  phone: string;
  default: boolean;
}

interface Customer {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  birthday: string;
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
}

interface CustomerViewProps {
  customer: Customer;
  onBack: () => void;
}

export function CustomerView({ customer, onBack }: CustomerViewProps) {
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const placeholderAvatar = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop';

  return (
    <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 p-12 overflow-auto mx-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 px-6 py-6">
            <ArrowLeft className="size-5" />
            Về chi tiết đơn hàng
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl">Hồ sơ khách hàng</CardTitle>
            <p className="text-muted-foreground mt-2">Chế độ xem chỉ đọc thông tin khách hàng</p>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-8">
            {/* Avatar Section - Read Only */}
            <div className="flex items-center gap-6">
              <Avatar className="size-24">
                <AvatarImage src={placeholderAvatar} alt={customer.fullname} />
                <AvatarFallback className="text-2xl">{getInitials(customer.fullname)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl">{customer.fullname}</h2>
                <p className="text-muted-foreground">{customer.email}</p>
              </div>
            </div>

            <Separator />

            {/* Basic Information - Read Only */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-muted-foreground" />
                <h3 className="text-xl">Thông tin khách hàng</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Họ và tên</p>
                  <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                    <p>{customer.fullname}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Tên đăng nhập</p>
                  <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                    <p>{customer.username}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Địa chỉ Email</p>
                  <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                    <p>{customer.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                  <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                    <p>{customer.phone}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Ngày sinh</p>
                  <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                    <p>{customer.birthday ? formatDate(customer.birthday) : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Address Information - Read Only */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-muted-foreground" />
                <h3 className="text-xl">Địa chỉ</h3>
              </div>
              
              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-4">
                  {customer.addresses.map((address) => (
                    <Card key={address.id} className="relative">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{address.addressDetail}</p>
                              {address.default && (
                                <Badge variant="default" className="text-xs">
                                  Mặc định
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {address.ward}, {address.city}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Phone className="size-4" />
                              {address.phone}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                  <p className="text-muted-foreground">Chưa có địa chỉ nào</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Purchase Statistics */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-5 text-muted-foreground" />
                <h3 className="text-xl">Lịch sử mua hàng</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Tổng đơn hàng</p>
                    <p className="text-3xl">{customer.totalOrders}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Tổng chi tiêu</p>
                    <p className="text-3xl text-primary">{formatCurrency(customer.totalSpent)}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}