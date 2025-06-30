// =====================================================
// SUPABASE DATABASE TYPES - BRITISH ENGLISH
// File: app/lib/supabase.ts
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organisations: {
        Row: {
          id: string
          name: string
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      properties: {
        Row: {
          id: string
          name: string
          address: string
          organisation_id: string
          property_type: string
          risk_score: number | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          address: string
          organisation_id: string
          property_type?: string
          risk_score?: number | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          address?: string
          organisation_id?: string
          property_type?: string
          risk_score?: number | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      user_permissions: {
        Row: {
          id: string
          user_id: string
          organisation_id: string
          role: string
          can_view_properties: boolean
          can_edit_properties: boolean
          can_view_reports: boolean
          can_upload_documents: boolean
          can_manage_users: boolean
          can_view_analytics: boolean
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          organisation_id: string
          role?: string
          can_view_properties?: boolean
          can_edit_properties?: boolean
          can_view_reports?: boolean
          can_upload_documents?: boolean
          can_manage_users?: boolean
          can_view_analytics?: boolean
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          organisation_id?: string
          role?: string
          can_view_properties?: boolean
          can_edit_properties?: boolean
          can_view_reports?: boolean
          can_upload_documents?: boolean
          can_manage_users?: boolean
          can_view_analytics?: boolean
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      drainage_reports: {
        Row: {
          id: string
          property_id: string
          inspection_type: string
          inspector_name: string
          inspection_date: string
          next_inspection_due: string | null
          drainage_condition: string | null
          blockages_found: boolean
          blockage_location: string | null
          damage_found: boolean
          damage_description: string | null
          cleaning_performed: boolean
          repairs_required: boolean
          repair_description: string | null
          repair_priority: string | null
          risk_rating: string | null
          recommendations: string | null
          photos_taken: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          inspection_type: string
          inspector_name: string
          inspection_date: string
          next_inspection_due?: string | null
          drainage_condition?: string | null
          blockages_found?: boolean
          blockage_location?: string | null
          damage_found?: boolean
          damage_description?: string | null
          cleaning_performed?: boolean
          repairs_required?: boolean
          repair_description?: string | null
          repair_priority?: string | null
          risk_rating?: string | null
          recommendations?: string | null
          photos_taken?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          inspection_type?: string
          inspector_name?: string
          inspection_date?: string
          next_inspection_due?: string | null
          drainage_condition?: string | null
          blockages_found?: boolean
          blockage_location?: string | null
          damage_found?: boolean
          damage_description?: string | null
          cleaning_performed?: boolean
          repairs_required?: boolean
          repair_description?: string | null
          repair_priority?: string | null
          risk_rating?: string | null
          recommendations?: string | null
          photos_taken?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      electrical_reports: {
        Row: {
          id: string
          property_id: string
          inspection_type: string
          certificate_number: string | null
          inspector_name: string
          inspector_qualification: string | null
          inspection_date: string
          next_inspection_due: string | null
          overall_condition: string | null
          remedial_work_required: boolean
          remedial_work_description: string | null
          remedial_work_priority: string | null
          test_results: Json | null
          risk_rating: string | null
          compliance_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          inspection_type: string
          certificate_number?: string | null
          inspector_name: string
          inspector_qualification?: string | null
          inspection_date: string
          next_inspection_due?: string | null
          overall_condition?: string | null
          remedial_work_required?: boolean
          remedial_work_description?: string | null
          remedial_work_priority?: string | null
          test_results?: Json | null
          risk_rating?: string | null
          compliance_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          inspection_type?: string
          certificate_number?: string | null
          inspector_name?: string
          inspector_qualification?: string | null
          inspection_date?: string
          next_inspection_due?: string | null
          overall_condition?: string | null
          remedial_work_required?: boolean
          remedial_work_description?: string | null
          remedial_work_priority?: string | null
          test_results?: Json | null
          risk_rating?: string | null
          compliance_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          property_id: string
          filename: string
          file_path: string
          file_size: number
          file_type: string
          document_type: string
          uploaded_by: string
          uploaded_at: string
          description: string | null
          tags: string[] | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          filename: string
          file_path: string
          file_size: number
          file_type: string
          document_type: string
          uploaded_by: string
          uploaded_at?: string
          description?: string | null
          tags?: string[] | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          filename?: string
          file_path?: string
          file_size?: number
          file_type?: string
          document_type?: string
          uploaded_by?: string
          uploaded_at?: string
          description?: string | null
          tags?: string[] | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      property_managers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          organisation_id: string
          specialisation: string | null
          experience_years: number | null
          risk_level: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          organisation_id: string
          specialisation?: string | null
          experience_years?: number | null
          risk_level?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          organisation_id?: string
          specialisation?: string | null
          experience_years?: number | null
          risk_level?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      property_manager_assignments: {
        Row: {
          id: string
          property_id: string
          manager_id: string
          assigned_at: string
          assigned_by: string
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          manager_id: string
          assigned_at?: string
          assigned_by: string
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          manager_id?: string
          assigned_at?: string
          assigned_by?: string
          is_active?: boolean
          notes?: string | null
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