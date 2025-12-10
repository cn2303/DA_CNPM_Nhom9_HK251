const API_BASE_URL = 'http://localhost:8080';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API Error: ${response.status}`);
    }

    // Handle 200 OK with no body (like DELETE operations)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null as T;
    }

    return response.json();
  } catch (error) {
    // Check if it's a network error (backend not running)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('❌ Cannot connect to backend server at', API_BASE_URL);
      console.error('📌 Please make sure your Spring Boot backend is running on port 8080');
      throw new Error(`Cannot connect to server at ${API_BASE_URL}. Is the backend running?`);
    }
    throw error;
  }
}

// Book API
export const bookAPI = {
  getAll: () => apiCall<any[]>('/book'),
  getById: (id: number) => apiCall<any>(`/book/${id}`),
  create: (book: any) => apiCall<any>('/book', {
    method: 'POST',
    body: JSON.stringify(book),
  }),
  update: (book: any) => {
    // Transform the book data to match API expectations
    const bookData = {
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      language: book.language,
      author: book.author,
      publisher: book.publisher,
      description: book.description,
      price: book.price,
      quantity: book.quantity,
      publicationYear: book.publicationYear,
      status: book.status,
      numPage: book.numPage,
      nation: book.nation,
      size: book.size,
      type: book.type,
      averageRating: book.averageRating,
      imageUrl: book.imageUrl,
      // Transform categories to match API format: { category: { id: number } }
      categories: book.categories.map((cat: any) => ({
        category: {
          id: cat.category.id
        }
      }))
    };
    
    console.log('Sending book update:', JSON.stringify(bookData, null, 2));
    
    return apiCall<any>('/book', {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  },
  delete: (id: number) => apiCall<void>(`/book/${id}`, {
    method: 'DELETE',
  }),
};

// User API
export const userAPI = {
  getAll: () => {
    console.log('🌐 Calling GET /user');
    return apiCall<any[]>('/user');
  },
  getById: (id: number) => apiCall<any>(`/user/${id}`),
  create: (user: any) => apiCall<any>('/user', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  update: (user: any) => apiCall<any>('/user', {
    method: 'PUT',
    body: JSON.stringify(user),
  }),
  delete: (id: number) => apiCall<void>(`/user/${id}`, {
    method: 'DELETE',
  }),
};

// Order API
export const orderAPI = {
  getAll: () => apiCall<any[]>('/order'),
  getById: (id: number) => apiCall<any>(`/order/${id}`),
  getByUserId: (userId: number) => apiCall<any[]>(`/order/user/${userId}`),
  getByStatus: (status: string) => apiCall<any[]>(`/order/status/${status}`),
  getByUserIdAndStatus: (userId: number, status: string) => 
    apiCall<any[]>(`/order/user/${userId}/status/${status}`),
  create: (order: any) => apiCall<any>('/order', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  update: (order: any) => apiCall<any>('/order', {
    method: 'PUT',
    body: JSON.stringify(order),
  }),
  updateStatus: (orderId: number, status: string) => {
    console.log('🔄 API Call: PUT /order/' + orderId + '/status/' + status);
    return apiCall<any>(`/order/${orderId}/status/${status}`, {
      method: 'PUT',
    });
  },
  delete: (id: number) => apiCall<void>(`/order/${id}`, {
    method: 'DELETE',
  }),
};

// Voucher API
export const voucherAPI = {
  getAll: () => apiCall<any[]>('/voucher'),
  getByCode: (code: string) => apiCall<any>(`/voucher/${code}`),
  create: (voucher: any) => apiCall<any>('/voucher', {
    method: 'POST',
    body: JSON.stringify(voucher),
  }),
  update: (voucher: any) => apiCall<any>('/voucher', {
    method: 'PUT',
    body: JSON.stringify(voucher),
  }),
  delete: (code: string) => apiCall<void>(`/voucher/${code}`, {
    method: 'DELETE',
  }),
};

// Category API
export const categoryAPI = {
  getAll: () => apiCall<any[]>('/category'),
  getById: (id: number) => apiCall<any>(`/category/${id}`),
};

// Address API
export const addressAPI = {
  getAll: () => apiCall<any[]>('/address'),
  getById: (id: number) => apiCall<any>(`/address/${id}`),
  getByUserId: (userId: number) => apiCall<any[]>(`/address/user/${userId}`),
  create: (address: any) => apiCall<any>('/address', {
    method: 'POST',
    body: JSON.stringify(address),
  }),
  update: (address: any) => apiCall<any>('/address', {
    method: 'PUT',
    body: JSON.stringify(address),
  }),
  delete: (id: number) => apiCall<void>(`/address/${id}`, {
    method: 'DELETE',
  }),
};

// OrderAddress API
export const orderAddressAPI = {
  getAll: () => apiCall<any[]>('/OrderAddress'),
  getById: (id: number) => apiCall<any>(`/OrderAddress/${id}`),
  create: (orderAddress: any) => apiCall<any>('/OrderAddress', {
    method: 'POST',
    body: JSON.stringify(orderAddress),
  }),
  update: (orderAddress: any) => apiCall<any>('/OrderAddress', {
    method: 'PUT',
    body: JSON.stringify(orderAddress),
  }),
  delete: (id: number) => apiCall<void>(`/OrderAddress/${id}`, {
    method: 'DELETE',
  }),
};

// Cart API
export const cartAPI = {
  getAll: () => apiCall<any[]>('/cart'),
  getById: (id: number) => apiCall<any>(`/cart/${id}`),
  update: (cart: any) => apiCall<any>('/cart', {
    method: 'PUT',
    body: JSON.stringify(cart),
  }),
  addBook: (cartId: number, bookId: number) => apiCall<any>(`/cart/${cartId}/book/${bookId}`, {
    method: 'PUT',
  }),
  delete: (id: number) => apiCall<void>(`/cart/${id}`, {
    method: 'DELETE',
  }),
};

// Review API
export const reviewAPI = {
  getById: (id: number) => apiCall<any>(`/review/${id}`),
  getByBookId: (bookId: number) => apiCall<any[]>(`/review/book/${bookId}`),
  create: (review: any) => apiCall<any>('/review', {
    method: 'POST',
    body: JSON.stringify(review),
  }),
  update: (review: any) => apiCall<any>('/review', {
    method: 'PUT',
    body: JSON.stringify(review),
  }),
  delete: (id: number) => apiCall<void>(`/review/${id}`, {
    method: 'DELETE',
  }),
};