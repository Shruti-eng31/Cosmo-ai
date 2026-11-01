"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type CosmologyMode = "galactic_merger" | "cosmic_web" | "einstein_rings";

interface LivingInterfaceSceneProps {
  mode: CosmologyMode;
  pulseTrigger: number;
  showCelestialGrid: boolean;
  onCoreClick?: () => void;
  speedScale?: number;
}

// -------------------------------------------------------------
// GLSL Shaders: Galactic Differential Rotation & Tidal Gas Bridge
// -------------------------------------------------------------
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vDepth;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPulse;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;

    vec2 p = uv - vec2(0.5);
    float r = length(p);

    // Galactic Core Concentration: peaks at the central tidal intersection
    float coreWeight = exp(- (p.x * 3.6) * (p.x * 3.6) - (p.y * 3.0) * (p.y * 3.0));

    // Gravitational potential well & tidal oscillation
    // In binary galaxy mergers, the tidal throat compresses and expands gravitationally
    float tidalBreathing = sin(uTime * 1.6 * uSpeed - r * 6.0) * 0.15 * (coreWeight * 1.6 + 0.35);

    // Supernova ionization front / gravitational wave shockwave
    float shockwave = 0.0;
    if (uPulse > 0.001) {
      float waveDist = abs(r - uPulse * 0.72);
      shockwave = smoothstep(0.12, 0.0, waveDist) * (1.0 - uPulse) * 0.38;
    }

    // Stellar disc warpage from orbital inclination & mouse parallax
    float discWarpage = sin(p.x * 3.14159) * 0.08 * (1.0 - coreWeight);
    float mouseParallax = sin(length(p - uMouse * 0.3) * 7.0 - uTime * 1.8) * 0.035;

    pos.z += tidalBreathing + shockwave + discWarpage + mouseParallax;
    vDepth = pos.z;
    vPosition = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPulse;
  uniform vec2 uMouse;
  uniform int uMode; // 0 = merger, 1 = cosmic_web, 2 = einstein_rings

  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vDepth;

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec2 p = vUv - vec2(0.5);
    float r = length(p);

    // Center Galactic Nexus weight (tidal bridge connecting the two galaxies)
    float coreFactor = exp(- (p.x * 3.8) * (p.x * 3.8) - (p.y * 3.2) * (p.y * 3.2));

    float t = uTime * uSpeed;

    // GALACTIC DIFFERENTIAL ROTATION:
    // Outer galactic disc stars rotate slowly with large orbital periods
    float outerDiscAngle = t * 0.08; 
    
    // Galactic merger throat / inner core rotates with high Keplerian angular velocity
    float coreVortexAngle = t * 0.88 + sin(t * 1.3) * 0.20;

    // Mode-specific rotational modulation
    if (uMode == 1) {
      // Cosmic Web Filament: steady laminar cosmic stream
      coreVortexAngle = t * 0.65 + sin(t * 0.9) * 0.12;
    } else if (uMode == 2) {
      // Einstein Rings: relativistic frame-dragging / Kerr metric spin
      coreVortexAngle = t * 1.15 + sin(t * 1.8) * 0.28;
    }

    // Smooth transition from fast core rotation to slow outer disc rotation
    float angle = mix(outerDiscAngle, coreVortexAngle, coreFactor);

    // Interstellar spiral shear (spiral density wave in galactic gas)
    float spiralShear = sin(r * 15.0 - t * 2.2) * 0.045 * coreFactor;
    angle += spiralShear;

    // Apply differential rotation
    vec2 rotP = rotate2d(angle) * p;

    // Tidal heartbeat: gravitational compression and decompression of interacting nuclei
    float tidalPulse = 1.0 + (0.045 * sin(t * 1.7) + 0.02 * sin(t * 3.4)) * (coreFactor * 1.5 + 0.2);
    rotP /= tidalPulse;

    // Gas accretion stream drift through the central tidal bridge
    vec2 gasDrift = vec2(
      sin(rotP.y * 26.0 + t * 3.0),
      cos(rotP.x * 26.0 + t * 3.0)
    ) * 0.012 * coreFactor;

    vec2 targetUv = rotP + gasDrift + vec2(0.5);

    // Soft celestial boundary blending into deep space (feathered interstellar dust edge)
    float edgeMask = smoothstep(0.5, 0.36, abs(vUv.x - 0.5)) * smoothstep(0.5, 0.36, abs(vUv.y - 0.5));

    // Clamp coordinates safely
    targetUv = clamp(targetUv, vec2(0.001), vec2(0.999));

    // Cosmological spectral dispersion (Doppler blue/red shift across the rotating axis)
    float dopplerDisp = (0.007 * coreFactor + 0.002) * (1.0 + uPulse * 2.2);
    vec2 dopplerDir = (r > 0.001) ? normalize(rotP) : vec2(0.0);

    vec4 texR = texture2D(uTexture, clamp(targetUv + dopplerDir * dopplerDisp, vec2(0.001), vec2(0.999)));
    vec4 texG = texture2D(uTexture, targetUv);
    vec4 texB = texture2D(uTexture, clamp(targetUv - dopplerDir * dopplerDisp, vec2(0.001), vec2(0.999)));

    vec3 color = vec3(texR.r, texG.g, texB.b);
    float lum = dot(color, vec3(0.299, 0.587, 0.114));

    // ASTROPHYSICAL EMISSION ENHANCEMENT:
    // H-Alpha (656.3 nm) starburst nebulae glow (warm magenta/pink)
    // [O III] (500.7 nm) ionized gas emission (electric cyan/blue)
    // Old stellar population in galactic cores (warm golden starlight)
    vec3 oiiiIonizedGas = vec3(0.15, 0.68, 1.0) * pow(lum, 1.6) * (coreFactor * 0.95 + 0.3);
    vec3 halphaNebulae = vec3(0.95, 0.30, 0.70) * pow(lum, 2.0) * (coreFactor * 0.75 + 0.2);
    vec3 stellarCore = vec3(1.0, 0.94, 0.75) * pow(lum, 3.0) * 0.6;

    color += (oiiiIonizedGas + halphaNebulae + stellarCore) * (0.85 + 0.25 * sin(t * 2.0));

    // Supernova ionization front / gravitational shockwave
    if (uPulse > 0.001) {
      float waveDist = abs(r - uPulse * 0.72);
      float ring = smoothstep(0.09, 0.0, waveDist) * (1.0 - uPulse);
      vec3 shockColor = mix(vec3(0.3, 0.85, 1.0), vec3(1.0, 0.45, 0.9), sin(t * 4.0) * 0.5 + 0.5);
      color += shockColor * ring * 2.4;
    }

    // Stellar reflection sheen from binary galaxy illumination
    vec3 lightDir = normalize(vec3(uMouse.x, -uMouse.y, 0.8));
    vec3 normal = normalize(vec3(rotP * 2.0, 1.0));
    float specular = pow(max(0.0, dot(normal, lightDir)), 8.0) * 0.4 * lum;
    color += vec3(specular * 0.8, specular * 0.95, specular * 1.15);

    // Alpha blending with cosmos
    float alpha = edgeMask;
    float lumAlpha = smoothstep(0.02, 0.22, lum);
    alpha *= max(lumAlpha, edgeMask * 0.35);

    gl_FragColor = vec4(color, alpha);
  }
`;

// -------------------------------------------------------------
// Component: The 3D Galactic Interacting Entity
// -------------------------------------------------------------
function GalacticInteractingEntity({
  mode,
  pulseTrigger,
  speedScale = 1.0,
  onCoreClick,
}: {
  mode: CosmologyMode;
  pulseTrigger: number;
  speedScale?: number;
  onCoreClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const pulseAnim = useRef(0);
  const lastPulseTrigger = useRef(pulseTrigger);

  // Load the user's cosmological image
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/images/entanglement.jpg");
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  const modeInt = useMemo(() => {
    switch (mode) {
      case "cosmic_web":
        return 1;
      case "einstein_rings":
        return 2;
      case "galactic_merger":
      default:
        return 0;
    }
  }, [mode]);

  const modeSpeed = useMemo(() => {
    switch (mode) {
      case "einstein_rings":
        return 1.4 * speedScale;
      case "cosmic_web":
        return 0.65 * speedScale;
      case "galactic_merger":
      default:
        return 1.0 * speedScale;
    }
  }, [mode, speedScale]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uSpeed: { value: modeSpeed },
      uPulse: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMode: { value: modeInt },
    }),
    [texture, modeSpeed, modeInt]
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uSpeed.value = modeSpeed;
      materialRef.current.uniforms.uMode.value = modeInt;
    }
  }, [modeSpeed, modeInt]);

  useEffect(() => {
    if (pulseTrigger !== lastPulseTrigger.current) {
      pulseAnim.current = 0.01;
      lastPulseTrigger.current = pulseTrigger;
    }
  }, [pulseTrigger]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

    mouseRef.current.lerp(targetMouse.current, 0.06);
    materialRef.current.uniforms.uMouse.value.copy(mouseRef.current);

    if (pulseAnim.current > 0) {
      pulseAnim.current += delta * 1.35;
      if (pulseAnim.current > 1.0) {
        pulseAnim.current = 0;
      }
      materialRef.current.uniforms.uPulse.value = pulseAnim.current;
    } else {
      materialRef.current.uniforms.uPulse.value = 0;
    }

    // Realistic 3D orbital inclination tilt
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouseRef.current.y * 0.22 + Math.sin(state.clock.elapsedTime * 0.45) * 0.035,
        0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouseRef.current.x * 0.32 + Math.cos(state.clock.elapsedTime * 0.4) * 0.035,
        0.05
      );
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.015;
    }
  });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouse.current.set(x, y);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <mesh
      ref={meshRef}
      scale={[8.8, 11.0, 1]}
      position={[0, 0, 0]}
      onClick={onCoreClick}
    >
      <planeGeometry args={[1, 1, 96, 96]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

// -------------------------------------------------------------
// Component: 3D Accretion Stream Particles (Intergalactic Gas Transfer)
// -------------------------------------------------------------
function AccretionStreamParticles({
  mode,
  speedScale = 1.0,
}: {
  mode: CosmologyMode;
  speedScale?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2200;

  const modeMultiplier = useMemo(() => {
    switch (mode) {
      case "einstein_rings":
        return 1.4 * speedScale;
      case "cosmic_web":
        return 0.7 * speedScale;
      case "galactic_merger":
      default:
        return 1.0 * speedScale;
    }
  }, [mode, speedScale]);

  const [phases, speeds, offsets, colors] = useMemo(() => {
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);
    const off = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Astrophysical starburst & gas emission colors:
    // Ionized Hydrogen O-stars (cyan), H-alpha emission (magenta), old stellar bulge (gold/amber)
    const palette = [
      new THREE.Color("#38BDF8"), // O/B-type blue giant stars
      new THREE.Color("#60A5FA"), // ionized gas
      new THREE.Color("#F472B6"), // H-alpha starburst
      new THREE.Color("#FB7185"), // warm emission nebula
      new THREE.Color("#FEF08A"), // stellar core starlight
      new THREE.Color("#FFFFFF"), // compact star clusters
    ];

    for (let i = 0; i < count; i++) {
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = (Math.random() * 0.4 + 0.8) * 0.55;

      // Volumetric dispersion around the tidal bridge
      off[i * 3 + 0] = (Math.random() - 0.5) * 0.55;
      off[i * 3 + 1] = (Math.random() - 0.5) * 0.55;
      off[i * 3 + 2] = (Math.random() - 0.5) * 0.7;

      const chosenColor = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3 + 0] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [ph, sp, off, col];
  }, [count]);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    const scaleA = 4.2;
    const scaleB = 2.4;

    for (let i = 0; i < count; i++) {
      let u = phases[i];

      // Keplerian velocity spike at the merger throat (u ~ pi/2, 3pi/2)
      const centerAcceleration = 1.0 + 3.4 * Math.pow(Math.sin(u), 2);
      const step = delta * speeds[i] * modeMultiplier * centerAcceleration;
      u = (u + step) % (Math.PI * 2);
      phases[i] = u;

      // Lemniscate orbital bridge coordinates
      const denom = 1 + Math.pow(Math.sin(u), 2);
      const baseX = (scaleA * Math.cos(u)) / denom;
      const baseY = (scaleB * Math.sin(u) * Math.cos(u)) / denom;
      const baseZ = Math.sin(u * 2) * 0.55;

      posAttr.setXYZ(
        i,
        baseX + offsets[i * 3 + 0],
        baseY + offsets[i * 3 + 1],
        baseZ + offsets[i * 3 + 2]
      );
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.068}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// -------------------------------------------------------------
// Component: 3D Logarithmic Spiral Galaxy Backdrop
// -------------------------------------------------------------
function BackgroundSpiralGalaxy() {
  const galaxyRef = useRef<THREE.Points>(null);
  const count = 3500;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const arms = 2; // Two major spiral arms
    const spin = 3.5;
    const radius = 18.0;

    const insideColor = new THREE.Color("#FFE4B5"); // warm galactic nucleus
    const outsideColor = new THREE.Color("#38BDF8"); // young blue spiral arm stars
    const dustColor = new THREE.Color("#9333EA"); // interstellar dust lane

    for (let i = 0; i < count; i++) {
      // Distance from galactic center
      const r = Math.pow(Math.random(), 2.2) * radius;
      const spinAngle = r * spin;
      const branchAngle = ((i % arms) * 2 * Math.PI) / arms;

      // Random dispersion
      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35) * r;
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.15) * r;
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35) * r;

      const angle = branchAngle + spinAngle;
      const x = Math.cos(angle) * r + randomX;
      const y = (Math.sin(angle) * r + randomZ) * 0.45; // Tilted galactic disc
      const z = -4.5 + randomY; // Positioned behind the main entity

      pos[i * 3 + 0] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color interpolation: yellow/golden core to blue arms
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, r / radius);
      if (Math.random() < 0.15) {
        mixedColor.lerp(dustColor, 0.6);
      }

      col[i * 3 + 0] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;

      sz[i] = Math.random() * 0.045 + 0.015;
    }

    return [pos, col, sz];
  }, [count]);

  useFrame((state) => {
    if (galaxyRef.current) {
      // Slow majestic galactic rotation
      galaxyRef.current.rotation.z = state.clock.elapsedTime * 0.018;
      galaxyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    }
  });

  return (
    <points ref={galaxyRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.048}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// -------------------------------------------------------------
// Component: Deep Space Cosmic Web Tendrils & Distant Field Galaxies
// -------------------------------------------------------------
function CosmicWebField() {
  const fieldRef = useRef<THREE.Points>(null);
  const count = 1500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const galaxyColors = [
      new THREE.Color("#FDE68A"), // distant elliptical galaxy
      new THREE.Color("#93C5FD"), // distant spiral galaxy
      new THREE.Color("#F472B6"), // high-redshift starburst
      new THREE.Color("#E0E7FF"), // foreground Milky Way star
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22 - 7;

      const c = galaxyColors[Math.floor(Math.random() * galaxyColors.length)];
      col[i * 3 + 0] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={fieldRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// -------------------------------------------------------------
// Component: Celestial Coordinate Reticle (RA/Dec Grid lines)
// -------------------------------------------------------------
function CelestialCoordinateGrid({ visible }: { visible: boolean }) {
  const gridRef = useRef<THREE.Group>(null);

  const ringSegments = 64;
  const rings = [4.5, 6.0, 7.5];

  const ringLines = useMemo(() => {
    return rings.map((radius) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= ringSegments; i++) {
        const theta = (i / ringSegments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius * 0.65, -0.5));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      return geom;
    });
  }, []);

  useFrame((state) => {
    if (gridRef.current && visible) {
      gridRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });

  if (!visible) return null;

  return (
    <group ref={gridRef}>
      {ringLines.map((geom, idx) => (
        <lineLoop key={idx} geometry={geom}>
          <lineBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.12 - idx * 0.03}
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      ))}

      {/* RA/Dec Crosshairs */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(geom) => {
            geom.setFromPoints([
              new THREE.Vector3(-8, 0, -0.5),
              new THREE.Vector3(8, 0, -0.5),
            ]);
          }}
        />
        <lineBasicMaterial color="#38BDF8" transparent opacity={0.1} />
      </line>
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(geom) => {
            geom.setFromPoints([
              new THREE.Vector3(0, -6, -0.5),
              new THREE.Vector3(0, 6, -0.5),
            ]);
          }}
        />
        <lineBasicMaterial color="#38BDF8" transparent opacity={0.1} />
      </line>
    </group>
  );
}

// -------------------------------------------------------------
// Component: Responsive Camera Controller
// -------------------------------------------------------------
function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    const updateFov = () => {
      const isMobile = window.innerWidth < 768;
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.position.z = isMobile ? 14 : 10.5;
        camera.fov = isMobile ? 55 : 45;
        camera.updateProjectionMatrix();
      }
    };

    updateFov();
    window.addEventListener("resize", updateFov);
    return () => window.removeEventListener("resize", updateFov);
  }, [camera]);

  return null;
}

// -------------------------------------------------------------
// Main Scene Export
// -------------------------------------------------------------
export default function LivingInterfaceScene({
  mode,
  pulseTrigger,
  showCelestialGrid,
  onCoreClick,
  speedScale = 1.0,
}: LivingInterfaceSceneProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 10.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <CameraController />
        <ambientLight intensity={0.35} />

        {/* Astrophysical Lighting: Blue O-star cluster + warm galactic core */}
        <pointLight position={[0, 0, 4]} intensity={2.8} color="#38BDF8" distance={16} />
        <pointLight position={[3.5, 2.5, 2]} intensity={2.0} color="#F472B6" distance={14} />
        <pointLight position={[-3.5, -2.5, 2]} intensity={2.0} color="#FDE047" distance={14} />

        {/* Background 3D Spiral Galaxy */}
        <BackgroundSpiralGalaxy />

        {/* Deep Space Cosmic Web Tendrils & Distant Field Galaxies */}
        <CosmicWebField />

        {/* Central Interacting Binary Galaxies & Tidal Bridge (User's Image) */}
        <GalacticInteractingEntity
          mode={mode}
          pulseTrigger={pulseTrigger}
          onCoreClick={onCoreClick}
          speedScale={speedScale}
        />

        {/* 3D Gas Accretion Streams flowing between the galaxies */}
        <AccretionStreamParticles
          mode={mode}
          speedScale={speedScale}
        />

        {/* Celestial Coordinate Grid (RA/Dec Observatory Reticle) */}
        <CelestialCoordinateGrid visible={showCelestialGrid} />
      </Canvas>
    </div>
  );
}
