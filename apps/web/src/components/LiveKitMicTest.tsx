"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  LocalAudioTrack,
  Room,
  RoomEvent,
  Track,
  type LocalTrackPublication,
  type RemoteParticipant,
  type RemoteTrackPublication,
} from "livekit-client";
import { Maximize2, MicOff } from "lucide-react";
import { fetchLiveKitToken } from "@/lib/livekit";
import type { PlayerPosition } from "@/app/components/GameCanvas";

const HEARING_RADIUS = 220;
const ENTER_RADIUS = 220;
const EXIT_RADIUS = 250;
const VIDEO_RADIUS = 160;
const POSITION_SCALE = 96;

type RemoteAudioGraph = {
  element: HTMLAudioElement;
  stream: MediaStream;
  source: MediaStreamAudioSourceNode;
  gain: GainNode;
  panner?: PannerNode;
};

type Status =
  | "idle"
  | "fetching-token"
  | "connecting"
  | "connected"
  | "failed";

export type LiveKitMediaHandle = {
  toggleMicrophone: () => Promise<void>;
  toggleCamera: () => Promise<void>;
};

type LiveKitMicTestProps = {
  spaceId: string;
  playerPositions: PlayerPosition[];
  currentUserId: string;
  onMediaStateChange?: (state: {
    micEnabled: boolean;
    cameraEnabled: boolean;
    connected: boolean;
  }) => void;
};

const LiveKitMicTest = forwardRef<LiveKitMediaHandle, LiveKitMicTestProps>(function LiveKitMicTest(
  {
    spaceId,
    playerPositions,
    currentUserId,
    onMediaStateChange,
  },
  ref,
) {
  const roomRef = useRef<Room | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const remoteAudioRef = useRef<Map<string, RemoteAudioGraph>>(new Map());
  const remoteVideoRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoContainerRef = useRef<HTMLDivElement | null>(null);
  const audibleStateRef = useRef<Map<string, boolean>>(new Map());
  const micToggleInFlightRef = useRef(false);
  const cameraToggleInFlightRef = useRef(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [remoteParticipants, setRemoteParticipants] = useState<string[]>([]);
  const [remoteVideoParticipants, setRemoteVideoParticipants] = useState<string[]>([]);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [nearbyVideoParticipants, setNearbyVideoParticipants] = useState<string[]>([]);
  const visibleRemoteVideoParticipants = nearbyVideoParticipants.filter((participantId) =>
    remoteVideoParticipants.includes(participantId),
  );

  useEffect(() => {
    onMediaStateChange?.({
      micEnabled,
      cameraEnabled,
      connected: status === "connected",
    });
  }, [cameraEnabled, micEnabled, onMediaStateChange, status]);

  useImperativeHandle(ref, () => ({
    async toggleMicrophone() {
      const room = roomRef.current;
      if (!room || micToggleInFlightRef.current) return;

      micToggleInFlightRef.current = true;

      try {
        const next = !micEnabled;
        setMicEnabled(next);

        await room.localParticipant.setMicrophoneEnabled(next, {
          autoGainControl: true,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          voiceIsolation: true,
        });
      } finally {
        micToggleInFlightRef.current = false;
      }
    },
    async toggleCamera() {
      const room = roomRef.current;
      if (!room || cameraToggleInFlightRef.current) return;

      cameraToggleInFlightRef.current = true;

        try {
          const next = !cameraEnabled;

          await room.localParticipant.setCameraEnabled(next);
          setErrorMessage("");
          setCameraEnabled(next);

          if (next) {
            syncLocalCameraPreview();
          }

          if (!next && localVideoRef.current) {
            localVideoRef.current.remove();
            localVideoRef.current = null;
          }
      } catch (error) {
        setCameraEnabled((current) => !current);
        console.warn("Unable to toggle camera", error);
        if (error instanceof Error) {
          if (error.name === "NotReadableError") {
            setErrorMessage("Camera is already in use by another browser or app.");
          } else if (error.name === "NotAllowedError") {
            setErrorMessage("Camera permission was denied.");
          } else {
            setErrorMessage(error.message || "Unable to enable camera.");
          }
        }
      } finally {
        cameraToggleInFlightRef.current = false;
      }
    },
  }), [cameraEnabled, micEnabled]);

  function getAudioContext() {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }

    const listener = audioContextRef.current.listener;
    listener.positionX.value = 0;
    listener.positionY.value = 0;
    listener.positionZ.value = 0;
    listener.forwardX.value = 0;
    listener.forwardY.value = 0;
    listener.forwardZ.value = -1;
    listener.upX.value = 0;
    listener.upY.value = 1;
    listener.upZ.value = 0;

    return audioContextRef.current;
  }

  function attachLocalCameraTrack(trackPublication: LocalTrackPublication) {
    if (!trackPublication.track || trackPublication.source !== Track.Source.Camera) {
      return;
    }

    const attached = trackPublication.track.attach() as HTMLVideoElement;
    attached.autoplay = true;
    attached.playsInline = true;
    attached.muted = true;
    attached.className = "h-full w-full object-cover";

    if (localVideoRef.current) {
      localVideoRef.current.remove();
    }

    localVideoRef.current = attached as HTMLVideoElement;

    if (localVideoContainerRef.current) {
      localVideoContainerRef.current.replaceChildren(localVideoRef.current);
    }
  }

  function syncLocalCameraPreview() {
    const room = roomRef.current;
    if (!room) {
      return;
    }

    const publication = room.localParticipant.getTrackPublication(Track.Source.Camera);
    if (!publication || publication.source !== Track.Source.Camera || !publication.track || publication.isMuted) {
      return;
    }

    attachLocalCameraTrack(publication);
  }

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

        room.on(RoomEvent.LocalTrackPublished, async (trackPublication) => {
          if (trackPublication.source === Track.Source.Microphone && trackPublication.track instanceof LocalAudioTrack) {
            setMicEnabled(true);
            const { KrispNoiseFilter, isKrispNoiseFilterSupported } = await import("@livekit/krisp-noise-filter");

            if (isKrispNoiseFilterSupported()) {
              const krispProcessor = KrispNoiseFilter();
              await trackPublication.track.setProcessor(krispProcessor);
              await krispProcessor.setEnabled(true);
            }
          }

          if (trackPublication.source === Track.Source.Camera && trackPublication.track) {
            attachLocalCameraTrack(trackPublication);
            setCameraEnabled(true);
          }
        });

        room.on(RoomEvent.LocalTrackUnpublished, (publication) => {
          if (publication.source === Track.Source.Microphone) {
            setMicEnabled(false);
          }

          if (publication.source === Track.Source.Camera) {
            if (localVideoRef.current) {
              localVideoRef.current.remove();
              localVideoRef.current = null;
            }
            setCameraEnabled(false);
          }
        });

        room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
          setRemoteParticipants((current) =>
            current.includes(participant.identity) ? current : [...current, participant.identity],
          );
        });

        room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
          setRemoteParticipants((current) => current.filter((id) => id !== participant.identity));
          setRemoteVideoParticipants((current) => current.filter((id) => id !== participant.identity));

          const existingAudio = remoteAudioRef.current.get(participant.identity);
          if (existingAudio) {
            existingAudio.element.remove();
            existingAudio.source.disconnect();
            existingAudio.gain.disconnect();
            existingAudio.panner?.disconnect();
            remoteAudioRef.current.delete(participant.identity);
          }

          const existingVideo = remoteVideoRef.current.get(participant.identity);
          if (existingVideo) {
            existingVideo.remove();
            remoteVideoRef.current.delete(participant.identity);
          }
        });

        room.on(
          RoomEvent.TrackSubscribed,
          (track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
            if (track.kind === Track.Kind.Video) {
              const existingVideo = remoteVideoRef.current.get(participant.identity);
              if (existingVideo) {
                existingVideo.remove();
                remoteVideoRef.current.delete(participant.identity);
              }

              const videoEl = track.attach() as HTMLVideoElement;
              videoEl.autoplay = true;
              videoEl.playsInline = true;
              videoEl.className = "h-full w-full object-cover";
              remoteVideoRef.current.set(participant.identity, videoEl);
              setRemoteVideoParticipants((current) =>
                current.includes(participant.identity) ? current : [...current, participant.identity],
              );
              return;
            }

            if (track.kind !== Track.Kind.Audio) return;

            const existingAudio = remoteAudioRef.current.get(participant.identity);
            if (existingAudio) {
              existingAudio.element.remove();
              existingAudio.source.disconnect();
              existingAudio.gain.disconnect();
              existingAudio.panner?.disconnect();
              remoteAudioRef.current.delete(participant.identity);
            }

            const audioEl = track.attach();
            audioEl.autoplay = true;
            audioEl.dataset.participantId = participant.identity;
            audioEl.className = "hidden";
            document.body.appendChild(audioEl);

            const mediaTrack =
              audioEl.srcObject instanceof MediaStream ? audioEl.srcObject.getAudioTracks()[0] : null;

            if (!mediaTrack) {
              audioEl.remove();
              return;
            }

            const stream = new MediaStream([mediaTrack]);
            const audioContext = getAudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const gain = audioContext.createGain();
            const panner = audioContext.createPanner();

            panner.panningModel = "HRTF";
            panner.distanceModel = "inverse";
            panner.refDistance = 1;
            panner.maxDistance = 8;
            panner.rolloffFactor = 0.8;
            panner.coneInnerAngle = 360;
            panner.coneOuterAngle = 0;
            panner.coneOuterGain = 1;

            gain.gain.value = 1;
            source.connect(gain);
            gain.connect(panner);
            panner.connect(audioContext.destination);
            audioEl.muted = true;

            remoteAudioRef.current.set(participant.identity, {
              element: audioEl,
              stream,
              source,
              gain,
              panner,
            });
          },
        );

        room.on(
          RoomEvent.TrackUnsubscribed,
          (track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
            if (track.kind === Track.Kind.Video) {
              const existingVideo = remoteVideoRef.current.get(participant.identity);
              if (existingVideo) {
                existingVideo.remove();
                remoteVideoRef.current.delete(participant.identity);
              }
              setRemoteVideoParticipants((current) => current.filter((id) => id !== participant.identity));
              return;
            }

            const existingAudio = remoteAudioRef.current.get(participant.identity);
            if (existingAudio) {
              existingAudio.element.remove();
              existingAudio.source.disconnect();
              existingAudio.gain.disconnect();
              existingAudio.panner?.disconnect();
              remoteAudioRef.current.delete(participant.identity);
            }
          },
        );

        setStatus("connecting");
        await room.connect(url, token);

        if (!active) {
          room.disconnect();
          return;
        }

        await room.localParticipant.setMicrophoneEnabled(true, {
          autoGainControl: true,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          voiceIsolation: true,
        });

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

      for (const remote of remoteAudioRef.current.values()) {
        remote.element.remove();
        remote.source.disconnect();
        remote.gain.disconnect();
        remote.panner?.disconnect();
      }
      remoteAudioRef.current.clear();

      for (const remoteVideo of remoteVideoRef.current.values()) {
        remoteVideo.remove();
      }
      remoteVideoRef.current.clear();

      if (localVideoRef.current) {
        localVideoRef.current.remove();
        localVideoRef.current = null;
      }

      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [spaceId]);

  useEffect(() => {
    const self = playerPositions.find((player) => player.userId === currentUserId);
    if (!self) {
      setNearbyVideoParticipants([]);
      return;
    }

    const nextNearbyVideoParticipants: string[] = [];

    for (const [participantId, remoteAudio] of remoteAudioRef.current.entries()) {
      const remote = playerPositions.find((player) => player.userId === participantId);

      if (!remote) {
        remoteAudio.gain.gain.value = 0;
        audibleStateRef.current.set(participantId, false);
        continue;
      }

      const distance = getDistance(self, remote);
      const wasAudible = audibleStateRef.current.get(participantId) ?? false;
      const nowAudible = wasAudible ? distance <= EXIT_RADIUS : distance <= ENTER_RADIUS;

      const relativeX = (remote.x - self.x) / POSITION_SCALE;
      const relativeZ = (remote.y - self.y) / POSITION_SCALE;

      if (remoteAudio.panner) {
        remoteAudio.panner.positionX.value = relativeX;
        remoteAudio.panner.positionY.value = 0;
        remoteAudio.panner.positionZ.value = relativeZ;
      }

      audibleStateRef.current.set(participantId, nowAudible);
      remoteAudio.gain.gain.value = nowAudible ? getVolume(distance) : 0;
    }

    for (const participantId of remoteVideoRef.current.keys()) {
      const remote = playerPositions.find((player) => player.userId === participantId);
      if (!remote) continue;

      const distance = getDistance(self, remote);
      if (distance <= VIDEO_RADIUS) {
        nextNearbyVideoParticipants.push(participantId);
      }
    }

    setNearbyVideoParticipants(nextNearbyVideoParticipants);
  }, [currentUserId, playerPositions]);

  function mountLocalVideo(container: HTMLDivElement | null) {
    localVideoContainerRef.current = container;

    if (!container || !localVideoRef.current) return;

    if (localVideoRef.current.parentElement !== container) {
      container.replaceChildren(localVideoRef.current);
    }
  }

  function mountRemoteVideo(participantId: string, container: HTMLDivElement | null) {
    if (!container) return;

    const videoEl = remoteVideoRef.current.get(participantId);
    if (!videoEl) return;

    if (videoEl.parentElement !== container) {
      container.replaceChildren(videoEl);
    }
  }

  return (
    <div className="pointer-events-auto flex flex-col gap-3">
      <VideoCard
        label="You"
        onMountVideo={mountLocalVideo}
        showMicMutedBadge={!micEnabled}
        showCameraOffState={!cameraEnabled}
      />

      {visibleRemoteVideoParticipants.map((participantId) => (
        <VideoCard
          key={participantId}
          label={participantId}
          onMountVideo={(node) => mountRemoteVideo(participantId, node)}
        />
      ))}

      {errorMessage ? (
        <div className="overflow-hidden rounded-[18px] border border-red-400/15 bg-[#2b2e33]/88 p-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <p className="rounded-lg bg-red-500/15 px-2.5 py-2 text-xs text-red-100">{errorMessage}</p>
        </div>
      ) : null}

      {status !== "connected" && !cameraEnabled && visibleRemoteVideoParticipants.length === 0 ? (
        <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#2b2e33]/88 p-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <p className="text-[11px] text-white/55">Status: {status}</p>
        </div>
      ) : null}
    </div>
  );
});

export default LiveKitMicTest;

function VideoCard({
  label,
  onMountVideo,
  showMicMutedBadge = false,
  showCameraOffState = false,
}: {
  label: string;
  onMountVideo: (container: HTMLDivElement | null) => void;
  showMicMutedBadge?: boolean;
  showCameraOffState?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#2b2e33]/88 p-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-lg bg-black/18 px-2.5 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[#45d56f]" />
          <span className="max-w-[170px] truncate text-[13px] font-semibold">{label}</span>
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/85 transition-colors duration-150 ease-out hover:bg-white/14"
          type="button"
        >
          <Maximize2 className="h-4 w-4 stroke-[2.1]" />
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[16px] bg-black/18">
        <div ref={onMountVideo} className="aspect-[1.2/1] w-full overflow-hidden bg-[#202227]" />
        {showMicMutedBadge ? (
          <div className="absolute bottom-3 left-3 flex h-4 w-4 items-center justify-center rounded-full text-[#ff0000]">
            <MicOff className="h-3 w-3 stroke-[2.2]" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getDistance(a: PlayerPosition, b: PlayerPosition) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function getVolume(distance: number) {
  if (distance >= HEARING_RADIUS) {
    return 0;
  }

  return Math.max(0, 1 - distance / HEARING_RADIUS);
}
