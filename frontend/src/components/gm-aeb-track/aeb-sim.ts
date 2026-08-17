import type { AEBState } from '../states.ts'

// Starting position of the host vehicle.
const HOST_START_X = -13
// Position of the stationary target vehicle.
const TARGET_X = 6.5
// The host starts from a low forward velocity.
const INITIAL_VELOCITY = 2.5
// Positive acceleration while the host is approaching the target.
const ACCELERATION = 0.5
// Negative acceleration applied when the host begins
const BRAKE_DECELERATION = -0.65
// The host accelerates for the first 3 seconds.
const START_BRAKING_TIME = 2.2
// Total length of one AEB simulation.
export const AEB_LOOP_DURATION = 10
// Minimum distance we want to maintain between the host and target vehicles.
const MINIMUM_DISTANCE = 3


export function getAEBState(
  playbackTime: number
): AEBState {

  const time = playbackTime % AEB_LOOP_DURATION
  let position: number
  let velocity: number
  let acceleration: number


  if (time < START_BRAKING_TIME) {
    // PHASE 1: ACCELERATION
    const t = time
    // position = initialPosition + initialVelocity × time + 1/2 × acceleration × time²
    position = HOST_START_X + INITIAL_VELOCITY * t + 0.5 * ACCELERATION * t * t
    // velocity = initialVelocity + acceleration × time
    velocity = INITIAL_VELOCITY + ACCELERATION * t
    acceleration = ACCELERATION

  } else {
    // PHASE 2: BRAKING
    const brakingTime = time - START_BRAKING_TIME
    const velocityAtBrake = INITIAL_VELOCITY + ACCELERATION * START_BRAKING_TIME
    const positionAtBrake = HOST_START_X + INITIAL_VELOCITY * START_BRAKING_TIME + 0.5 * ACCELERATION * START_BRAKING_TIME * START_BRAKING_TIME
    const calculatedVelocity = velocityAtBrake + BRAKE_DECELERATION * brakingTime
    if (calculatedVelocity <= 0) {
        // Vehicle has finished braking.
        const stoppingTime = -velocityAtBrake / BRAKE_DECELERATION
        position = positionAtBrake + velocityAtBrake * stoppingTime + 0.5 * BRAKE_DECELERATION * stoppingTime * stoppingTime
        velocity = 0
        acceleration = 0
    } else {
        // Vehicle is still braking.
        position = positionAtBrake + velocityAtBrake * brakingTime + 0.5 * BRAKE_DECELERATION * brakingTime * brakingTime
        velocity = calculatedVelocity
        acceleration = BRAKE_DECELERATION
    }
  }
  // SAFETY BOUNDARY
  const maximumHostX = TARGET_X - MINIMUM_DISTANCE

  if (position > maximumHostX) {
    position = maximumHostX
    velocity = 0
    acceleration = 0
  }

  return {
    timestamp: time,

    position: {
      x: position,
      y: 0,
      z: 0,
    },

    velocity,
    acceleration,
    angle: Math.PI / 2,
  }
}