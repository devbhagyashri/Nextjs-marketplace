export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string | null;
  price: number;
  seller_id: string;
  seller_email?: string | null;
  image_url?: string | null;
  created_at?: string | null;
  interest_count?: number;
}

export interface CompanyInterest {
  id: string;
  created_at: string;
  company_id: string;
  user_id: string;
  buyer_email?: string | null;
  company_name?: string;
}
