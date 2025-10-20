
'use client';

import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { profilesApi } from "@/lib/api/profiles";
import { Profile } from "@/lib/types";
import Link from "next/link";

export default function UsersPage() {

    const [profiles, setProfiles] = useState<Profile[]>([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const profiles = await profilesApi.getAll();
                console.log("Fetched profiles:", profiles);
                setProfiles(profiles);
            }
            catch (error) {
                console.error("Error fetching profiles:", error);
            }
        };

        fetchProfiles();
    }, []);

    return (
        <section className="py-32">
            <div className="px-0 md:px-8">
                <div className="flex flex-col">
                    {profiles.map((profile) => (
                        <div className="flex justify-between gap-4 px-4 py-5 md:grid-cols-4" key={profile.id}>
                            <div className="flex items-center md:order-none">
                                <Avatar className="mr-2">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>AC</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-semibold">{profile.display_name}</h3>
                                    <p className="text-muted-foreground text-sm">
                                        {profile.birthday}
                                    </p>
                                </div>
                            </div>
                            <Link href={`/users/${profile.id}`} className="flex items-center gap-2">
                                <span>View profile</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            </section>
    )
}

