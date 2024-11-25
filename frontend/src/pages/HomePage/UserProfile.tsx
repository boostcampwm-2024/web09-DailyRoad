import { User } from '@/types';

type UserProfileProps = {
  user: User;
};

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="flex items-center justify-between gap-1 rounded-lg border-[1px] border-c_button_gray p-2">
      <img className="h-8 w-8 rounded-full" src={user.profileImageUrl} />
      <p className="text-sm">{user.nickname}</p>
    </div>
  );
};

export default UserProfile;
