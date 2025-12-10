const API_BASE_URL = 'http://localhost:8080';

async function apiCall(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API Error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('❌ Cannot connect to backend server at', API_BASE_URL);
      console.error('📌 Please make sure your Spring Boot backend is running on port 8080');
      throw new Error(`Cannot connect to server at ${API_BASE_URL}. Is the backend running?`);
    }
    throw error;
  }
}

export const bookAPI = {
  getAll: () => apiCall('/book'),
  getById: (id) => apiCall(`/book/${id}`),
  create: (book) => apiCall('/book', {
    method: 'POST',
    body: JSON.stringify(book),
  }),
  update: (book) => {
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
      categories: book.categories.map((cat) => ({
        category: {
          id: cat.category.id
        }
      }))
    };
    
    console.log('Sending book update:', JSON.stringify(bookData, null, 2));
    
    return apiCall('/book', {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  },
  delete: (id) => apiCall(`/book/${id}`, {
    method: 'DELETE',
  }),
};

export const userAPI = {
  getAll: () => {
    return apiCall('/user');
  },
  getById: (id) => apiCall(`/user/${id}`),
  create: (user) => apiCall('/user', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  update: (user) => apiCall('/user', {
    method: 'PUT',
    body: JSON.stringify(user),
  }),
  delete: (id) => apiCall(`/user/${id}`, {
    method: 'DELETE',
  }),
};

export const orderAPI = {
  getAll: () => apiCall('/order'),
  
  getById: (id) => apiCall(`/order/${id}`),
  
  getByUserId: (userId) => apiCall(`/order/user/${userId}`),
  
  getByStatus: (status) => apiCall(`/order/status/${status}`),
  
  getByUserIdAndStatus: (userId, status) => 
    apiCall(`/order/user/${userId}/status/${status}`),
  
  create: (order) => apiCall('/order', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  
  update: (order) => apiCall('/order', {
    method: 'PUT',
    body: JSON.stringify(order),
  }),
  
  updateStatus: (orderId, status) => {
    console.log(`🔄 Updating order ${orderId} status to: ${status}`);
    return apiCall(`/order/${orderId}/status/${status}`, {
      method: 'PUT',
    });
  },
  
  delete: (id) => apiCall(`/order/${id}`, {
    method: 'DELETE',
  }),
};

export const voucherAPI = {
  getAll: () => apiCall('/voucher'),
  getByCode: (code) => apiCall(`/voucher/${code}`),
  create: (voucher) => apiCall('/voucher', {
    method: 'POST',
    body: JSON.stringify(voucher),
  }),
  update: (voucher) => apiCall('/voucher', {
    method: 'PUT',
    body: JSON.stringify(voucher),
  }),
  delete: (code) => apiCall(`/voucher/${code}`, {
    method: 'DELETE',
  }),
};

export const categoryAPI = {
  getAll: () => apiCall('/category'),
  getById: (id) => apiCall(`/category/${id}`),
};

export const addressAPI = {
  getAll: () => apiCall('/address'),
  getById: (id) => apiCall(`/address/${id}`),
  getByUserId: (userId) => apiCall(`/address/user/${userId}`),
  create: (address) => apiCall('/address', {
    method: 'POST',
    body: JSON.stringify(address),
  }),
  update: (address) => apiCall('/address', {
    method: 'PUT',
    body: JSON.stringify(address),
  }),
  delete: (id) => apiCall(`/address/${id}`, {
    method: 'DELETE',
  }),
};

export const orderAddressAPI = {
  getAll: () => apiCall('/OrderAddress'),
  getById: (id) => apiCall(`/OrderAddress/${id}`),
  create: (orderAddress) => apiCall('/OrderAddress', {
    method: 'POST',
    body: JSON.stringify(orderAddress),
  }),
  update: (orderAddress) => apiCall('/OrderAddress', {
    method: 'PUT',
    body: JSON.stringify(orderAddress),
  }),
  delete: (id) => apiCall(`/OrderAddress/${id}`, {
    method: 'DELETE',
  }),
};

export const cartAPI = {
  getAll: () => apiCall('/cart'),
  getById: (id) => apiCall(`/cart/${id}`),
  update: (cart) => apiCall('/cart', {
    method: 'PUT',
    body: JSON.stringify(cart),
  }),
  addBook: (cartId, bookId) => apiCall(`/cart/${cartId}/book/${bookId}`, {
    method: 'PUT',
  }),
  delete: (id) => apiCall(`/cart/${id}`, {
    method: 'DELETE',
  }),
};

export const reviewAPI = {
  getById: (id) => apiCall(`/review/${id}`),
  getByBookId: (bookId) => apiCall(`/review/book/${bookId}`),
  create: (review) => apiCall('/review', {
    method: 'POST',
    body: JSON.stringify(review),
  }),
  update: (review) => apiCall('/review', {
    method: 'PUT',
    body: JSON.stringify(review),
  }),
  delete: (id) => apiCall(`/review/${id}`, {
    method: 'DELETE',
  }),
};
