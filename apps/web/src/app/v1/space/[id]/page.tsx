import GameCanvas from "../../../components/GameCanvas";

interface SpaceRoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function SpaceRoomPage({ params }: SpaceRoomPageProps) {
  const { id } = await params;

  return (
    <main className="h-screen w-full overflow-hidden">
      <GameCanvas roomId={id} />
    </main>
  );
}
