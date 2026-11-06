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
  EyeOff,
  Radio,
  X
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

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

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
      {/* Invisible Comfortable Click Hitbox */}
      <mesh 
        onClick={(e) => { e.stopPropagation(); onSelect(target); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[Math.max(target.size * 1.8, 0.75), 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Visible Celestial Core */}
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
  // Start with no target selected so user sees clean 3D universe on initial click
  const [selectedTarget, setSelectedTarget] = useState<CelestialObjectData | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [showCameraJump, setShowCameraJump] = useState(false);
  const [zenMode, setZenMode] = useState(false);
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
          onPointerMissed={() => setSelectedTarget(null)}
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
      
      {/* Zen Mode Exit Button (when in Zen Mode) */}
      {zenMode && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={() => setZenMode(false)}
          className="absolute top-4 right-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1C42]/85 backdrop-blur-md border border-[#263F78]/60 text-xs font-mono text-primary hover:text-white hover:border-primary transition-all shadow-xl pointer-events-auto"
          title="Exit Zen Mode (Show Controls)"
        >
          <Eye className="w-4 h-4" />
          <span>Exit Zen Mode</span>
        </motion.button>
      )}

      {/* Top Telemetry Header Bar */}
      <AnimatePresence>
        {!zenMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-20 px-8 py-4 flex items-center justify-between border-b border-white/[0.08] bg-black/40 backdrop-blur-2xl pointer-events-auto shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-[#FFF3CF] shadow-sm">
                <Compass className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white tracking-wide">3D UNIVERSE OBSERVATORY</span>
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono">
                    TELEMETRY ACTIVE
                  </span>
                </div>
                <div className="text-[10px] text-[#FFF3CF]/60 font-mono">
                  Epoch: J2026.5 • Local Group & ISRO Orbital Trajectories • Multi-Wavelength
                </div>
              </div>
            </div>

            {/* Global Controls & On-Demand Toggles */}
            <div className="flex items-center gap-2.5">
              {/* On-Demand Catalog Toggle */}
              <button
                onClick={() => setShowCatalog(c => !c)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  showCatalog 
                    ? "bg-[#FFF3CF] border-[#FFF3CF] text-slate-950 font-bold shadow-md shadow-[#FFF3CF]/20" 
                    : "bg-white/[0.04] border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.08]"
                }`}
                title="View Astronomical Catalog & Celestial Components"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Components ({filteredTargets.length})</span>
              </button>

              {/* On-Demand Camera Jump Toggle */}
              <button
                onClick={() => setShowCameraJump(j => !j)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  showCameraJump 
                    ? "bg-white/[0.14] border-white/[0.25] text-[#FFF3CF] font-medium" 
                    : "bg-white/[0.04] border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.08]"
                }`}
                title="Toggle Celestial Jump Presets"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Quick Jump</span>
              </button>

              {/* Auto Rotate Orbiting */}
              <button
                onClick={() => setAutoRotate(r => !r)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                  autoRotate 
                    ? "bg-white/[0.1] border-white/[0.2] text-[#FFF3CF]" 
                    : "bg-white/[0.04] border-white/[0.1] text-white/60 hover:text-white"
                }`}
                title="Toggle Universe Auto-Orbit"
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {autoRotate ? "Orbiting" : "Paused"}
              </button>

              {/* Ambient Sound */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border text-xs transition-colors ${
                  soundEnabled 
                    ? "bg-[#FFF3CF]/20 border-[#FFF3CF] text-[#FFF3CF]" 
                    : "bg-white/[0.04] border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.08]"
                }`}
                title={soundEnabled ? "Mute Cosmic Ambience" : "Play Ambient Space Drone"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reset Camera to Origin */}
              <button 
                onClick={() => {
                  setSelectedTarget(null);
                  setAutoRotate(true);
                }}
                className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Reset Camera to Origin"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Fullscreen Zen Mode */}
              <button
                onClick={() => setZenMode(true)}
                className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Zen Universe Mode (Pure 3D View without HUD)"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Floating HUD Panels */}
      <div className="relative z-10 flex-1 p-6 flex justify-between items-start pointer-events-none overflow-hidden">
        
        {/* Left Side: On-Demand Catalog Drawer & Floating Trigger Button */}
        <div className="flex flex-col items-start max-h-full">
          <AnimatePresence>
            {!zenMode && (
              showCatalog ? (
                <motion.div 
                  key="catalog-panel"
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-80 pointer-events-auto space-y-3 max-h-full flex flex-col"
                >
                  {/* Panel Title & Close Button */}
                  <div className="flex items-center justify-between bg-black/45 backdrop-blur-2xl border border-white/[0.1] rounded-2xl px-4 py-2.5 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#FFF3CF]" />
                      <span className="text-xs font-mono font-medium text-white tracking-wide">
                        CELESTIAL CATALOG
                      </span>
                    </div>
                    <button
                      onClick={() => setShowCatalog(false)}
                      className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                      title="Close Catalog"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Celestial Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input 
                      type="text" 
                      placeholder="Search galaxies, missions..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/45 backdrop-blur-2xl border border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#FFF3CF]/60 transition-all shadow-xl font-light"
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
                            ? "bg-[#FFF3CF] text-slate-950 font-bold shadow-md shadow-[#FFF3CF]/20" 
                            : "bg-black/35 border border-white/[0.08] text-white/60 hover:text-white"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* Quick Target List */}
                  <div className="bg-black/45 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-3 shadow-xl overflow-hidden flex flex-col flex-1 min-h-[160px] max-h-[240px]">
                    <div className="text-[10px] uppercase tracking-widest text-[#FFF3CF]/50 font-mono mb-2 px-1">
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
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            selectedTarget?.id === t.id 
                              ? "bg-white/[0.12] border border-white/[0.15] text-white" 
                              : "hover:bg-white/[0.05] text-white/70 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                            <span className="truncate">{t.name}</span>
                          </div>
                          <span className="text-[9px] font-mono text-white/40 uppercase shrink-0">
                            {t.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Layer Toggles */}
                  <div className="bg-black/45 backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-4 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-[#FFF3CF]/60 uppercase tracking-widest font-mono">
                      <Layers className="w-3 h-3" /> Display Layers
                    </div>
                    <div className="space-y-2 text-xs text-white/90">
                      <label className="flex items-center justify-between cursor-pointer hover:text-[#FFF3CF] transition-colors">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" /> Cosmic Web Strands
                        </span>
                        <input 
                          type="checkbox" 
                          checked={showCosmicWeb} 
                          onChange={(e) => setShowCosmicWeb(e.target.checked)} 
                          className="accent-[#FFF3CF] cursor-pointer" 
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer hover:text-[#FFF3CF] transition-colors">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Orbital Trajectories
                        </span>
                        <input 
                          type="checkbox" 
                          checked={showOrbits} 
                          onChange={(e) => setShowOrbits(e.target.checked)} 
                          className="accent-[#FFF3CF] cursor-pointer" 
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer hover:text-[#FFF3CF] transition-colors">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-400" /> Galactic Coordinate Grid
                        </span>
                        <input 
                          type="checkbox" 
                          checked={showCoordinateGrid} 
                          onChange={(e) => setShowCoordinateGrid(e.target.checked)} 
                          className="accent-[#FFF3CF] cursor-pointer" 
                        />
                      </label>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="catalog-trigger"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setShowCatalog(true)}
                  className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-black/45 backdrop-blur-2xl border border-white/[0.1] text-xs font-mono text-white/90 hover:text-white hover:border-[#FFF3CF]/40 hover:bg-white/[0.06] shadow-2xl transition-all group"
                  title="Open Astronomical Catalog & Components"
                >
                  <Layers className="w-4 h-4 text-[#FFF3CF] group-hover:scale-110 transition-transform" />
                  <span>Explore Components & Catalog</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-white/[0.08] text-[#FFF3CF] text-[10px]">
                    {filteredTargets.length}
                  </span>
                </motion.button>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Right Info Panel: Target Locked Telemetry Card (Only shown when target is chosen) */}
        <div className="w-96 pointer-events-auto flex flex-col gap-4 items-end">
          <AnimatePresence mode="wait">
            {selectedTarget && !zenMode && (
              <motion.div 
                key={selectedTarget.id}
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-black/50 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-6 w-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
              >
                {/* Glow accent */}
                <div 
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-25 pointer-events-none"
                  style={{ backgroundColor: selectedTarget.color }} 
                />

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[9px] uppercase font-mono tracking-widest text-[#FFF3CF]">
                    <Crosshair className="w-3 h-3 text-[#FFF3CF]" /> Target Locked
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#FFF3CF]/50 font-mono">
                      {selectedTarget.category.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setSelectedTarget(null)}
                      className="p-1 rounded-lg text-primary/60 hover:text-white hover:bg-white/10 transition-colors"
                      title="Close details (Return to 3D Universe)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl text-white font-medium mb-1 tracking-wide relative z-10">
                  {selectedTarget.name}
                </h3>
                <div className="text-xs text-primary/70 font-mono mb-4">
                  {selectedTarget.type}
                </div>

                {/* Telemetry Grid */}
                <div className="space-y-2.5 mb-5 text-xs bg-black/40 border border-white/[0.08] rounded-xl p-3.5 backdrop-blur-md">
                  <div className="flex justify-between items-center pb-1.5 border-b border-white/[0.06]">
                    <span className="text-white/60">Light-travel Distance</span>
                    <span className="text-white font-mono">{selectedTarget.distance}</span>
                  </div>

                  <div className="flex justify-between items-center pb-1.5 border-b border-white/[0.06]">
                    <span className="text-white/60">Spectroscopic Redshift</span>
                    <span className="text-[#FFF3CF] font-mono">{selectedTarget.redshift}</span>
                  </div>

                  <div className="flex justify-between items-center pb-1.5 border-b border-white/[0.06]">
                    <span className="text-white/60">Radial Velocity</span>
                    <span className="text-white font-mono">{selectedTarget.velocity}</span>
                  </div>

                  <div className="flex justify-between items-center pb-1.5 border-b border-white/[0.06]">
                    <span className="text-white/60">Stellar Mass / Payload</span>
                    <span className="text-white font-mono">{selectedTarget.mass}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Celestial Coordinates</span>
                    <span className="text-[#FFF3CF]/80 font-mono text-[11px]">{selectedTarget.coords}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                  {selectedTarget.desc}
                </p>

                {selectedTarget.missionDetails && (
                  <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono">
                    {selectedTarget.missionDetails}
                  </div>
                )}

                {/* CTAs */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/ai-analysis`}
                    className="flex-1 py-2.5 bg-[#FFF3CF] text-slate-950 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white transition-all text-center flex items-center justify-center gap-1.5 shadow-md font-mono"
                  >
                    Analyze Target <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/dashboard/vision`}
                    className="px-3 py-2.5 bg-white/[0.05] border border-white/[0.1] text-[#FFF3CF] rounded-xl text-xs uppercase tracking-widest hover:bg-white/[0.1] transition-colors flex items-center justify-center font-mono"
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
      <AnimatePresence>
        {showCameraJump && !zenMode ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="relative z-20 px-8 py-3 bg-black/45 backdrop-blur-2xl border-t border-white/[0.08] flex items-center justify-between text-xs pointer-events-auto shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2 text-[#FFF3CF]/60 text-[10px] uppercase font-mono tracking-widest">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap border ${
                    selectedTarget?.id === t.id
                      ? "bg-[#FFF3CF] text-slate-950 border-[#FFF3CF] font-bold shadow-md shadow-[#FFF3CF]/20"
                      : "bg-white/[0.04] border-white/[0.09] text-white/60 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {t.name.split(' (')[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-[10px] text-white/40 font-mono hidden md:block">
                Left Click: Rotate • Right Click: Pan • Scroll: Zoom
              </div>
              <button
                onClick={() => setShowCameraJump(false)}
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Close Camera Jump"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : !zenMode ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
          >
            <button
              onClick={() => setShowCameraJump(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-2xl border border-white/[0.1] text-[10px] font-mono text-white/70 hover:text-[#FFF3CF] hover:border-[#FFF3CF]/40 transition-all shadow-lg"
              title="Open Celestial Camera Jump Bar"
            >
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Quick Jump Presets</span>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </div>
  );
}
