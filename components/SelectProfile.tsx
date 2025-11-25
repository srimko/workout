import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Profile } from "@/lib/types"

interface SelectProfileProps {
  profiles: Profile[]
  onSubmit: (event: any) => void
  onValueChange: (value: any) => void
}

export function SelectProfile({ profiles, onSubmit, onValueChange }: SelectProfileProps) {
  return (
    <form className="flex flex-col justify-center py-2 max-w-2xl m-auto" onSubmit={onSubmit}>
      <div className="grid w-full items-center gap-3 mb-4">
        <Label htmlFor="profile">Profile</Label>
        <Select name="profile" onValueChange={onValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an profile" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile, _index) => (
              <SelectGroup key={profile.id}>
                <SelectItem key={profile.id} value={JSON.stringify(profile)}>
                  {profile.display_name}
                </SelectItem>
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  )
}
