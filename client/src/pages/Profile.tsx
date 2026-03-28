import { format, parseISO } from "date-fns";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { AuthUser } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

function initials(user: AuthUser) {
  if (user.name?.trim()) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
    }
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-sm text-muted-foreground">Profile unavailable.</p>
        <Button asChild variant="outline">
          <Link to="/tasks">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  let joinedLabel = "—";
  try {
    joinedLabel = format(parseISO(user.created_at), "PPP");
  } catch {
    joinedLabel = user.created_at;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {initials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-2xl">
              {user.name?.trim() || "No name set"}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            Account details
          </h2>
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {user.email}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Display name</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {user.name?.trim() || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="mt-0.5 break-all font-mono text-xs text-foreground">
                {user.id}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {joinedLabel}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
