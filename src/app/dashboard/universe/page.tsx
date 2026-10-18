"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { 
  Search, 
  Filter, 
  Crosshair, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ChevronRight, 
  Compass, 
  Layers, 
  Sparkles as SparklesIcon,
  Activity,
  Eye,
  Radio
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CelestialObjectData {
  id: string;
  name: string;
  category: "galaxy" | "quasar" | "mission" | "cluster";
  position: [number, number, number];
  color: string;
  size: number;
  type: string;
  distance: string;
  redshift: string;
  coords: string;
  velocity: string;
  mass: string;
  desc: string;
  missionDetails?: string;
}

const CELESTIAL_TARGETS: CelestialObjectData[] = [
  {
    id: "milky-way",
    name: "Milky Way (Sagittarius A*)",
    category: "galaxy",
    position: [0, 0, 0],
    color: "#F5E6C3",
    size: 0.6,
    type: "Barred Spiral (SBbc)",
    distance: "0 ly (Home Galaxy)",
    redshift: "z = 0.000",
    coords: "RA: 17h 45m | DEC: -29° 00'",
    velocity: "627 km/s (vs CMB)",
    mass: "1.15 × 10¹² M☉",
    desc: "Host barred spiral galaxy containing 100-400 billion stars. The central core harbors the 4.15M solar mass supermassive black hole Sagittarius A*."
  },
  {
    id: "andromeda",
    name: "Andromeda Galaxy (M31)",
    category: "galaxy",
    position: [12, 3, -10],
    color: "#93C5FD",
    size: 0.55,
    type: "Major Spiral (SA(s)b)",
    distance: "2.537 Million ly",
    redshift: "z = -0.001001 (Blueshift)",
    coords: "RA: 00h 42m | DEC: +41° 16'",
    velocity: "-110 km/s (Approaching)",
    mass: "1.5 × 10¹² M☉",
    desc: "Largest member of the Local Group. On a collision course with the Milky Way, predicted to merge into a giant elliptical galaxy (Milkomeda) in ~4.5 Gyr."
  },
  {
    id: "triangulum",
    name: "Triangulum Galaxy (M33)",
    category: "galaxy",
    position: [8, -4, -6],
    color: "#C4B5FD",
    size: 0.35,
    type: "Pinwheel Spiral (SA(s)cd)",
    distance: "2.73 Million ly",
    redshift: "z = -0.00060",
    coords: "RA: 01h 33m | DEC: +30° 39'",
    velocity: "-182 km/s",
    mass: "5.0 × 10¹⁰ M☉",
    desc: "Third-largest Local Group member. Rich in ionized H II regions including NGC 604, one of the largest known star formation complexes in the universe."
  },
  {
    id: "m87",
    name: "Messier 87 (Virgo A)",
    category: "galaxy",
    position: [-16, 8, -14],
    color: "#FDE047",
    size: 0.7,
    type: "Supergiant Elliptical (E0p)",
    distance: "53.5 Million ly",
    redshift: "z = 0.00428",
    coords: "RA: 12h 30m | DEC: +12° 23'",
    velocity: "+1,307 km/s",
    mass: "2.4 × 10¹³ M☉",
    desc: "Dominant central galaxy of the Virgo Cluster. First supermassive black hole ever imaged by the Event Horizon Telescope (EHT), launching a 5,000-ly relativistic plasma jet."
  },
  {
    id: "sombrero",
    name: "Sombrero Galaxy (M104)",
    category: "galaxy",
    position: [-10, -7, -12],
    color: "#FBBF24",
    size: 0.45,
    type: "Unbarred Spiral (SA(s)a)",
    distance: "31.1 Million ly",
    redshift: "z = 0.00341",
    coords: "RA: 12h 39m | DEC: -11° 37'",
    velocity: "+1,024 km/s",
    mass: "8.0 × 10¹¹ M☉",
    desc: "Remarkable for its luminous bulbous central nucleus and prominent dark equatorial dust absorption lane, resembling a wide-brimmed sombrero hat."
  },
  {
    id: "aditya-l1",
    name: "ISRO Aditya-L1 Mission Orbit",
    category: "mission",
    position: [2.8, 1.2, 2],
    color: "#4ADE80",
    size: 0.28,
    type: "Sun-Earth L1 Halo Orbit",
    distance: "1.5 Million km from Earth",
    redshift: "z = 0.000 (Heliospheric)",
    coords: "Lagrange Point 1",
    velocity: "Orbital period: 178 days",
    mass: "1,475 kg spacecraft",
    desc: "India's premier solar observatory launched by ISRO aboard PSLV-C57. Stationed at Lagrange Point 1 to study the solar corona, solar wind, and coronal mass ejections continuously.",
    missionDetails: "Instruments: VELC, SUIT, ASPEX, PAPA, SoLEXS, HEL1OS, Magnetometer"
  },
  {
    id: "chandrayaan-3",
    name: "ISRO Chandrayaan-3 Lunar Target",
    category: "mission",
    position: [-1.8, 1.8, 3.2],
    color: "#34D399",
    size: 0.25,
    type: "Lunar South Pole (69.37° S)",
    distance: "384,400 km (Moon Orbit)",
    redshift: "z = 0.000 (Lunar)",
    coords: "Shiv Shakti Point",
    velocity: "Soft landed successfully",
    mass: "Vikram + Pragyan Rover",
    desc: "Historic lunar exploration mission by ISRO that achieved humanity's first successful soft landing near the lunar south pole, proving sulfur presence and lunar regolith thermal properties.",
    missionDetails: "Payload: ChaSTE, ILSA, RAMBHA-LP, APXS, LIBS laser spectrometer"
  },
  {
    id: "quasar-3c273",
    name: "Quasar 3C 273",
    category: "quasar",
    position: [18, -10, -22],
    color: "#EC4899",
    size: 0.4,
    type: "Active Radio-Loud Quasar",
    distance: "2.44 Billion ly",
    redshift: "z = 0.1583",
    coords: "RA: 12h 29m | DEC: +02° 03'",
    velocity: "+47,400 km/s (15.8% c)",
    mass: "8.86 × 10⁸ M☉",
    desc: "The first quasar ever identified by Maarten Schmidt in 1963. One of the most luminous active galactic nuclei in the sky, shining with the light of over 4 trillion suns."
  }
];

// ==================== 1. LOGARITHMIC SPIRAL GALAXY COMPONENT ====================
function SpiralGalaxy({ 
  position = [0, 0, 0], 
  particleCount = 5000, 
  radius = 5.5, 
  arms = 2,
  coreColor = "#FFF3CF",
  armColor = "#3B82F6",
  rotationSpeed = 0.08
}: { 
  position?: [number, number, number]; 
  particleCount?: number; 
  radius?: number; 
  arms?: number;
  coreColor?: string;
  armColor?: string;
  rotationSpeed?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const cCore = new THREE.Color(coreColor);
    const cArm = new THREE.Color(armColor);
    const cOuter = new THREE.Color("#818CF8");

    for (let i = 0; i < particleCount; i++) {
      // Radial distribution (higher density at core)
      const r = Math.pow(Math.random(), 2.2) * radius;
      // Arm angle with logarithmic spiral curvature
      const armAngle = ((i % arms) * ((2 * Math.PI) / arms));
      const spinAngle = r * 1.8;
      const angle = armAngle + spinAngle;

      // Vertical Gaussian thickness (thicker near center)
      const verticalSpread = (Math.random() - 0.5) * (0.8 - (r / radius) * 0.6);
      const horizontalSpread = (Math.random() - 0.5) * 0.3 * (r / radius + 0.2);

      const x = Math.cos(angle) * r + horizontalSpread;
      const z = Math.sin(angle) * r + horizontalSpread;
      const y = verticalSpread;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color interpolation: core -> arm -> outer halo
      const mixRatio = Math.min(1, r / radius);
      const particleColor = new THREE.Color();
      if (mixRatio < 0.3) {
        particleColor.lerpColors(cCore, cArm, mixRatio / 0.3);
      } else {
        particleColor.lerpColors(cArm, cOuter, (mixRatio - 0.3) / 0.7);
      }

      col[i * 3] = particleColor.r;
      col[i * 3 + 1] = particleColor.g;
      col[i * 3 + 2] = particleColor.b;
    }

    return [pos, col];
  }, [particleCount, radius, arms, coreColor, armColor]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Glowing Accretion Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.7} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ==================== 2. COSMIC WEB FILAMENTS COMPONENT ====================
function CosmicWebFilaments({ visible = true }: { visible: boolean }) {
  const lineGeometry = useMemo(() => {
    if (!visible) return null;
    const points: THREE.Vector3[] = [];

    // Connect pairs of targets to form cosmic web strands
    for (let i = 0; i < CELESTIAL_TARGETS.length; i++) {
      for (let j = i + 1; j < CELESTIAL_TARGETS.length; j++) {
        const p1 = new THREE.Vector3(...CELESTIAL_TARGETS[i].position);
        const p2 = new THREE.Vector3(...CELESTIAL_TARGETS[j].position);
        const dist = p1.distanceTo(p2);

        // Connect if within cosmic cluster distance
        if (dist < 26) {
          points.push(p1);
          // Add intermediate curved point for organic filament look
          const mid = new THREE.Vector3().lerpVectors(p1, p2, 0.5);
          mid.y += (Math.sin(i * 3 + j) * 1.5);
          mid.x += (Math.cos(i + j * 2) * 1.2);
          points.push(mid);
          points.push(mid);
          points.push(p2);
        }
      }
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [visible]);

  if (!visible || !lineGeometry) return null;

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial 
        color="#38BDF8" 
        transparent 
        opacity={0.18} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ==================== 3. ORBITAL TRAJECTORY RING COMPONENT ====================
function OrbitalPath({ 
  center = [0, 0, 0], 
  radiusX = 4, 
  color = "#4ADE80",
  rotation = [0, 0, 0]
}: { 
  center?: [number, number, number]; 
  radiusX?: number; 
  radiusZ?: number; 
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <group position={center} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radiusX, radiusX + 0.04, 64]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ==================== 4. CELESTIAL TARGET OBJECT WITH GLOWING HUD ====================
function CelestialTargetNode({
  target,
  isSelected,
  onSelect
}: {
  target: CelestialObjectData;
  isSelected: boolean;
  onSelect: (target: CelestialObjectData) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (auraRef.current) {
      const scale = isSelected 
        ? 1.3 + Math.sin(clock.getElapsedTime() * 4) * 0.15
        : 1.0 + Math.sin(clock.getElapsedTime() * 2) * 0.08;
      auraRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={target.position}>
      {/* Click Hitbox */}
      <mesh 
        onClick={(e) => { e.stopPropagation(); onSelect(target); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[target.size, 24, 24]} />
        <meshBasicMaterial 
          color={target.color} 
          wireframe={target.category === "mission"}
        />
      </mesh>

      {/* Pulsing Aura Halo */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[target.size * 1.8, 16, 16]} />
        <meshBasicMaterial 
          color={target.color} 
          transparent 
          opacity={isSelected ? 0.35 : hovered ? 0.25 : 0.12} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Target Marker Ring if Selected */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[target.size * 2.2, target.size * 2.4, 32]} />
          <meshBasicMaterial color="#FFF3CF" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Billboard Floating Label */}
      <Billboard position={[0, target.size + 0.4, 0]}>
        <Text
          fontSize={isSelected ? 0.35 : hovered ? 0.3 : 0.22}
          color={isSelected ? "#FFF3CF" : hovered ? "#FFFFFF" : target.color}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {target.name.split(' (')[0]}
        </Text>
      </Billboard>
    </group>
  );
}

// ==================== 5. CAMERA CONTROLLER HELPER ====================
function CameraManager({ 
  targetPos, 
  autoRotate 
}: { 
  targetPos: [number, number, number] | null;
  autoRotate: boolean;
}) {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current) {
      const destination = targetPos 
        ? new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2])
        : new THREE.Vector3(0, 0, 0);
      controlsRef.current.target.lerp(destination, 0.08);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={autoRotate}
      autoRotateSpeed={0.3}
      minDistance={2}
      maxDistance={70}
      makeDefault
    />
  );
}

// ==================== MAIN UNIVERSE 3D PAGE COMPONENT ====================
export default function Universe3DPage() {
  const [selectedTarget, setSelectedTarget] = useState<CelestialObjectData | null>(CELESTIAL_TARGETS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Layer Toggles
  const [showCosmicWeb, setShowCosmicWeb] = useState(true);
  const [showCoordinateGrid, setShowCoordinateGrid] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);

  // Playback & Sound State
  const [autoRotate, setAutoRotate] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Filtered Targets
  const filteredTargets = useMemo(() => {
    return CELESTIAL_TARGETS.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeFilter === "All") return matchSearch;
      return matchSearch && t.category.toLowerCase() === activeFilter.toLowerCase();
    });
  }, [searchQuery, activeFilter]);

  // Ambient Space Synth Sound Generator
  const toggleSound = () => {
    if (!soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Ambient chord oscillators
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(108, ctx.currentTime); // A2 fundamental space drone
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(162, ctx.currentTime); // E3 fifth harmonic

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
        setSoundEnabled(true);
      } catch (e) {
        console.error("Audio initialization failed:", e);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setSoundEnabled(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-[#000108] overflow-hidden flex flex-col font-sans select-none">
      
      {/* ==================== THREE.JS 3D UNIVERSE CANVAS ==================== */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 8, 22], fov: 55 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={['#01030B']} />
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 0, 0]} intensity={1.5} color="#FFF3CF" distance={50} />

          {/* Deep Space Multi-Layer Stars */}
          <Stars radius={120} depth={60} count={7500} factor={4} saturation={0.8} fade speed={1.2} />

          {/* Logarithmic Spiral Galaxy 1 (Milky Way at Origin) */}
          <SpiralGalaxy 
            position={[0, 0, 0]} 
            particleCount={5500} 
            radius={5.5} 
            coreColor="#FFF3CF" 
            armColor="#3B82F6" 
            rotationSpeed={0.06}
          />

          {/* Logarithmic Spiral Galaxy 2 (Andromeda M31) */}
          <SpiralGalaxy 
            position={[12, 3, -10]} 
            particleCount={3500} 
            radius={4.2} 
            coreColor="#FDE68A" 
            armColor="#60A5FA" 
            rotationSpeed={-0.08}
          />

          {/* Cosmic Web Filament Synapses */}
          <CosmicWebFilaments visible={showCosmicWeb} />

          {/* Orbital Trajectories */}
          {showOrbits && (
            <>
              {/* Aditya-L1 Halo Orbit representation */}
              <OrbitalPath center={[2.8, 1.2, 2]} radiusX={1.4} radiusZ={0.9} color="#4ADE80" rotation={[0.4, 0.2, 0]} />
              {/* Lunar Trajectory */}
              <OrbitalPath center={[-1.8, 1.8, 3.2]} radiusX={0.9} radiusZ={0.6} color="#34D399" rotation={[-0.3, 0.5, 0.2]} />
              {/* Local Group Galactic Plane ring */}
              <OrbitalPath center={[0, 0, 0]} radiusX={15} radiusZ={15} color="#263F78" rotation={[0, 0, 0]} />
            </>
          )}

          {/* Celestial Targets Nodes */}
          {CELESTIAL_TARGETS.map((t) => (
            <CelestialTargetNode
              key={t.id}
              target={t}
              isSelected={selectedTarget?.id === t.id}
              onSelect={(target) => {
                setSelectedTarget(target);
                setAutoRotate(false);
              }}
            />
          ))}

          {/* Galactic Grid Helper */}
          {showCoordinateGrid && (
            <gridHelper 
              args={[50, 50, '#1E3A8A', '#0F172A']} 
              position={[0, -5, 0]} 
            />
          )}

          {/* Camera Controls */}
          <CameraManager 
            targetPos={selectedTarget ? selectedTarget.position : null} 
            autoRotate={autoRotate} 
          />
        </Canvas>
      </div>

      {/* ==================== AESTHETIC SPACE GLASSMORPHIC OVERLAY HUD ==================== */}
      
      {/* Top Telemetry Header Bar */}
      <div className="relative z-20 px-8 py-4 flex items-center justify-between border-b border-[#263F78]/30 bg-background/40 backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white tracking-wide">3D UNIVERSE OBSERVATORY</span>
              <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-mono">
                TELEMETRY ACTIVE
              </span>
            </div>
            <div className="text-[10px] text-primary/60 font-mono">
              Epoch: J2026.5 • Local Group & ISRO Orbital Trajectories • Multi-Wavelength
            </div>
          </div>
        </div>

        {/* Global Controls & Audio */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRotate(r => !r)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              autoRotate 
                ? "bg-primary/20 border-primary text-primary" 
                : "bg-[#0D1C42]/60 border-[#263F78]/50 text-primary/60 hover:text-white"
            }`}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {autoRotate ? "Orbiting" : "Paused"}
          </button>

          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              soundEnabled 
                ? "bg-accent/20 border-accent text-accent" 
                : "bg-[#0D1C42]/60 border-[#263F78]/50 text-primary/60 hover:text-white"
            }`}
            title={soundEnabled ? "Mute Cosmic Ambience" : "Play Ambient Space Drone"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setSelectedTarget(null)}
            className="p-2 rounded-lg bg-[#0D1C42]/60 border border-[#263F78]/50 text-primary/60 hover:text-white transition-colors"
            title="Reset Camera to Origin"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Floating HUD Panels */}
      <div className="relative z-10 flex-1 p-6 flex justify-between items-start pointer-events-none overflow-hidden">
        
        {/* Left Control Panel: Search & Filter Suite */}
        <div className="w-80 pointer-events-auto space-y-4 max-h-full flex flex-col">
          
          {/* Celestial Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            <input 
              type="text" 
              placeholder="Search galaxies, missions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1C42]/80 backdrop-blur-xl border border-[#263F78]/50 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-primary/40 outline-none focus:border-primary/70 transition-all shadow-xl"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["All", "Galaxy", "Mission", "Quasar"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider transition-all whitespace-nowrap ${
                  activeFilter === f 
                    ? "bg-primary text-background font-semibold shadow-md" 
                    : "bg-[#0D1C42]/80 border border-[#263F78]/50 text-primary/60 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Quick Target List */}
          <div className="bg-[#0D1C42]/80 backdrop-blur-xl border border-[#263F78]/50 rounded-xl p-3 shadow-xl overflow-hidden flex flex-col flex-1 min-h-[160px] max-h-[240px]">
            <div className="text-[10px] uppercase tracking-widest text-primary/50 font-mono mb-2 px-1">
              Astronomical Catalog ({filteredTargets.length})
            </div>
            <div className="space-y-1 overflow-y-auto flex-1 pr-1">
              {filteredTargets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTarget(t);
                    setAutoRotate(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                    selectedTarget?.id === t.id 
                      ? "bg-primary/20 border border-primary/40 text-white" 
                      : "hover:bg-[#263F78]/30 text-primary/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="truncate">{t.name}</span>
                  </div>
                  <span className="text-[9px] font-mono text-primary/40 uppercase shrink-0">
                    {t.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Layer Toggles */}
          <div className="bg-[#0D1C42]/80 backdrop-blur-xl border border-[#263F78]/50 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[10px] text-primary/60 uppercase tracking-widest font-mono">
              <Layers className="w-3 h-3" /> Display Layers
            </div>
            <div className="space-y-2 text-xs text-white/90">
              <label className="flex items-center justify-between cursor-pointer hover:text-primary transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Cosmic Web Strands
                </span>
                <input 
                  type="checkbox" 
                  checked={showCosmicWeb} 
                  onChange={(e) => setShowCosmicWeb(e.target.checked)} 
                  className="accent-primary cursor-pointer" 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:text-primary transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" /> Orbital Trajectories
                </span>
                <input 
                  type="checkbox" 
                  checked={showOrbits} 
                  onChange={(e) => setShowOrbits(e.target.checked)} 
                  className="accent-primary cursor-pointer" 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer hover:text-primary transition-colors">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Galactic Coordinate Grid
                </span>
                <input 
                  type="checkbox" 
                  checked={showCoordinateGrid} 
                  onChange={(e) => setShowCoordinateGrid(e.target.checked)} 
                  className="accent-primary cursor-pointer" 
                />
              </label>
            </div>
          </div>

        </div>

        {/* Right Info Panel: Target Locked Telemetry Card */}
        <div className="w-96 pointer-events-auto flex flex-col gap-4 items-end">
          
          <AnimatePresence mode="wait">
            {selectedTarget && (
              <motion.div 
                key={selectedTarget.id}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0D1C42]/85 backdrop-blur-xl border border-primary/40 rounded-2xl p-6 w-full shadow-2xl relative overflow-hidden"
              >
                {/* Glow accent */}
                <div 
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: selectedTarget.color }} 
                />

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[9px] uppercase font-mono tracking-widest text-primary">
                    <Crosshair className="w-3 h-3" /> Target Locked
                  </div>
                  <span className="text-[10px] text-primary/40 font-mono">
                    {selectedTarget.category.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl text-white font-medium mb-1 tracking-wide relative z-10">
                  {selectedTarget.name}
                </h3>
                <div className="text-xs text-primary/70 font-mono mb-4">
                  {selectedTarget.type}
                </div>

                {/* Telemetry Grid */}
                <div className="space-y-2.5 mb-5 text-xs bg-background/40 border border-[#263F78]/30 rounded-xl p-3.5">
                  <div className="flex justify-between items-center pb-1.5 border-b border-[#263F78]/20">
                    <span className="text-primary/60">Light-travel Distance</span>
                    <span className="text-white font-mono">{selectedTarget.distance}</span>
                  </div>

                  <div className="flex justify-between items-center pb-1.5 border-b border-[#263F78]/20">
                    <span className="text-primary/60">Spectroscopic Redshift</span>
                    <span className="text-primary font-mono">{selectedTarget.redshift}</span>
                  </div>

                  <div className="flex justify-between items-center pb-1.5 border-b border-[#263F78]/20">
                    <span className="text-primary/60">Radial Velocity</span>
                    <span className="text-white font-mono">{selectedTarget.velocity}</span>
                  </div>

                  <div className="flex justify-between items-center pb-1.5 border-b border-[#263F78]/20">
                    <span className="text-primary/60">Stellar Mass / Payload</span>
                    <span className="text-white font-mono">{selectedTarget.mass}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-primary/60">Celestial Coordinates</span>
                    <span className="text-primary/80 font-mono text-[11px]">{selectedTarget.coords}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-primary/70 font-light leading-relaxed mb-4">
                  {selectedTarget.desc}
                </p>

                {selectedTarget.missionDetails && (
                  <div className="mb-4 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-[11px] text-green-300 font-mono">
                    {selectedTarget.missionDetails}
                  </div>
                )}

                {/* CTAs */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/ai-analysis`}
                    className="flex-1 py-2.5 bg-primary text-background rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all text-center flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    Analyze Target <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/dashboard/vision`}
                    className="px-3 py-2.5 bg-[#263F78]/30 border border-[#263F78]/60 text-primary rounded-lg text-xs uppercase tracking-widest hover:bg-[#263F78]/60 transition-colors flex items-center justify-center"
                    title="View in Vision Studio"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* ==================== BOTTOM CAMERA PRESETS QUICK JUMP BAR ==================== */}
      <div className="relative z-20 px-8 py-3 bg-[#0D1C42]/80 backdrop-blur-xl border-t border-[#263F78]/40 flex items-center justify-between text-xs pointer-events-auto">
        <div className="flex items-center gap-2 text-primary/60 text-[10px] uppercase font-mono tracking-widest">
          <Radio className="w-3.5 h-3.5 animate-pulse text-green-400" />
          <span>Camera Jump:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {CELESTIAL_TARGETS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTarget(t);
                setAutoRotate(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap border ${
                selectedTarget?.id === t.id
                  ? "bg-primary text-background border-primary font-medium shadow-md shadow-primary/20"
                  : "bg-background/40 border-[#263F78]/40 text-primary/70 hover:text-white hover:border-primary/40"
              }`}
            >
              {t.name.split(' (')[0]}
            </button>
          ))}
        </div>

        <div className="text-[10px] text-primary/40 font-mono hidden md:block">
          Left Click: Rotate • Right Click: Pan • Scroll: Zoom
        </div>
      </div>

    </div>
  );
}
