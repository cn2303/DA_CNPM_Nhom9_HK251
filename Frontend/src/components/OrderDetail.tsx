import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Package, User, Mail, Phone, MapPin, Calendar, DollarSign, Save } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Order {
  orderId: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar?: string;
  book: string;
  quantity: number;
  total: number;
  date: string;
  time: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress?: string;
  shippingPhone?: string;
}

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onSave: (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => void;
  onViewCustomer: (customerId: number) => void;
}

export function OrderDetail({ order, onBack, onSave, onViewCustomer }: OrderDetailProps) {
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'cancelled'>(order.status);

  const handleSave = () => {
    onSave(order.orderId, status);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đã thanh toán';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'NA';
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

  return (
    <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 p-12 overflow-auto mx-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 px-6 py-6">
            <ArrowLeft className="size-5" />
            Về lịch sử đơn hàng
          </Button>
          <Badge variant={getStatusVariant(order.status)} className="text-base px-4 py-2">
            {getStatusLabel(order.status)}
          </Badge>
        </div>

        <div>
          <h1 className="text-4xl flex items-center gap-3">
            <Package className="size-10" />
            {order.orderId}
          </h1>
          <p className="text-muted-foreground text-lg mt-2">{order.time}</p>
        </div>

        {/* Customer Information Card */}
        <Card>
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Thông tin khách hàng</CardTitle>
              <Button onClick={() => onViewCustomer(order.customerId)} variant="outline">
                Xem hồ sơ đầy đủ
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <div className="flex items-center gap-6">
              <Avatar className="size-20">
                <AvatarImage src={order.customerAvatar} alt={order.customerName} />
                <AvatarFallback className="text-xl">{getInitials(order.customerName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tên</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{order.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Điện thoại</p>
                      <p className="font-medium">{order.customerPhone}</p>
                    </div>
                  </div>
                  {order.shippingAddress && (
                    <div className="flex items-center gap-3">
                      <MapPin className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                        <p className="font-medium">{order.shippingAddress}</p>
                      </div>
                    </div>
                  )}
                  {order.shippingPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Điện thoại giao hàng</p>
                        <p className="font-medium">{order.shippingPhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Card */}
        <Card>
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">Chi tiết đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Package className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Sách</p>
                  <p className="font-medium">{order.book}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Số lượng</p>
                  <p className="font-medium">{order.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày đặt hàng</p>
                  <p className="font-medium">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tổng tiền</p>
                  <p className="font-medium text-xl">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Status Management */}
            <div className="space-y-4">
              <h3 className="text-xl">Quản lý trạng thái đơn hàng</h3>
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-3">
                  <Label htmlFor="status" className="text-lg">Cập nhật trạng thái đơn hàng</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                    <SelectTrigger className="h-12" id="status">
                      <SelectValue placeholder="Chọn trạng thái đơn hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xác nhận</SelectItem>
                      <SelectItem value="processing">Đã thanh toán</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleSave} 
                  className="h-12 px-8 flex items-center gap-2"
                  disabled={status === order.status}
                >
                  <Save className="size-4" />
                  Lưu thay đổi
                </Button>
              </div>
              {status !== order.status && (
                <p className="text-sm text-muted-foreground">
                  Bạn có thay đổi chưa được lưu. Nhấp "Lưu thay đổi" để cập nhật trạng thái đơn hàng.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}