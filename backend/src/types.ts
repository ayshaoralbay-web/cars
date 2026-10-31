export interface Car {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  hp: number;
  acceleration: number;
  top_speed: number;
  engine_type: string;
  image_url: string;
  chassis_code: string;
  year: number;
  is_featured: boolean;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  age?: number;
  password?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'hp_desc';
}