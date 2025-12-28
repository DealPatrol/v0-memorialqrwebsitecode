export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      memorials: {
        Row: {
          id: string
          user_id: string
          name: string
          birth_date: string | null
          death_date: string | null
          bio: string | null
          cover_image_url: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          birth_date?: string | null
          death_date?: string | null
          bio?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          birth_date?: string | null
          death_date?: string | null
          bio?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          memorial_id: string
          name: string
          relationship: string
          birth_date: string | null
          death_date: string | null
          bio: string | null
          image_url: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          name: string
          relationship: string
          birth_date?: string | null
          death_date?: string | null
          bio?: string | null
          image_url?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          memorial_id?: string
          name?: string
          relationship?: string
          birth_date?: string | null
          death_date?: string | null
          bio?: string | null
          image_url?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      qr_codes: {
        Row: {
          id: string
          memorial_id: string
          unique_code: string
          design_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          unique_code: string
          design_type?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          memorial_id?: string
          unique_code?: string
          design_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          memorial_id: string
          media_type: string
          url: string
          caption: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          media_type: string
          url: string
          caption?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          memorial_id?: string
          media_type?: string
          url?: string
          caption?: string | null
          display_order?: number
          created_at?: string
        }
      }
      stories: {
        Row: {
          id: string
          memorial_id: string
          author_name: string
          content: string
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          author_name: string
          content: string
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          memorial_id?: string
          author_name?: string
          content?: string
          is_approved?: boolean
          created_at?: string
        }
      }
      visitors: {
        Row: {
          id: string
          memorial_id: string
          ip_address: string | null
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          ip_address?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          id?: string
          memorial_id?: string
          ip_address?: string | null
          user_agent?: string | null
          visited_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          start_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: string
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: string
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for the family tree
export type FamilyMember = Database["public"]["Tables"]["family_members"]["Row"]
export type FamilyMemberWithChildren = FamilyMember & { children?: FamilyMemberWithChildren[] }
