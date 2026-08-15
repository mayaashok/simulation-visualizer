import { useEffect, useRef } from 'react'
import { Model as Rover } from '../../assets/Robo.tsx'
import type { RobotState } from '../../types/states'

type RobotProps = {
  state: RobotState
}

export function Robot({ state }: RobotProps) {
  const robotRef = useRef<any>(null)

  useEffect(() => {
    if (!robotRef.current) return

    // Update the Three.js rover to match the simulation state.
    robotRef.current.position.set(
      state.position.x,
      state.position.y,
      state.position.z
    )

    // Rotate the rover to match the simulated angle.
    robotRef.current.rotation.y = state.angle
  }, [state])

  return (
    <group ref={robotRef}>
      <Rover scale={0.3} />
    </group>
  )
}