import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Warehouse } from './components/scene/Warehouse.tsx'
import { useState } from 'react'
import { LOOP_DURATION } from './types/trajectory'
import { getRobotState } from './types/simulation'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)

  const [speedMultiplier, setSpeedMultiplier] =
    useState(1)

  const [playbackTime, setPlaybackTime] =
    useState(0)

  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved'
  >('idle')

  // Calculate the robot's simulated state at the current playback time.
  const robotState = getRobotState(playbackTime)

  const saveTelemetry = async () => {
    setSaveStatus('saving')
    try {
      const response = await fetch('http://localhost:3001/api/telemetry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: robotState.timestamp,
          x: robotState.position.x,
          y: robotState.position.y,
          z: robotState.position.z,
          velocity: robotState.velocity,
          acceleration: robotState.acceleration,
          angle: robotState.angle,
        }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to save telemetry')
      }
      setSaveStatus('saved')
      setTimeout(() => {setSaveStatus('idle')}, 1500)

      console.log('Telemetry saved successfully')
    } catch (error) {
      setSaveStatus('idle')

      console.error('Error saving telemetry:', error)
    }
  }

  return (
    <div className="app-container">

      <div className="app">
        <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
          <color
            attach="background"
            args={['#CED8F7']}
          />

          <ambientLight intensity={1} />

          <directionalLight
            position={[5, 10, 5]}
            intensity={2}
          />

          <Warehouse
            isPlaying={isPlaying}
            speedMultiplier={speedMultiplier}
            playbackTime={playbackTime}
            setPlaybackTime={setPlaybackTime}
          />

          <OrbitControls />
        </Canvas>
      </div>

      {/* Simulation controls */}
      <div className="simulation-controls">
        <div className="controls-header">
          <img src="/website.png" className="controls-logo"/>
          <div className="controls-header-text">
            <div className="controls-label">SIM - VIS</div>
              <select className="scene-select" defaultValue="warehouse">
                <option value="warehouse">Warehouse (AGV)</option>
                <option value="obstacle-course">ACC Track (ADAS)</option>
                <option value="navigation">AEB Track (ADAS)</option>
              </select>
            </div>
        </div>
        <div className="controls-divider" />
        {/* Play / Reset */}
        <div className="control-buttons">
          <button
            className="control-button"
            onClick={() => setIsPlaying((previous) => !previous)} > {isPlaying ? '⏸' : '▶'}
            <span> {isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            className="control-button" onClick={() => {
              setPlaybackTime(0)
              setIsPlaying(false)
            }}>↻
            <span>Reset</span>
          </button>
        </div>
        {/* Playback timeline */}
        <div className="playback-control">
          <div className="playback-header">
            <span>PLAYBACK</span>
            <span>{playbackTime.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="0"
            max={LOOP_DURATION}
            step="0.1"
            value={playbackTime}
            onChange={(event) =>
              setPlaybackTime(
                Number(event.target.value)
              )
            }
            style={{
              accentColor: '#4A6DE5',
            }}
          />
        </div>
        {/* Speed selector */}
        <div className="speed-control">
          <div className="speed-header">
            <span>SPEED</span>
            <select
              value={speedMultiplier}
              onChange={(event) =>
                setSpeedMultiplier(
                  Number(event.target.value)
                )
              }
            >
              <option value="0.25">0.25×</option>
              <option value="0.5">0.5×</option>
              <option value="1">1×</option>
              <option value="2">2×</option>
              <option value="4">4×</option>
            </select>
          </div>
        </div>
      </div>


      {/* Telemetry dashboard */}
      <div className="telemetry-controls">
        <div className="controls-header">
          <img src="/viewer.png" className="controls-logo"/>
          <div className="controls-header-text">
            <div className="controls-label">DASHBOARD</div>
            <div className="controls-title">Robot Telemetry</div>
          </div>
        </div>
        <div className="controls-divider" />
        {/* Simulation Time */}
        <div className="telemetry-section">
          <div className="telemetry-section-title">SIMULATION</div>
          <div className="telemetry-row"><span>TIMESTAMP</span>
            <strong>{robotState.timestamp.toFixed(1)} s</strong>
          </div>
        </div>
        {/* Position */}
        <div className="telemetry-section">
          <div className="telemetry-section-title">POSITION</div>
          <div className="telemetry-grid">
            <div className="telemetry-item">
              <span>X</span>
              <strong>{robotState.position.x.toFixed(2)} m</strong>
            </div>
            <div className="telemetry-item">
              <span>Y</span>
              <strong>{robotState.position.y.toFixed(2)} m</strong>
            </div>
            <div className="telemetry-item">
              <span>Z</span>
              <strong>{robotState.position.z.toFixed(2)} m</strong>
            </div>
          </div>
        </div>
        {/* Motion */}
        <div className="telemetry-section">
          <div className="telemetry-section-title">MOTION</div>
          <div className="telemetry-row">
            <span>VELOCITY</span>
            <strong>{robotState.velocity.toFixed(2)} m/s</strong>
          </div>
          <div className="telemetry-row">
            <span>ACCELERATION</span>
            <strong>{robotState.acceleration.toFixed(2)} m/s²</strong>
          </div>
        </div>
        {/* Orientation */}
        <div className="telemetry-section">
          <div className="telemetry-section-title">ORIENTATION</div>
          <div className="telemetry-row">
            <span>ANGLE</span>
            <strong>
              {(
                robotState.angle *
                180 /
                Math.PI
              ).toFixed(1)}°
            </strong>
          </div>
        </div>
         {/* Database button */}
         <div className="telemetry-buttons">
          <button className="telemetry-button" onClick={saveTelemetry} disabled={saveStatus !== 'idle'}>
            <span>{saveStatus === 'saving' ? 'Saving...' :
                  saveStatus === 'saved' ? '✓ Saved' :
                  'Save Dashboard Data'}
            </span>
            {saveStatus === 'idle' && (<img src="/database.png" className="database-logo"/>)}
          </button>
        </div>
      </div>



    </div>
  )
}

export default App