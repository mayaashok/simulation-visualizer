import type { RobotState } from '../states'

// Square path trajectory for testing.
export const warehouseTrajectory = [
  { x: 0, z: 0 },
  { x: 5, z: 0 },
  { x: 5, z: 5 },
  { x: 0, z: 5 },
  { x: 0, z: 0 },
]
// Total length of one simulation.
export const ROBOT_LOOP_DURATION = 7

export function getRobotState(
  playbackTime: number
): RobotState {

  // Convert playback time into a position within the loop.
  const time = playbackTime % ROBOT_LOOP_DURATION
  // The trajectory has one segment between each pair of points.
  const segmentCount = warehouseTrajectory.length - 1
  // Each segment gets an equal amount of simulation time.
  const segmentDuration = ROBOT_LOOP_DURATION / segmentCount
  // Determine which trajectory segment we're currently on.
  const segmentIndex = Math.min(Math.floor(time / segmentDuration), segmentCount - 1)
  // Determine how far through this segment we are.
  const segmentStartTime = segmentIndex * segmentDuration
  const segmentProgress = (time - segmentStartTime) / segmentDuration
  const start = warehouseTrajectory[segmentIndex]
  const end = warehouseTrajectory[segmentIndex + 1]
  // Interpolate between the two trajectory points.
  const x = start.x + (end.x - start.x) * segmentProgress
  const z = start.z + (end.z - start.z) * segmentProgress
  // Determine the direction of travel.
  const dx = end.x - start.x
  const dz = end.z - start.z
  const angle = Math.atan2(dx, dz)
  // Calculate how far this trajectory segment travels.
  const segmentDistance = Math.sqrt(dx * dx + dz * dz)
  // Since every segment has the same amount of time - velocity is distance / time.
  const velocity = segmentDistance / segmentDuration
  const acceleration = 0

  return {
    timestamp: time,

    position: {
      x,
      y: 0,
      z,
    },

    velocity,
    acceleration,
    angle,
  }
}