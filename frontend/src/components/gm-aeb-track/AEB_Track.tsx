import { Grid, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { Dispatch, SetStateAction} from 'react'
import { Model as TargetVehicle } from '../../assets/Red-car'
import { AEB_Car } from './AEB_Car'
import { getAEBState, AEB_LOOP_DURATION} from './aeb-sim'

type AEBTrackProps = {
  isPlaying: boolean
  speedMultiplier: number
  playbackTime: number
  setPlaybackTime: Dispatch<SetStateAction<number>>
}

const TARGET_X = 6.5

export function AEB_Track({
  isPlaying,
  speedMultiplier,
  playbackTime,
  setPlaybackTime,
}: AEBTrackProps) {

  useFrame((_, delta) => {

    if (!isPlaying) return

    setPlaybackTime((previousTime) => {

      const nextTime =
        previousTime +
        delta * speedMultiplier

      return nextTime % AEB_LOOP_DURATION
    })
  })

  const hostState =
    getAEBState(playbackTime)

  return (
    <group>

      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry
          args={[70, 10]}
        />

        <meshStandardMaterial
          color="#444444"
        />
      </mesh>

      {/* Road grid */}
      <Grid
        args={[70, 10]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#666666"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#888888"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* AEB stopping-distance marker */}
      <Line
        points={[
          [-13, 0.02, 0],
          [4.5, 0.02, 0],
        ]}
        lineWidth={3}
      />

      {/* Host vehicle */}
      <AEB_Car
        state={hostState}
      />

      {/* Target vehicle */}
      <group
        position={[
          TARGET_X,
          0,
          0,
        ]}
      >
        <TargetVehicle
          scale={1.0}
          rotation={[
            0,
            -Math.PI / 2,
            0,
          ]}
        />
      </group>

    </group>
  )
}