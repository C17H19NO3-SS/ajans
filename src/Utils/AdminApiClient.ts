import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

/** ------------ Ortak tipler ------------ */
export type AdminUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  company: string | null;
};

export type AuthSuccessResponse = {
  ok: true;
  token: string;
  expiresAt: string; // ISO
  user: AdminUser;
};

export type AuthErrorResponse = {
  ok: false;
  error: string;
  ip?: string;
};

/** ------------ Dashboard ------------ */
export type DashboardResponse = {
  stats: {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    activeSessions: number;
  };
  latestProducts: {
    id: string;
    title: string;
    category: string | null;
    updatedAt: string;
  }[];
  latestUsers: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }[];
};

/** ------------ Sözlükler / Listeler ------------ */
export type Category = { id: string; title: string };

export type ProductRow = {
  id: string;
  title: string;
  status: "published" | "archived";
  price: string | null;
  categoryId: string | null;
  category: string | null;
  updatedAt: string;
};

export type ProductsListResponse = { items: ProductRow[] };

export type UserRow = {
  id: string;
  email: string;
  name: string;
  company: string | null;
  position: string | null;
  createdAt: string;
};

export type UsersListResponse = { items: UserRow[] };

/** ------------ Çeviri tipleri ------------ */
export type ProductTranslationInput = {
  localeCode: string;
  title?: string | null;
  price?: string | null;
  description?: string | null;
};
export type ProductTranslationRow = {
  localeCode: string;
  title: string;
  price: string | null;
  description: string | null;
};
export type ProductTranslationsListResponse = {
  items: ProductTranslationRow[];
};

/** ------------ Görseller ------------ */
export type ProductImage = {
  id: string;
  url: string;
  localeCode: string | null;
  createdAt: string;
};
export type ProductImagesListResponse = { items: ProductImage[] };

/** ------------ Ürün create/update gövdesi ------------ */
export type ProductCreateBody = {
  title: string;
  price?: string | null;
  categoryId?: string | null;
  status?: "published" | "archived";
  description?: string | null;
  translations?: ProductTranslationInput[];
};

export type ProductUpdateBody = {
  title?: string;
  price?: string | null;
  categoryId?: string | null;
  status?: "published" | "archived";
  description?: string | null;
  translations?: ProductTranslationInput[];
};

/** ------------ Kullanıcı güncelle ------------ */
export type UserUpdateBody = {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  position?: string | null;
};

/** ------------ Satın alma ------------ */
export type PurchaseItemInput = {
  productId?: string;
  title?: string;
  quantity: number;
  unitPrice: number;
};
export type PurchaseCreateBody = {
  userId: string;
  items: PurchaseItemInput[];
  notes?: string;
  currency?: string;
};
export type PurchaseItemRow = {
  id: string;
  productId: string | null;
  title: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  createdAt: string;
};
export type PurchaseRow = {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: PurchaseItemRow[];
};
export type PurchasesListResponse = {
  items: {
    id: string;
    userId: string;
    orderNumber: string;
    totalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

/** ------------ İstemci ------------ */
export class AdminApiClient {
  private http: AxiosInstance;
  private token?: string;
  private onUnauthorized?: () => void;

  constructor(
    baseURL = "/api/admin",
    config?: AxiosRequestConfig,
    opts?: { token?: string; onUnauthorized?: () => void }
  ) {
    this.token = opts?.token;
    this.onUnauthorized = opts?.onUnauthorized;

    this.http = axios.create({ baseURL, ...config });

    this.http.interceptors.request.use((cfg) => {
      if (this.token) {
        (cfg.headers as any) = {
          ...(cfg.headers ?? {}),
          Authorization: `Bearer ${this.token}`,
        };
      }
      return cfg;
    });

    this.http.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err?.response?.status === 401 && this.onUnauthorized) {
          this.onUnauthorized();
        }
        return Promise.reject(err);
      }
    );
  }

  setToken(token?: string) {
    this.token = token;
  }
  getToken() {
    return this.token;
  }
  clearToken() {
    this.token = undefined;
  }
  setOnUnauthorized(cb?: () => void) {
    this.onUnauthorized = cb;
  }

  /** --------- Auth --------- */
  async login(email: string, password: string): Promise<AuthSuccessResponse> {
    const { data } = await this.http.post<AuthSuccessResponse>("/auth/login", {
      email,
      password,
    });
    this.token = data.token;
    return data;
  }
  async me(): Promise<{ ok: true; user: AdminUser }> {
    const { data } = await this.http.get<{ ok: true; user: AdminUser }>(
      "/auth/me"
    );
    return data;
  }
  async logout(): Promise<{ ok: true }> {
    const { data } = await this.http.post<{ ok: true }>("/auth/logout");
    this.clearToken();
    return data;
  }

  /** --------- Dashboard --------- */
  async dashboardOverview(): Promise<DashboardResponse> {
    const { data } = await this.http.get<DashboardResponse>(
      "/dashboard/overview"
    );
    return data;
  }

  /** --------- Kategori --------- */
  async categories(): Promise<Category[]> {
    const { data } = await this.http.get<Category[]>("/categories");
    return data;
  }
  async createCategory(title: string): Promise<Category> {
    const { data } = await this.http.post<Category>("/categories", { title });
    return data;
  }
  async updateCategory(
    id: string,
    patch: { title: string }
  ): Promise<Category> {
    const { data } = await this.http.patch<Category>(
      `/categories/${id}`,
      patch
    );
    return data;
  }
  async deleteCategory(id: string): Promise<{ ok: true }> {
    const { data } = await this.http.delete<{ ok: true }>(`/categories/${id}`);
    return data;
  }

  /** --------- Ürünler --------- */
  async products(limit = 20): Promise<ProductsListResponse> {
    const { data } = await this.http.get<ProductsListResponse>("/products", {
      params: { limit },
    });
    return data;
  }
  async getProduct(id: string): Promise<ProductRow> {
    const { data } = await this.http.get<ProductRow>(`/products/${id}`);
    return data;
  }
  async getProductTranslations(
    id: string
  ): Promise<ProductTranslationsListResponse> {
    const { data } = await this.http.get<ProductTranslationsListResponse>(
      `/products/${id}/translations`
    );
    return data;
  }
  async getProductImages(id: string): Promise<ProductImagesListResponse> {
    const { data } = await this.http.get<ProductImagesListResponse>(
      `/products/${id}/images`
    );
    return data;
  }
  async uploadProductImage(
    id: string,
    file: File,
    locale?: string
  ): Promise<ProductImage> {
    const form = new FormData();
    form.append("image", file);
    if (locale) form.append("locale", locale);
    const { data } = await this.http.post<ProductImage>(
      `/products/${id}/images`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  }
  async createProduct(body: ProductCreateBody): Promise<ProductRow> {
    const { data } = await this.http.post<ProductRow>("/products", body);
    return data;
  }
  async updateProduct(
    id: string,
    body: ProductUpdateBody
  ): Promise<ProductRow> {
    const { data } = await this.http.patch<ProductRow>(`/products/${id}`, body);
    return data;
  }
  async deleteProduct(id: string): Promise<{ ok: true }> {
    const { data } = await this.http.delete<{ ok: true }>(`/products/${id}`);
    return data;
  }
  async setProductStatus(
    id: string,
    status: "published" | "archived"
  ): Promise<ProductRow> {
    const { data } = await this.http.patch<ProductRow>(`/products/${id}`, {
      status,
    });
    return data;
  }

  /** --------- Kullanıcılar --------- */
  async users(limit = 20): Promise<UsersListResponse> {
    const { data } = await this.http.get<UsersListResponse>("/users", {
      params: { limit },
    });
    return data;
  }
  async updateUser(id: string, body: UserUpdateBody): Promise<UserRow> {
    const { data } = await this.http.patch<UserRow>(`/users/${id}`, body);
    return data;
  }
}
