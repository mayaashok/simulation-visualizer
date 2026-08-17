import { useEffect, useRef } from 'react'
import { Model as HostVehicle } from '../../assets/Car'
import type { AEBState } from '../states'

type AEBCarProps = {
  state: AEBState
}

export function AEB_Car({
  state,
}: AEBCarProps) {

  const carRef = useRef<any>(null)

  useEffect(() => {
    if (!carRef.current) return

    // Update the vehicle position.
    carRef.current.position.set(
      state.position.x,
      state.position.y,
      state.position.z
    )

    // Update vehicle orientation.
    carRef.current.rotation.y =
      state.angle

  }, [state])

  return (
    <group ref={carRef}>
      <HostVehicle
        scale={0.85}
      />
    </group>
  )
}