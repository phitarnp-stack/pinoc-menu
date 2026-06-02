"use client";

import { FormEvent, useState } from "react";
import type { TasteProfile } from "@/src/types/menu";
import { AdminBackLink } from "./AdminBackLink";

type TasteProfileCrudPageProps = {
  initialProfiles: TasteProfile[];
};

type ProfileFormState = {
  name: string;
  description: string;
  isActive: "active" | "inactive";
};

const defaultFormState: ProfileFormState = {
  name: "",
  description: "",
  isActive: "active",
};

const createSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function TasteProfileCrudPage({
  initialProfiles,
}: TasteProfileCrudPageProps) {
  const [profiles, setProfiles] = useState<TasteProfile[]>(initialProfiles);
  const [formState, setFormState] = useState<ProfileFormState>(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setFormState(defaultFormState);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextProfile: TasteProfile = {
      id: editingId ?? createSlug(formState.name),
      slug: editingId
        ? profiles.find((profile) => profile.id === editingId)?.slug ??
          createSlug(formState.name)
        : createSlug(formState.name),
      name: formState.name.trim(),
      description: formState.description.trim(),
      sortOrder: profiles.length + 1,
      isActive: formState.isActive === "active",
    };

    if (editingId) {
      setProfiles((current) =>
        current.map((profile) =>
          profile.id === editingId ? nextProfile : profile,
        ),
      );
    } else {
      setProfiles((current) => [nextProfile, ...current]);
    }

    resetForm();
  };

  const editProfile = (profile: TasteProfile) => {
    setEditingId(profile.id);
    setFormState({
      name: profile.name,
      description: profile.description,
      isActive: profile.isActive ? "active" : "inactive",
    });
  };

  const toggleStatus = (profileId: string) => {
    setProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId
          ? { ...profile, isActive: !profile.isActive }
          : profile,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-[#f6efe6] text-[#241710]">
      <section className="relative min-h-screen overflow-hidden px-6 py-8 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f9f1e7_0%,#ead9c2_48%,#caa37a_100%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl py-12 sm:py-16">
          <AdminBackLink
            label="Back to Admin"
            fallbackHref="/admin"
          />
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Taste Profiles
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#5f4635]">
            Manage recommendation tags used by products, menu items, and the
            future preference quiz.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/68 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold">
                  {editingId ? "Edit profile" : "Add profile"}
                </h2>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-[#3d2618]/14 px-4 py-2 text-sm font-semibold text-[#5f4635]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
              <div className="mt-7 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Name
                  <input
                    required
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Description
                  <textarea
                    required
                    value={formState.description}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className="min-h-28 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 py-3 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#5f4635]">
                  Status
                  <select
                    value={formState.isActive}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        isActive: event.target.value as "active" | "inactive",
                      }))
                    }
                    className="min-h-12 rounded-lg border border-[#3d2618]/14 bg-[#f6efe6]/70 px-4 text-[#241710] outline-none transition focus:border-[#7d4d2f]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <button
                type="submit"
                className="mt-7 min-h-12 w-full rounded-full bg-[#2b1a12] px-6 text-sm font-semibold text-[#fff8ed] shadow-[0_14px_30px_rgba(43,26,18,0.18)] transition hover:bg-[#412719]"
              >
                {editingId ? "Save Changes" : "Add Profile"}
              </button>
            </form>

            <div className="grid gap-4 sm:grid-cols-2">
              {profiles.map((profile) => (
                <article
                  key={profile.id}
                  className="rounded-lg border border-[#3d2618]/12 bg-[#fff8ed]/62 p-6 shadow-[0_18px_48px_rgba(84,55,34,0.12)] backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-semibold">{profile.name}</h2>
                    <span
                      className={
                        profile.isActive
                          ? "rounded-full bg-[#2b1a12] px-3 py-1 text-xs font-semibold text-[#fff8ed]"
                          : "rounded-full bg-[#7d4d2f]/15 px-3 py-1 text-xs font-semibold text-[#7d4d2f]"
                      }
                    >
                      {profile.isActive ? "active" : "inactive"}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#5f4635]">
                    {profile.description}
                  </p>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => editProfile(profile)}
                      className="min-h-11 rounded-full border border-[#3d2618]/14 px-5 text-sm font-semibold text-[#5f4635]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(profile.id)}
                      className="min-h-11 rounded-full bg-[#2b1a12] px-5 text-sm font-semibold text-[#fff8ed]"
                    >
                      {profile.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
