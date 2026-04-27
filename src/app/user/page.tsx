import UserForm from "@/components/UserForm";
import ProfilePicture from "@/components/ProfilePicture";
import { auth } from "@/auth";
import {
  getUserById,
  getUserNotificationPreferenceByUserId,
  getUserEmailByUserId,
  getUserPhoneNumberByUserId,
} from "@/db/queries";
import { getPfpUrl } from "@/lib/pfp";

export default async function UserPage() {
  const session = await auth();
  if (!session?.user) return null;
  const userId = parseInt(session.user.id);

  const [user, notificationPref, email, phone] = await Promise.all([
    getUserById(userId),
    getUserNotificationPreferenceByUserId(userId),
    getUserEmailByUserId(userId),
    getUserPhoneNumberByUserId(userId),
  ]);

  const pfpUrl = getPfpUrl(userId);

  return (
    <main className="flex min-h-screen items-center justify-center p-6 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px]">
      <div className="w-full max-w-lg my-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="text-center w-full col-span-3 space-y-6">
            <ProfilePicture
              userId={session.user.id}
              username={session.user.username ?? "U"}
              pfpUrl={pfpUrl}
              size="lg"
            />
          </div>
          <div className="text-2xl lg:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold"> User Profile: </h1>
              <h2 className="font-bold">{session.user.username}</h2>
            </div>
            <div className="block text-[12px] font-bold text-gray-400 uppercase mb-1">
              created on {user.created_at.toDateString()}
            </div>
            <div className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              user id {session.user.id}
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-[#232D4B] mb-4">Edit Profile:</h3>
        <UserForm
          email={email?.email}
          phone={phone?.phone}
          mailNotifs={!!notificationPref?.notify_by_mail}
          textNotifs={!!notificationPref?.notify_by_text}
        />
      </div>
    </main>
  );
}
