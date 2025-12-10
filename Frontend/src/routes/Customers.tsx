import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerManagement } from '../components/CustomerManagement';
import { CustomerEdit } from '../components/CustomerEdit';
import { toast } from 'sonner@2.0.3';
import { userAPI } from '../services/api';

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

interface CustomersProps {
  customers: Customer[];
  refreshCustomers: () => Promise<void>;
  onSaveCustomer: (customer: Customer) => Promise<void>;
}

export function Customers({ customers, refreshCustomers, onSaveCustomer }: CustomersProps) {
  const navigate = useNavigate();
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  // Load customers when component mounts (only once)
  useEffect(() => {
    if (hasLoadedRef.current) return;
    
    const loadData = async () => {
      try {
        console.log('🚀 Customers component: Loading data...');
        setLoading(true);
        await refreshCustomers();
        console.log('✅ Customers loaded successfully');
        hasLoadedRef.current = true;
      } catch (err: any) {
        console.error('❌ Error in Customers component:', err);
        toast.error(err.message || 'Không thể tải dữ liệu khách hàng');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshCustomers]);

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

  // Transform customers to match component interface
  const transformedCustomers = customers.map(customer => ({
    id: customer.id,
    name: customer.fullname,
    email: customer.email,
    phone: customer.phone,
    totalOrders: 0, // Mock data - would need to calculate from orders
    totalSpent: 0, // Mock data - would need to calculate from orders  
    joinDate: customer.birthday || 'N/A',
    address: customer.addresses && customer.addresses.length > 0 
      ? customer.addresses.map(addr => `${addr.addressDetail}, ${addr.ward}, ${addr.city}`).join(' | ')
      : ''
  }));

  console.log('🔄 Transformed customers for display:', transformedCustomers);
  console.log('📈 Total transformed:', transformedCustomers?.length || 0);

  // Show customer edit page
  if (selectedCustomerId !== null) {
    const selectedCustomer = customers.find(customer => customer.id === selectedCustomerId);
    if (selectedCustomer) {
      // Transform customer data to match CustomerEdit interface
      const transformedCustomer = {
        id: selectedCustomer.id,
        name: selectedCustomer.fullname,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
        totalOrders: 0,
        totalSpent: 0,
        birthday: selectedCustomer.birthday || 'N/A',
        addresses: selectedCustomer.addresses || []
      };
      
      return (
        <CustomerEdit 
          customer={transformedCustomer} 
          onBack={() => setSelectedCustomerId(null)}
        />
      );
    }
  }

  // Show customer management
  return (
    <CustomerManagement 
      customers={transformedCustomers}
      onBack={() => navigate('/')}
      onCustomerClick={(customerId) => setSelectedCustomerId(customerId)}
    />
  );
}