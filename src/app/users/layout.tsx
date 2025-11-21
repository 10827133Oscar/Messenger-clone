import DesktopSidebar from '@/components/sidebar/DesktopSidebar';
import UserList from '@/components/UserList';
import getUsers from '@/actions/getUsers';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <div className="h-full">
      <DesktopSidebar />
      <main className="lg:pl-20 h-full">
        <UserList items={users} />
        {children}
      </main>
    </div>
  );
}
