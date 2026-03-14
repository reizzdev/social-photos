export interface User {
  id: string;
  username: string;
  avatar_url?: string;
}

export interface ProfileHeaderProps {
  user: any;
  me: User;
  isFollowing: (id: string) => boolean;
  handleFollow: (id: string) => void;
  handleUnfollow: (id: string) => void;
}

export interface FollowersListProps {
  title: string;
  users: any[];
  onClose: () => void;
  isOwner?: boolean;
  onRemoveFollower?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
}