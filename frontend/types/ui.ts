export interface ProfileStatsProps {
  photos: any[];
  followers: any[];
  following: any[];
  setShowFollowers: (v: boolean) => void;
  setShowFollowing: (v: boolean) => void;
}