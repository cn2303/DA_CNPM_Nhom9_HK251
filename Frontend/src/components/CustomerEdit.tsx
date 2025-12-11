import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, ShoppingBag, Lock, MapPin, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';

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
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  birthday: string;
  addresses?: Address[];
}

interface CustomerEditProps {
  customer: Customer;
  onBack: () => void;
  onSave?: (customer: Customer) => void;
}

export function CustomerEdit({ customer, onBack }: CustomerEditProps) {
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

  const formatAddress = (address: Address) => {
    return `${address.addressDetail}, ${address.ward}, ${address.city}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 p-12 overflow-auto mx-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 px-6 py-6">
            <ArrowLeft className="size-5" />
            Về quản lý khách hàng
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl">Hồ sơ khách hàng</CardTitle>
            <p className="text-muted-foreground mt-2">Tất cả thông tin khách hàng là chỉ đọc.</p>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-8">
            {/* Avatar Section - Read Only */}
            <div className="flex items-center gap-6">
              <Avatar className="size-24">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="text-2xl">{getInitials(customer.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-muted-foreground" />
                  <Label className="text-lg text-muted-foreground">Ảnh đại diện khách hàng (Chỉ đọc)</Label>
                </div>
                <p className="text-sm text-muted-foreground">Khách hàng tự quản lý ảnh đại diện của họ</p>
              </div>
            </div>

            <Separator />

            {/* Basic Information - Read Only */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-muted-foreground" />
                <h3 className="text-xl">Thông tin khách hàng (Chỉ đọc)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-lg text-muted-foreground">Họ và tên</Label>
                  <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                    <p>{customer.name}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg text-muted-foreground">Địa chỉ Email</Label>
                  <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                    <p>{customer.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg text-muted-foreground">Số điện thoại</Label>
                  <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                    <p>{customer.phone}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg text-muted-foreground">Ngày sinh</Label>
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
                <Lock className="size-5 text-muted-foreground" />
                <h3 className="text-xl">Thông tin địa chỉ (Chỉ đọc)</h3>
              </div>
              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-6">
                  {customer.addresses.map((address, index) => (
                    <Card key={address.id} className="bg-muted/50">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg text-muted-foreground">
                            Địa chỉ {customer.addresses!.length > 1 ? `${index + 1}` : ''}
                          </Label>
                          {address.default && (
                            <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                              Mặc định
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground mb-1">Địa chỉ</p>
                              <p className="font-medium">{formatAddress(address)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Phone className="size-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground mb-1">Số điện thoại</p>
                              <p className="font-medium">{address.phone}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <Label className="text-lg text-muted-foreground">Địa chỉ</Label>
                  <div className="h-12 px-4 flex items-center bg-muted/50 rounded-md border border-input">
                    <p className="text-muted-foreground">Chưa cung cấp</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Statistics (Read-only) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-muted-foreground" />
                <h3 className="text-xl">Thống kê (Chỉ đọc)</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-muted/50">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                      <p className="text-2xl font-medium">{customer.totalOrders}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <span className="text-xl text-green-600">₫</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                      <p className="text-2xl font-medium">{formatCurrency(customer.totalSpent)}</p>
                    </div>
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