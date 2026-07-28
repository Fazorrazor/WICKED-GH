import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/account/login");
  }

  // Fetch client profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 px-6 pb-24 text-[#121212]">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-sans text-2xl font-bold tracking-[0.3em] uppercase mb-12">
          Client Profile
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="font-sans text-sm tracking-[0.2em] text-[#121212]/60 uppercase border-b border-black/10 pb-2">
              Dossier
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[0.65rem] text-[#121212]/40 uppercase tracking-widest mb-1">Email</p>
                <p className="font-sans text-sm">{session.user.email}</p>
              </div>
              <div>
                <p className="text-[0.65rem] text-[#121212]/40 uppercase tracking-widest mb-1">Name</p>
                <p className="font-sans text-sm">
                  {profile?.first_name || profile?.last_name 
                    ? `${profile.first_name || ''} ${profile.last_name || ''}` 
                    : "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-sans text-sm tracking-[0.2em] text-[#121212]/60 uppercase border-b border-black/10 pb-2">
              Order History
            </h2>
            <div className="text-[#121212]/40 text-sm italic">
              No recent orders found.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
