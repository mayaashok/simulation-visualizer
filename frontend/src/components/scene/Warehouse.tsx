import { Grid, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Dispatch, SetStateAction } from 'react'
import { Robot } from './Robot'
import { Obstacle } from './Obstacle'

type WarehouseProps = {
  isPlaying: boolean
  speedMultiplier: number
  playbackTime: number
  setPlaybackTime: Dispatch<SetStateAction<number>>
}

const trajectory = [
  { x: 0, z: 0 },
  { x: 5, z: 0 },
  { x: 5, z: 5 },
  { x: 0, z: 5 },
  { x: 0, z: 0 },
]

export function Warehouse({
  isPlaying,
  speedMultiplier,
  playbackTime,
  setPlaybackTime,
}: WarehouseProps) {

  const LOOP_DURATION = 20

  useFrame((_, delta) => {
    // Only advance playback while the simulation is playing.
    if (!isPlaying) return

    // Advance the replay according to the selected speed.
    setPlaybackTime((previousTime) => {
      const nextTime =
        previousTime + delta * speedMultiplier

      // Loop back to the beginning when the replay ends.
      return nextTime % LOOP_DURATION
    })
  })

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#3057E1" />
      </mesh>

      {/* Coordinate grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#CED8F7"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#CED8F7"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* Planned trajectory */}
      <Line
        points={trajectory.map((point) => [
          point.x,
          0.02,
          point.z,
        ])}
        lineWidth={3}
      />

      {/* Robot */}
      <Robot
        trajectory={trajectory}
        playbackTime={playbackTime}
      />

      {/* Obstacles */}
      <Obstacle
        position={[3, 1, -2]}
        size={[2, 2, 2]}
      />

      <Obstacle
        position={[-3, 1.5, 2]}
        size={[1.5, 3, 1.5]}
      />

      <Obstacle
        position={[2.5, 0.75, 2.5]}
        size={[3, 1.5, 1]}
      />
    </group>
  )
}