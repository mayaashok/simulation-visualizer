interface ObstacleProps {
    position: [number, number, number]
    size: [number, number, number]
}
  
  export function Obstacle({ position, size }: ObstacleProps) {
    return (
      <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="coral" />
      </mesh>
    )
}