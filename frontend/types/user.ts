export interface User {
  id: string;
  username: string;
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
}