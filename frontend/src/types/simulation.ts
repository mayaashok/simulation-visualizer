export type posVector = {
    x: number
    y: number
    z: number
  }

export type RobotState = {
    timestamp: number
    position: posVector
    velocity: number
    acceleration: number
    heading: number
    currentWaypoint: number
}