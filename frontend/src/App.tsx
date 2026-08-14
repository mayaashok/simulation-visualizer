import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Warehouse } from './components/scene/Warehouse.tsx'
import { useState } from 'react'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)

  const [speedMultiplier, setSpeedMultiplier] =
    useState(1)

  const [playbackTime, setPlaybackTime] =
    useState(0)

  const LOOP_DURATION = 20

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
          <img
            src="/website.png"
            className="controls-logo"
          />

          <div className="controls-header-text">

            <div className="controls-label">
              SIM - VIS
            </div>

            <select
              className="scene-select"
              defaultValue="warehouse"
            >
              <option value="warehouse">
                Warehouse (AGV)
              </option>

              <option value="obstacle-course">
                ACC Track (ADAS)
              </option>

              <option value="navigation">
                AEB Track (ADAS)
              </option>
            </select>

          </div>
        </div>

        <div className="controls-divider" />

        {/* Play / Reset */}
        <div className="control-buttons">

          <button
            className="control-button"
            onClick={() =>
              setIsPlaying((previous) => !previous)
            }
          >
            {isPlaying ? '⏸' : '▶'}
            <span>
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>

          <button
            className="control-button"
            onClick={() => {
              setPlaybackTime(0)
              setIsPlaying(false)
            }}
          >
            ↻
            <span>Reset</span>
          </button>

        </div>

        {/* Playback timeline */}
        <div className="playback-control">

          <div className="playback-header">
            <span>PLAYBACK</span>

            <span>
              {playbackTime.toFixed(1)}s
            </span>
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

    </div>
  )
}

export default App