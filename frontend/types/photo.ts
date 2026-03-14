import { Dispatch, SetStateAction } from "react";

export interface Photo {
  id: string;

  image_url: string;

  censored: boolean;

  like_count?: number;

  user_id: string;

  users?: {
    id: string;

    username: string;

    avatar_url?: string;
  };

  photo_tags?: {
    tag_id: string;

    tags: {
      name: string;
    };
  }[];
}

export interface PhotoCardProps {
  photo: Photo;

  onDelete: (id: string) => void;

  onToggle: (id: string) => void;
}

export interface PhotoGridProps {
  photos: Photo[];

  setSelectedPhoto: (photo: Photo) => void;

  setFollowing?: Dispatch<SetStateAction<string[]>>;

  handleLike: (id: string) => void;

  showUsername?: boolean;

  showTags?: boolean;

  enableCensorship?: boolean;

  enableFollowUnlock?: boolean;

  masonry?: boolean;

  currentUser?: any;

  following?: string[];

  handleFollow?: (id: string) => void;

  setShowAuthModal?: (v: boolean) => void;
}

export interface PhotoModalProps {
  photo: Photo | null;

  onClose: () => void;

  handleLike: (id: string) => void;
}
