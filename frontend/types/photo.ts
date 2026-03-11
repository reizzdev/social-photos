export interface Photo {
  id: string;
  image_url: string;
  censored: boolean;
  like_count?: number;
}

export interface PhotoCardProps {
  photo: Photo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export interface PhotoGridProps {
  photos: Photo[];
  setSelectedPhoto: (photo: Photo) => void;
  handleLike: (id: string) => void;
}

export interface PhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
  handleLike: (id: string) => void;
}