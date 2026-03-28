"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";

type SpaceSummary = {
  id: string;
  name: string;
  createdAt: string;
  ownerId: string;
  _count: {
    members: number;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function SpaceCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
      </CardContent>
      <CardFooter className="justify-between">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </CardFooter>
    </Card>
  );
}

export default function SpaceDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, logout } = useAuth();
  const [spaces, setSpaces] = useState<SpaceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinOpen, setJoinOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joinLoading, startJoinTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [routePending, startRouteTransition] = useTransition();

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let active = true;

    async function loadSpaces() {
      try {
        const response = await apiFetch<SpaceSummary[]>("/space");

        if (active) {
          setSpaces(response.data);
        }
      } catch (error) {
        if (active) {
          toast({
            title: error instanceof Error ? error.message : "Unable to load spaces",
            variant: "error",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSpaces();

    return () => {
      active = false;
    };
  }, [authLoading, toast, user]);

  const emptyState = !loading && spaces.length === 0;
  const isBusy = routePending || authLoading;

  const heading = useMemo(() => {
    if (!user?.username) {
      return "Your Spaces";
    }

    return `${user.username.split(" ")[0]}'s Spaces`;
  }, [user?.username]);

  async function handleJoinSpace() {
    if (inviteCode.trim().length !== 6) {
      toast({
        title: "Invite code must be 6 characters",
        variant: "error",
      });
      return;
    }

    startJoinTransition(async () => {
      try {
        const response = await apiFetch<{ id: string }>("/space/join", {
          method: "POST",
          body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() }),
        });

        toast({
          title: "Joined space!",
          variant: "success",
        });

        setJoinOpen(false);
        setInviteCode("");
        router.push(`/v1/space/${response.data.id}`);
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : "Unable to join space",
          variant: "error",
        });
      }
    });
  }

  async function handleDeleteSpace(spaceId: string) {
    setDeleteId(spaceId);

    try {
      await apiFetch<{ message?: string }>(`/space/${spaceId}`, {
        method: "DELETE",
      });

      setSpaces((current) => current.filter((space) => space.id !== spaceId));
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Unable to delete space",
        variant: "error",
      });
    } finally {
      setDeleteId(null);
    }
  }

  function navigate(path: string) {
    startRouteTransition(() => {
      router.push(path);
    });
  }

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-[#f0f2ff]">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(108,99,255,0.18),transparent_58%)]" />
      <header className="relative border-b border-white/8 bg-[#101222]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#6c63ff] text-lg shadow-[0_10px_30px_rgba(108,99,255,0.35)]">
              C
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#cfd4ff]">ConvoCity</p>
              <p className="text-xs text-[#7d87b8]">Virtual spaces that feel inhabited</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-9 bg-[#2d3152]">
              <AvatarFallback>{user?.email?.slice(0, 2).toUpperCase() ?? "CC"}</AvatarFallback>
            </Avatar>
            <p className="hidden text-sm text-[#b4bce6] sm:block">{user?.email ?? "Loading user..."}</p>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-[#8b92b8]">Dashboard</p>
            <h1 className="text-4xl font-semibold tracking-tight">{heading}</h1>
            <p className="max-w-2xl text-sm text-[#9da6d3]">
              Pick up where your conversations left off, jump in with a code, or spin up a new floor plan.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="min-w-40" disabled={isBusy} onClick={() => navigate("/v1/create")}>
              Create Space
            </Button>
            <Button className="min-w-40" disabled={isBusy} onClick={() => setJoinOpen(true)} variant="secondary">
              Enter with Code
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SpaceCardSkeleton key={index} />
            ))}
          </div>
        ) : emptyState ? (
          <Card className="overflow-hidden">
            <CardContent className="grid gap-8 px-6 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-10">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.24em] text-[#8b92b8]">No spaces yet</p>
                <h2 className="text-3xl font-semibold tracking-tight text-[#f7f8ff]">
                  Build your first district and invite people in.
                </h2>
                <p className="max-w-xl text-sm leading-7 text-[#97a0ca]">
                  Start with a template, give it a name, and shape the first place your team gathers inside
                  ConvoCity.
                </p>
                <Button className="mt-2" onClick={() => navigate("/v1/create")}>
                  Create your first space
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-56 w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(108,99,255,0.18),rgba(108,99,255,0.02))] p-5">
                  <div className="absolute inset-4 rounded-[28px] border border-dashed border-white/10" />
                  <div className="absolute left-8 top-8 h-20 w-24 rounded-[24px] bg-[#232846]" />
                  <div className="absolute left-40 top-10 h-14 w-20 rounded-[22px] bg-[#313860]" />
                  <div className="absolute bottom-12 left-10 h-16 w-32 rounded-[28px] bg-[#1b2037]" />
                  <div className="absolute bottom-8 right-10 h-24 w-24 rounded-full bg-[#6c63ff]/20 blur-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {spaces.map((space) => {
              const isOwner = space.ownerId === user?.id;

              return (
                <Card
                  key={space.id}
                  className="group overflow-hidden transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-white/16 hover:shadow-[0_22px_60px_rgba(6,7,16,0.5)]"
                >
                  <CardHeader>
                    <CardTitle>{space.name}</CardTitle>
                    <CardDescription>Created {formatDate(space.createdAt)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-[26px] border border-white/8 bg-[linear-gradient(135deg,rgba(108,99,255,0.14),rgba(108,99,255,0.02))] p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.24em] text-[#8b92b8]">Members</p>
                        <p className="text-2xl font-semibold">{space._count.members}</p>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: Math.min(space._count.members, 5) }).map((_, index) => (
                          <div
                            key={index}
                            className="h-9 rounded-full border border-white/10 bg-[#2b3154] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button onClick={() => navigate(`/v1/space/${space.id}`)} variant="secondary">
                      Enter
                    </Button>
                    {isOwner ? (
                      <Button
                        disabled={deleteId === space.id}
                        onClick={() => handleDeleteSpace(space.id)}
                        variant="destructive"
                      >
                        {deleteId === space.id ? "Deleting..." : "Delete"}
                      </Button>
                    ) : (
                      <div className="text-xs uppercase tracking-[0.24em] text-[#7f88b6]">Member</div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Dialog onOpenChange={setJoinOpen} open={joinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter with invite code</DialogTitle>
            <DialogDescription>
              Drop in instantly if someone already shared a six-character invite code with you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#cfd4ff]" htmlFor="invite-code">
              Invite code
            </label>
            <Input
              autoFocus
              id="invite-code"
              maxLength={6}
              onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
              placeholder="A1B2C3"
              value={inviteCode}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setJoinOpen(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button disabled={joinLoading} onClick={handleJoinSpace} type="button">
              {joinLoading ? "Joining..." : "Join space"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
