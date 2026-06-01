import { TasteProfileCrudPage } from "@/src/components/admin/TasteProfileCrudPage";
import { getTasteProfiles } from "@/src/lib/menu/repositories";

export const dynamic = "force-dynamic";

export default async function AdminTasteProfilesPage() {
  const tasteProfiles = await getTasteProfiles();

  return <TasteProfileCrudPage initialProfiles={tasteProfiles} />;
}
