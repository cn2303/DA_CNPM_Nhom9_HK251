import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderHistory } from '../components/OrderHistory';
import { OrderDetail } from '../components/OrderDetail';
import { CustomerView } from '../components/CustomerView';
import { toast } from 'sonner@2.0.3';
import { userAPI } from '../services/api';

interface Order {
  id: number;
  status: string;
  orderDate: string;
  paymentMethod: string;
  shippingFee: number;
  subtotalPrice: number;
  discountTotal: number;
  grandTotalPrice: number;
  user: any;
  orderAddress: any;
  voucher: any;
  orderItemList: any[];
}

interface Customer {
  id: number;
  fullname: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  birthday: string;
  role: string;
  addresses: any[];
}

interface OrdersProps {
  orders: Order[];
  customers: Customer[];
  refreshOrders: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  onSaveOrderStatus: (orderId: number, newStatus: string) => Promise<void>;
}

export function Orders({ orders, customers, refreshOrders, refreshCustomers, onSaveOrderStatus }: OrdersProps) {
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState<Customer | null>(null);
  const [viewCustomerFromOrder, setViewCustomerFromOrder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const hasLoadedRef = useRef(false);

  // Load orders and customers when component mounts (only once)
  useEffect(() => {
    if (hasLoadedRef.current) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([refreshOrders(), refreshCustomers()]);
        hasLoadedRef.current = true;
      } catch (err: any) {
        toast.error(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshOrders, refreshCustomers]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Transform orders to match OrderHistory interface
  const transformedOrders = orders.map(order => {
    const orderDate = new Date(order.orderDate);
    const formattedDate = orderDate.toLocaleDateString('vi-VN');
    const formattedTime = orderDate.toLocaleTimeString('vi-VN');
    
    // Get book titles from order items
    const bookTitles = order.orderItemList?.map((item: any) => item.book?.title || 'N/A').join(', ') || 'N/A';
    
    // Calculate total quantity
    const totalQuantity = order.orderItemList?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
    
    // Normalize status to lowercase for consistent handling
    const normalizedStatus = order.status.toLowerCase();
    
    // Build full shipping address from orderAddress fields
    const shippingAddress = order.orderAddress 
      ? `${order.orderAddress.addressDetail}, ${order.orderAddress.ward}, ${order.orderAddress.city}`
      : '';
    
    return {
      orderId: `#${order.id}`,
      customerId: order.user?.id || 0,
      customerName: order.user?.fullname || 'N/A',
      customerEmail: order.user?.email || 'N/A',
      customerPhone: order.user?.phone || 'N/A',
      book: bookTitles,
      quantity: totalQuantity,
      total: order.grandTotalPrice || 0,
      date: formattedDate,
      time: formattedTime,
      status: normalizedStatus as 'pending' | 'processing' | 'completed' | 'cancelled',
      shippingAddress: shippingAddress,
      shippingPhone: order.orderAddress?.phone || ''
    };
  });

  // Show customer view (read-only from order detail)
  if (selectedCustomerId !== null && viewCustomerFromOrder) {
    // Show loading state while fetching customer details
    if (loadingCustomer) {
      return (
        <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Đang tải thông tin khách hàng...</p>
          </div>
        </div>
      );
    }

    if (selectedCustomerDetail) {
      // Calculate customer stats
      const customerOrders = orders.filter(order => order.user?.id === selectedCustomerDetail.id);
      const totalOrders = customerOrders.length;
      
      // Only count paid/completed orders for totalSpent
      const paidOrders = customerOrders.filter(order => {
        const status = order.status.toLowerCase();
        return status === 'processing' || status === 'completed';
      });
      const totalSpent = paidOrders.reduce((sum, order) => sum + (order.grandTotalPrice || 0), 0);
      
      console.log('📊 Customer stats:', {
        customerId: selectedCustomerDetail.id,
        totalOrders: totalOrders,
        paidOrders: paidOrders.length,
        totalSpent: totalSpent
      });
      
      // Transform customer data to match CustomerView interface
      const transformedCustomer = {
        id: selectedCustomerDetail.id,
        fullname: selectedCustomerDetail.fullname,
        username: selectedCustomerDetail.username,
        email: selectedCustomerDetail.email,
        phone: selectedCustomerDetail.phone,
        birthday: selectedCustomerDetail.birthday,
        addresses: selectedCustomerDetail.addresses || [],
        totalOrders: totalOrders,
        totalSpent: totalSpent
      };
      
      return (
        <CustomerView 
          customer={transformedCustomer} 
          onBack={() => {
            setSelectedCustomerId(null);
            setSelectedCustomerDetail(null);
            setViewCustomerFromOrder(false);
          }}
        />
      );
    }
  }

  // Show order detail page
  if (selectedOrderId !== null) {
    const selectedOrder = orders.find(order => order.id === selectedOrderId);
    if (selectedOrder) {
      // Transform order to match OrderDetail interface
      const orderDate = new Date(selectedOrder.orderDate);
      const formattedDate = orderDate.toLocaleDateString('vi-VN');
      const formattedTime = orderDate.toLocaleTimeString('vi-VN');
      
      const bookTitles = selectedOrder.orderItemList?.map((item: any) => item.book?.title || 'N/A').join(', ') || 'N/A';
      const totalQuantity = selectedOrder.orderItemList?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
      
      // Build full shipping address from orderAddress fields
      const shippingAddress = selectedOrder.orderAddress 
        ? `${selectedOrder.orderAddress.addressDetail}, ${selectedOrder.orderAddress.ward}, ${selectedOrder.orderAddress.city}`
        : '';
      
      const transformedOrder = {
        orderId: `#${selectedOrder.id}`,
        customerId: selectedOrder.user?.id || 0,
        customerName: selectedOrder.user?.fullname || 'N/A',
        customerEmail: selectedOrder.user?.email || 'N/A',
        customerPhone: selectedOrder.user?.phone || 'N/A',
        customerAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
        book: bookTitles,
        quantity: totalQuantity,
        total: selectedOrder.grandTotalPrice || 0,
        date: formattedDate,
        time: formattedTime,
        status: selectedOrder.status.toLowerCase() as 'pending' | 'processing' | 'completed' | 'cancelled',
        shippingAddress: shippingAddress,
        shippingPhone: selectedOrder.orderAddress?.phone || ''
      };
      
      return (
        <OrderDetail
          order={transformedOrder}
          onBack={() => setSelectedOrderId(null)}
          onSave={async (orderId, newStatus) => {
            try {
              // Extract numeric ID from string format "#123"
              const numericId = parseInt(orderId.replace('#', ''));
              
              // Convert status to capitalize format to match backend enum exactly
              // Backend enum: Pending, Cancelled, Completed, Processing
              const capitalizedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
              
              console.log('🔄 Updating order status:', { orderId: numericId, status: capitalizedStatus });
              await onSaveOrderStatus(numericId, capitalizedStatus);
              
              toast.success('Đã cập nhật trạng thái đơn hàng!');
              setSelectedOrderId(null);
            } catch (err: any) {
              console.error('❌ Error updating order status:', err);
              toast.error(err.message || 'Không thể cập nhật trạng thái đơn hàng');
            }
          }}
          onViewCustomer={(customerId) => {
            setSelectedCustomerId(customerId);
            setViewCustomerFromOrder(true);
            setLoadingCustomer(true);
            
            console.log('🔍 Fetching customer details for ID:', customerId);
            userAPI.getById(customerId).then(customer => {
              console.log('✅ Customer details loaded:', customer);
              setSelectedCustomerDetail(customer);
              setLoadingCustomer(false);
            }).catch(err => {
              console.error('❌ Error fetching customer details:', err);
              toast.error(err.message || 'Không thể tải thông tin khách hàng');
              setLoadingCustomer(false);
              setViewCustomerFromOrder(false);
            });
          }}
        />
      );
    }
  }

  // Show order history
  return (
    <OrderHistory 
      orders={transformedOrders}
      onBack={() => navigate('/')}
      onOrderClick={(orderId) => {
        // Extract numeric ID from string format "#123"
        const numericId = parseInt(orderId.replace('#', ''));
        setSelectedOrderId(numericId);
      }}
    />
  );
}