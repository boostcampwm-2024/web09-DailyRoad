import { User } from '@/types';

type UserProfileProps = {
  user: User;
};

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border-[1px] border-c_button_gray p-2">
      <img
        alt={`${user.nickname}님의 프로필 사진`}
        className="h-8 w-8 rounded-full"
        src={user.profileImageUrl}
      />
      <p className="text-sm">{user.nickname}</p>
    </div>
  );
};

export default UserProfile;
