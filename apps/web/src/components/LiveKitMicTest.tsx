"use client";

import { useEffect, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrackPublication,
} from "livekit-client";
import { fetchLiveKitToken } from "@/lib/livekit";

type Status =
  | "idle"
  | "fetching-token"
  | "connecting"
  | "connected"
  | "failed";

export default function LiveKitMicTest({ spaceId }: { spaceId: string }) {
  const roomRef = useRef<Room | null>(null);
  const audioElsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [remoteParticipants, setRemoteParticipants] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function connect() {
      try {
        setStatus("fetching-token");
        setErrorMessage("");

        const { token, url } = await fetchLiveKitToken(spaceId);
        if (!active) return;

        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        roomRef.current = room;

        room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
          setRemoteParticipants((current) =>
            current.includes(participant.identity) ? current : [...current, participant.identity],
          );
        });

        room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
          setRemoteParticipants((current) => current.filter((id) => id !== participant.identity));

          const audioEl = audioElsRef.current.get(participant.identity);
          if (audioEl) {
            audioEl.remove();
            audioElsRef.current.delete(participant.identity);
          }
        });

        room.on(
          RoomEvent.TrackSubscribed,
          (track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
            if (track.kind !== Track.Kind.Audio) return;

            const existing = audioElsRef.current.get(participant.identity);
            if (existing) {
              existing.remove();
              audioElsRef.current.delete(participant.identity);
            }

            const audioEl = track.attach();
            audioEl.autoplay = true;
            audioEl.dataset.participantId = participant.identity;
            audioEl.className = "hidden";
            document.body.appendChild(audioEl);
            audioElsRef.current.set(participant.identity, audioEl);
          },
        );

        room.on(
          RoomEvent.TrackUnsubscribed,
          (_track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
            const audioEl = audioElsRef.current.get(participant.identity);
            if (audioEl) {
              audioEl.remove();
              audioElsRef.current.delete(participant.identity);
            }
          },
        );

        setStatus("connecting");
        await room.connect(url, token);

        if (!active) {
          room.disconnect();
          return;
        }

        await room.localParticipant.setMicrophoneEnabled(true);
        setStatus("connected");

        setRemoteParticipants(room.remoteParticipants.size > 0 ? [...room.remoteParticipants.keys()] : []);
      } catch (error) {
        if (!active) return;
        setStatus("failed");
        setErrorMessage(error instanceof Error ? error.message : "Unable to connect to LiveKit");
      }
    }

    void connect();

    return () => {
      active = false;

      const room = roomRef.current;
      roomRef.current = null;

      if (room) {
        room.disconnect();
      }

      for (const audioEl of audioElsRef.current.values()) {
        audioEl.remove();
      }
      audioElsRef.current.clear();
    };
  }, [spaceId]);

  return (
    <div className="pointer-events-auto rounded-2xl border border-white/15 bg-black/55 p-4 text-white shadow-[0_12px_34px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">LiveKit mic test</p>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white/80">
          {status}
        </span>
      </div>

      <p className="text-xs leading-5 text-white/70">
        Join this same space in two signed-in tabs. If both show <span className="font-semibold text-white">connected</span>,
        you should be able to talk.
      </p>

      <div className="mt-3 text-xs text-white/80">
        <p>Remote participants: {remoteParticipants.length}</p>
        {remoteParticipants.length > 0 ? (
          <div className="mt-2 space-y-1">
            {remoteParticipants.map((id) => (
              <div key={id} className="truncate rounded-lg bg-white/8 px-2 py-1">
                {id}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="mt-3 rounded-lg bg-red-500/15 px-2.5 py-2 text-xs text-red-100">{errorMessage}</p>
      ) : null}
    </div>
  );
}
