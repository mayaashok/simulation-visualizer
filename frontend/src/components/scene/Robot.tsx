import { useEffect, useRef } from 'react'
import { Model as Rover } from '../../assets/Robo.jsx'

type RobotProps = {
  trajectory: { x: number; z: number }[]
  playbackTime: number
}

export function Robot({
  trajectory,
  playbackTime,
}: RobotProps) {
  const robotRef = useRef<any>(null)

  // Total time for one complete loop of the trajectory.
  const LOOP_DURATION = 20

  // Update the rover's position whenever playbackTime changes.
  useEffect(() => {
    if (!robotRef.current) return

    // Convert playback time into a value from 0 → 1.
    const progress =
      (playbackTime % LOOP_DURATION) / LOOP_DURATION

    // Figure out which segment of the trajectory we're on.
    const segmentCount = trajectory.length - 1
    const exactSegment = progress * segmentCount

    const segmentIndex = Math.min(
      Math.floor(exactSegment),
      segmentCount - 1
    )

    // How far along this particular segment are we?
    const segmentProgress =
      exactSegment - segmentIndex

    const start = trajectory[segmentIndex]
    const end = trajectory[segmentIndex + 1]

    // Interpolate between the two trajectory points.
    const x =
      start.x + (end.x - start.x) * segmentProgress

    const z =
      start.z + (end.z - start.z) * segmentProgress

    // Move the rover.
    robotRef.current.position.set(x, 0, z)

    // Calculate the direction of travel.
    const dx = end.x - start.x
    const dz = end.z - start.z

    // Rotate the rover so its front faces its direction of travel.
    robotRef.current.rotation.y = Math.atan2(dx, dz)
  }, [playbackTime, trajectory])

  return (
    <group ref={robotRef}>
      <Rover scale={0.3} />
    </group>
  )
}