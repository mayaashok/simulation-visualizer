export type Position = {
    x: number
    y: number
    z: number
  }
  
export type RobotState = {
    timestamp: number
    position: Position
    velocity: number
    acceleration: number
    angle: number
  }