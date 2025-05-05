import Scene from "@/src/components/canvas/Scene"
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex w-screen h-screen items-center justify-center bg-gradient-radial  from-[#9b9a9a] from-[20%] to-[#606060]">
      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
      />
    </main>
  );
}
