export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface PaginatedApiResponse<T> extends Omit<ApiResponse<T>, 'data'> {
  data: T[];
  pagination: Pagination;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  dateJoined: string;
  totalSpend: number;
  totalOrders: number;
}

export interface OrderHistory {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  purchasedAt: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
}

export interface CustomerDetail extends Customer {
  phoneNumber: string;
  orderHistory: OrderHistory[];
  orderHistoryPagination: Pagination;
}

export interface OrderItem {
  id: string;
  productId: string;
  productVariantId: string | null;
  productName: string;
  productSku: string;
  categoryName: string;
  selectedOptions: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: string;
  pickupLocation: string | null;
  shippingAddress: string | null;
  landmark: string | null;
  city: string | null;
  state: string | null;
  purchasedAt: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  items: OrderItem[];
}

export interface ProductImage {
  id: string;
  url: string;
  displayOrder?: number;
}

export interface CatalogueProperty {
  label: string;
  value: string;
  count: number;
  displayFormat: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  sellingPrice: number;
  unitsAvailable: number;
  unitsSold: number;
  isActive: boolean;
  stockStatus: string;
  attributeValues: {
    attributeName: string;
    value: string;
    slug: string;
  }[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  price: number;
  type: "Simple" | "Variable" | string;
  stockStatus: string;
  primaryImageUrl?: string;
  unitsAvailable?: number;
  unitsSold?: number;
  publishedAt?: string;
  createdDate?: string;
  shortDescription?: string;
  longDescription?: string;
  status?: string;
  categoryId?: string;
  variantCount?: number;
  minVariantPrice?: number | null;
  maxVariantPrice?: number | null;
  images?: ProductImage[];
  catalogueProperties?: CatalogueProperty[];
  variants?: ProductVariant[];
  attributes?: {
    name: string;
    slug: string;
  }[];
}

export interface WaitlistEntry {
  id: string;
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  createdDate: string;
}
