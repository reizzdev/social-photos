export interface Collection {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  goal_amount: number;
  current_amount: number;
  deadline_hours: number;
  deadline_at?: string;
  completed: boolean;
  created_at: string;

  users?: {
    id: string;
    username: string;
    avatar_url?: string;
  };

  photos?: {
    id: string;
    image_url: string;
    access_type: string;
    censored: boolean;
    like_count?: number;
    user_id: string;
    photo_tags?: {
      tag_id: string;
      tags: { name: string };
    }[];
  }[];
}

export interface CreateCollectionDto {
  title: string;
  description?: string;
  goal_amount?: number;
  deadline_hours?: number;
}