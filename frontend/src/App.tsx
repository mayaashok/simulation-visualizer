import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Warehouse } from './components/aws-warehouse/Warehouse.tsx'
import { useState } from 'react'
import { getRobotState, ROBOT_LOOP_DURATION} from './components/aws-warehouse/warehouse-sim.ts'
import { getAEBState, AEB_LOOP_DURATION} from './components/gm-aeb-track/aeb-sim.ts'
import { AEB_Track } from './components/gm-aeb-track/AEB_Track.tsx'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)

  const [speedMultiplier, setSpeedMultiplier] =
    useState(1)

  const [playbackTime, setPlaybackTime] =
    useState(0)

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saved' | 'error'
  >('idle')

  const [selectedScene, setSelectedScene] = useState('warehouse')

  // Calculate the robot/car simulated state at the current playback time.
  const robotState = getRobotState(playbackTime)
  const aebState = getAEBState(playbackTime)
  const activeState = selectedScene === 'aeb' ? aebState : robotState

  const saveTelemetry = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    try {
      const response = await fetch(
        'https://simulation-visualizer-api.onrender.com/api/telemetry',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: activeState.timestamp,
            x: activeState.position.x,
            y: activeState.position.y,
            z: activeState.position.z,
            velocity: activeState.velocity,
            acceleration: activeState.acceleration,
            angle:
              activeState.angle * 180 / Math.PI,
          }),
        }
      )
      if (!response.ok) {
        throw new Error('Failed to save telemetry')
      }
      setSaveStatus('saved')
      setTimeout(() => {setSaveStatus('idle')}, 2000)
    } catch (error) {
      console.error(error)
      setSaveStatus('error')
      setTimeout(() => {setSaveStatus('idle')}, 2000)
    } finally {
      setIsSaving(false)
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

          {selectedScene === 'warehouse' && (
            <Warehouse
              isPlaying={isPlaying}
              speedMultiplier={speedMultiplier}
              playbackTime={playbackTime}
              setPlaybackTime={setPlaybackTime}
            />
          )}

          {selectedScene === 'aeb' && (
            <AEB_Track
              isPlaying={isPlaying}
              speedMultiplier={speedMultiplier}
              playbackTime={playbackTime}
              setPlaybackTime={setPlaybackTime}
            />
          )}

          <OrbitControls />
        </Canvas>
      </div>

      {/* Simulation controls */}
      <div className="simulation-controls">
        <div className="controls-header">
          <img src="/website.png" className="controls-logo"/>
          <div className="controls-header-text">
            <div className="controls-label">SIM - VIS</div>
              {/* <select className="scene-select" defaultValue="warehouse">
                <option value="warehouse">Warehouse (AGV)</option>
                <option value="obstacle-course">ACC Track (ADAS)</option>
                <option value="navigation">AEB Track (ADAS)</option>
              </select> */}

              <select className="scene-select" value={selectedScene} onChange={(event) => setSelectedScene(event.target.value)}>
                <option value="warehouse">Warehouse Robot</option>
                <option value="aeb">AEB Scenario</option>
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
            max={selectedScene === 'aeb' ? AEB_LOOP_DURATION : ROBOT_LOOP_DURATION}
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
            <div className="controls-title">
              {selectedScene === 'aeb' ? 'Host Vehicle Telemetry' : 'Robot Telemetry'}
            </div>
          </div>
        </div>
        <div className="controls-divider" />
        {/* Simulation Time */}
        <div className="telemetry-section">
          <div className="telemetry-section-title">SIMULATION</div>
          <div className="telemetry-row"><span>TIMESTAMP</span>
            <strong>{activeState.timestamp.toFixed(1)} s</strong>
          </div>
        </div>
        {/* Position */}
        <div className="telemetry-section">
          <div className="telemetry-section-title">POSITION</div>
          <div className="telemetry-grid">
            <div className="telemetry-item">
              <span>X</span>
              <strong>{activeState.position.x.toFixed(2)} m</strong>
            </div>
            <div className="telemetry-item">
              <span>Y</span>
              <strong>{activeState.position.y.toFixed(2)} m</strong>
            </div>
            <div className="telemetry-item">
              <span>Z</span>
              <strong>{activeState.position.z.toFixed(2)} m</strong>
            </div>
          </div>
        </div>
        {/* Motion */}
        <div className="telemetry-section">
          <div className="telemetry-section-title">MOTION</div>
          <div className="telemetry-row">
            <span>VELOCITY</span>
            <strong>{activeState.velocity.toFixed(2)} m/s</strong>
          </div>
          <div className="telemetry-row">
            <span>ACCELERATION</span>
            <strong>{activeState.acceleration.toFixed(2)} m/s²</strong>
          </div>
        </div>
        {/* Orientation */}
        <div className="telemetry-section">
          <div className="telemetry-section-title">ORIENTATION</div>
          <div className="telemetry-row">
            <span>ANGLE</span>
            <strong>
              {(
                activeState.angle *
                180 /
                Math.PI
              ).toFixed(1)}°
            </strong>
          </div>
        </div>
         {/* Database button */}
         <div className="telemetry-buttons">
         <button className="telemetry-button" onClick={saveTelemetry} disabled={isSaving}>
            <span>
              {isSaving
                ? 'Saving...'
                : saveStatus === 'saved'
                ? '✓ Saved'
                : saveStatus === 'error'
                ? '✕ Error'
                : 'Save Dashboard Data'}
            </span>
            {!isSaving && saveStatus === 'idle' && (
              <img src="/database.png" className="database-logo"/>
            )}
          </button>
        </div>
      </div>



    </div>
  )
}

export default App