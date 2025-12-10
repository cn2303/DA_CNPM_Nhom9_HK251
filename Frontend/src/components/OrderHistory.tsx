import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Package, User, Calendar, DollarSign } from 'lucide-react';

interface Order {
  orderId: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  book: string;
  quantity: number;
  total: number;
  date: string;
  time: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress?: string;
}

interface OrderHistoryProps {
  orders: Order[];
  onBack: () => void;
  onOrderClick: (orderId: string) => void;
}

type OrderStatus = 'all' | 'pending' | 'processing' | 'completed' | 'cancelled';

export function OrderHistory({ orders, onBack, onOrderClick }: OrderHistoryProps) {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getStatusLabel = (status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'processing':
        return 'Đã thanh toán';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return '0₫';
    return `${amount.toLocaleString('vi-VN')}₫`;
  };

  const tabs: { id: OrderStatus; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'processing', label: 'Đã thanh toán' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 p-12 overflow-auto mx-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 px-6 py-6">
            <ArrowLeft className="size-5" />
            Về bảng điều khiển
          </Button>
        </div>

        <div>
          <h1 className="text-4xl">Lịch sử đơn hàng</h1>
          <p className="text-muted-foreground text-lg mt-2">Xem và quản lý tất cả đơn hàng của khách</p>
        </div>

        {/* Tab List - Inspired by Figma design */}
        <div className="bg-[#ececf0] content-stretch flex items-center justify-center relative rounded-[14px] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`basis-0 grow h-[29px] min-h-px min-w-px relative rounded-[14px] shrink-0 transition-colors ${
                activeTab === tab.id ? 'bg-white' : ''
              }`}
            >
              <div className="flex flex-row items-center justify-center size-full">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[29px] items-center justify-center px-[9px] py-[5px] relative w-full">
                  <p className="font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                    {tab.label}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card 
                key={order.orderId} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.01]"
                onClick={() => onOrderClick(order.orderId)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="size-5" />
                        {order.orderId}
                      </CardTitle>
                      <CardDescription>{order.time}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="size-4" />
                        <span className="text-sm">Khách hàng</span>
                      </div>
                      <p>{order.customerName}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="size-4" />
                        <span className="text-sm">Sách</span>
                      </div>
                      <p>{order.book}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="size-4" />
                        <span className="text-sm">Ngày</span>
                      </div>
                      <p>{order.date}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="size-4" />
                        <span className="text-sm">Tổng</span>
                      </div>
                      <p>{formatCurrency(order.total)} (SL: {order.quantity})</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="size-16 text-muted-foreground mb-4" />
              <h3 className="text-2xl text-muted-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {activeTab === 'all' 
                  ? 'There are no orders yet' 
                  : `No orders with status "${getStatusLabel(activeTab)}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}