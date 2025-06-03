export interface User {
    id: string
    email: string
    company_name?: string
    subscription_plan: 'starter' | 'professional' | 'enterprise'
    created_at: string
  }
  
  export interface Property {
    id: string
    user_id: string
    name: string
    address: string
    risk_score: number
    safety_score: number
    created_at: string
    updated_at: string
  }
  
  export interface RiskAssessment {
    id: string
    property_id: string
    fire_safety_score: number
    security_score: number
    maintenance_score: number
    staff_training_score: number
    overall_score: number
    assessed_date: string
  }
  
  export interface SafetyTask {
    id: string
    property_id: string
    title: string
    description: string
    task_type: 'fire_safety' | 'security' | 'maintenance' | 'training'
    status: 'pending' | 'in_progress' | 'completed'
    due_date: string
    completed_date?: string
  }