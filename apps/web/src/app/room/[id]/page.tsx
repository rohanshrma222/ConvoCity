import GameCanvas from "../../components/GameCanvas";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;

  return (
    <main className="w-full h-screen overflow-hidden">
      <GameCanvas roomId={id} />
    </main>
  );
}
