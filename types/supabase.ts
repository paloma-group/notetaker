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
      notes: {
        Row: {
          audio_file_id: string | null
          audio_file_path: string | null
          created_at: string
          id: number
          transcript: string | null
          highlights: string | null
          user_id: string | null
        }
        Insert: {
          audio_file_id?: string | null
          audio_file_path?: string | null
          created_at?: string
          id?: number
          transcript?: string | null
          highlights?: string | null
          user_id?: string | null
        }
        Update: {
          audio_file_id?: string | null
          audio_file_path?: string | null
          created_at?: string
          id?: number
          transcript?: string | null
          highlights?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transcript_transformation_inputs: {
        Row: {
          created_at: string
          id: number
          input: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          input: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          input?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_transcript_transformation_input_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transcript_transformations: {
        Row: {
          created_at: string
          id: number
          input_id: number | null
          note_id: number | null
          transformed_text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          input_id?: number | null
          note_id?: number | null
          transformed_text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          input_id?: number | null
          note_id?: number | null
          transformed_text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_transcript_transformations_input_id_fkey"
            columns: ["input_id"]
            isOneToOne: false
            referencedRelation: "transcript_transformation_inputs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_transcript_transformations_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_transcript_transformations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
