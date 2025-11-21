import getCurrentUser from '@/lib/getCurrentUser';
import Sidebar from './Sidebar';

export default async function DesktopSidebar() {
  const currentUser = await getCurrentUser();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 lg:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
      <Sidebar currentUser={currentUser ?? undefined} />
    </div>
  );
}
