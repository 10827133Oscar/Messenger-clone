import DesktopSidebar from '@/components/sidebar/DesktopSidebar';
import ConversationList from '@/components/chat/ConversationList';
import getConversations from '@/actions/getConversations';
import getUsers from '@/actions/getUsers';

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <div className="h-full">
      <DesktopSidebar />
      <main className="lg:pl-20 h-full">
        <ConversationList initialItems={conversations} users={users} />
        {children}
      </main>
    </div>
  );
}
