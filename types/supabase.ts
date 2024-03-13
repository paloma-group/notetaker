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
      note_tags: {
        Row: {
          created_at: string
          id: number
          note_id: number | null
          tag_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          note_id?: number | null
          tag_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          note_id?: number | null
          tag_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_note_tags_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_note_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      notes: {
        Row: {
          audio_file_id: string | null
          audio_file_path: string | null
          created_at: string
          fts_query: unknown | null
          highlights: string | null
          id: number
          title: string | null
          transcript: string | null
          user_id: string | null
        }
        Insert: {
          audio_file_id?: string | null
          audio_file_path?: string | null
          created_at?: string
          fts_query?: unknown | null
          highlights?: string | null
          id?: number
          title?: string | null
          transcript?: string | null
          user_id?: string | null
        }
        Update: {
          audio_file_id?: string | null
          audio_file_path?: string | null
          created_at?: string
          fts_query?: unknown | null
          highlights?: string | null
          id?: number
          title?: string | null
          transcript?: string | null
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
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      transformation_outputs: {
        Row: {
          created_at: string
          id: number
          note_id: number | null
          prompt_id: number | null
          transformed_text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          note_id?: number | null
          prompt_id?: number | null
          transformed_text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          note_id?: number | null
          prompt_id?: number | null
          transformed_text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_transcript_transformations_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: true
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_transcript_transformations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_transformation_outputs_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "transformation_prompts"
            referencedColumns: ["id"]
          }
        ]
      }
      transformation_prompts: {
        Row: {
          created_at: string
          id: number
          prompt: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          prompt: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          prompt?: string
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
