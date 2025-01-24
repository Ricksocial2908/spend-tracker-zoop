export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          amount: number
          client: string
          created_at: string
          date: string | null
          frequency: string
          id: number
          name: string
          status: string
          type: string
          used_for: string
        }
        Insert: {
          amount: number
          client: string
          created_at?: string
          date?: string | null
          frequency: string
          id?: number
          name: string
          status?: string
          type: string
          used_for?: string
        }
        Update: {
          amount?: number
          client?: string
          created_at?: string
          date?: string | null
          frequency?: string
          id?: number
          name?: string
          status?: string
          type?: string
          used_for?: string
        }
        Relationships: []
      }
      project_payments: {
        Row: {
          amount: number
          contractor_name: string | null
          created_at: string
          id: number
          import_batch_id: string | null
          invoice_reference: string
          paid_amount: number
          payment_date: string
          payment_type: string
          project_id: number
        }
        Insert: {
          amount: number
          contractor_name?: string | null
          created_at?: string
          id?: never
          import_batch_id?: string | null
          invoice_reference: string
          paid_amount?: number
          payment_date: string
          payment_type?: string
          project_id: number
        }
        Update: {
          amount?: number
          contractor_name?: string | null
          created_at?: string
          id?: never
          import_batch_id?: string | null
          invoice_reference?: string
          paid_amount?: number
          payment_date?: string
          payment_type?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          billable_rate: number | null
          budget: number | null
          client: string | null
          created_at: string
          design_cost: number
          end_date: string | null
          external_cost: number
          external_cost_category: string
          id: number
          internal_cost: number
          internal_cost_category: string
          is_draft: boolean
          modeling_3d_cost: number
          name: string
          notes: string | null
          project_code: string | null
          project_type: string | null
          rendering_cost: number
          sales_price: number
          software_cost: number
          software_cost_category: string
          software_development_cost: number
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          vr_development_cost: number
        }
        Insert: {
          billable_rate?: number | null
          budget?: number | null
          client?: string | null
          created_at?: string
          design_cost?: number
          end_date?: string | null
          external_cost?: number
          external_cost_category?: string
          id?: never
          internal_cost?: number
          internal_cost_category?: string
          is_draft?: boolean
          modeling_3d_cost?: number
          name: string
          notes?: string | null
          project_code?: string | null
          project_type?: string | null
          rendering_cost?: number
          sales_price?: number
          software_cost?: number
          software_cost_category?: string
          software_development_cost?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          vr_development_cost?: number
        }
        Update: {
          billable_rate?: number | null
          budget?: number | null
          client?: string | null
          created_at?: string
          design_cost?: number
          end_date?: string | null
          external_cost?: number
          external_cost_category?: string
          id?: never
          internal_cost?: number
          internal_cost_category?: string
          is_draft?: boolean
          modeling_3d_cost?: number
          name?: string
          notes?: string | null
          project_code?: string | null
          project_type?: string | null
          rendering_cost?: number
          sales_price?: number
          software_cost?: number
          software_cost_category?: string
          software_development_cost?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          vr_development_cost?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      payment_type_enum:
        | "internal"
        | "contractor"
        | "services"
        | "software"
        | "stock"
      project_status:
        | "pending"
        | "active"
        | "completed"
        | "on_hold"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
