/* eslint-disable no-shadow */
import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { useRender, useThree } from 'react-three-fiber';
import OrbitControls from 'three-orbitcontrols';
import {
  getParticleVertexShader,
  getParticleFragmentShader
} from './shaders/ParticleShaders';
import {
  getLineVertexShader,
  getLineFragmentShader
} from './shaders/LineShaders';
import animate from './Animate';

// Cube dimensions
const r = 700;

/**
 * Creates a particle cloud with various config options
 */
const ParticleCube = ({
  showParticles,
  showLines,
  minDistance,
  limitConnections,
  maxConnections,
  particleCount,
  minParticleSize,
  maxParticleSize,
  boundingBox,
  showCube,
  particleShape,
  cameraControls
}) => {
  const controlsRef = useRef(0);
  const animation = useRef(0);
  const group = useRef();

  const { gl, canvas, camera, size } = useThree();
  // Scale rendering automatically to window DPI
  // https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setPixelRatio
  gl.setPixelRatio(window.devicePixelRatio);

  // Setup camera
  controlsRef.current = useMemo(() => {
    camera.fov = 45;
    camera.aspect = size.width / size.height;
    camera.near = 1;
    camera.far = 4000;

    // Remove event listeners from previous controls if they exist
    // Set initial camera position if controls haven't taken over yet
    if (controlsRef.current) controlsRef.current.dispose();
    else camera.position.set(0, 0, 1750);

    // Setup movement controls for mouse/touch to manipulate camera position
    // https://threejs.org/docs/#examples/controls/OrbitControls
    const controls = new OrbitControls(camera, canvas);

    // Apply given settings to camera controls
    Object.entries(cameraControls).forEach(([key, value]) => {
      controls[key] = value;
    });

    return controls;
  }, [cameraControls]);

  // Compute lines between points
  const [
    lineMeshGeometry,
    lineMeshMaterial,
    linePositions,
    lineColors
  ] = useMemo(() => {
    // Line material
    const lineMeshMaterial = new THREE.ShaderMaterial({
      vertexShader: getLineVertexShader(),
      fragmentShader: getLineFragmentShader(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      visible: showLines
    });

    // Line mesh geometry
    const lineMeshGeometry = new THREE.BufferGeometry();
    const segments = particleCount * particleCount;
    const positions = new Float32Array(segments * 3);
    const colors = new Float32Array(segments * 3);

    lineMeshGeometry.addAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3).setDynamic(true)
    );
    lineMeshGeometry.addAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3).setDynamic(true)
    );
    lineMeshGeometry.computeBoundingSphere();
    lineMeshGeometry.setDrawRange(0, 0);

    return [lineMeshGeometry, lineMeshMaterial, positions, colors];
  }, [showLines]);

  // Compute point cloud
  const [
    pointCloudGeometry,
    pointMaterial,
    particlesData,
    particlePositions
  ] = useMemo(() => {
    // Add particles to geometry
    // Maintain two arrays
    // particlePositions contains random x,y,z coords for each particle
    // particlesData contains a random x,y,z velocity vector for each particle
    const pointCloudGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particlesData = [];

    let particleBounds = r;
    if (boundingBox === 'canvas') particleBounds = size.width;
    if (boundingBox === 'cube') particleBounds = r;
    for (let i = 0; i < particleCount; i += 1) {
      const x = Math.random() * particleBounds - particleBounds / 2;
      const y = Math.random() * particleBounds - particleBounds / 2;
      const z = Math.random() * particleBounds - particleBounds / 2;
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Choose size of each particle
      particleSizes[i] =
        Math.random() * (maxParticleSize - minParticleSize) + minParticleSize;

      particlesData.push({
        velocity: new THREE.Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2
        ),
        numConnections: 0
      });
    }

    pointCloudGeometry.setDrawRange(0, particleCount);
    pointCloudGeometry.addAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3).setDynamic(true)
    );
    pointCloudGeometry.addAttribute(
      'size',
      new THREE.BufferAttribute(particleSizes, 1).setDynamic(true)
    );

    // Material for particle, use shaders to morph shape and color
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(Math.random() * 0xffffff) }
      },
      vertexShader: getParticleVertexShader(),
      fragmentShader: getParticleFragmentShader({ particleShape }),
      transparent: true,
      blending: THREE.AdditiveBlending,
      visible: showParticles
    });

    return [
      pointCloudGeometry,
      pointMaterial,
      particlesData,
      particlePositions
    ];
  }, [
    particleCount,
    showParticles,
    minParticleSize,
    maxParticleSize,
    boundingBox,
    showCube,
    particleShape
  ]);

  const animationState = {
    minDistance,
    limitConnections,
    maxConnections,
    particleCount,
    lineMeshGeometry,
    pointCloudGeometry,
    particlesData,
    particlePositions,
    linePositions,
    lineColors
  };

  animation.current = animationState;

  // Modify via refs
  useRender(() => {
    // Enables damping of OrbitControls
    requestAnimationFrame(() => controlsRef.current.update());
    // Animate current state of particles
    requestAnimationFrame(() => animate(animation.current));
  });

  return (
    <scene>
      <group ref={group}>
        {/* Bounding box that particles exist inside of */}
        {showCube && (
          <boxHelper>
            <mesh name="object">
              <meshBasicMaterial
                name="material"
                color="white"
                blending={THREE.AdditiveBlending}
                wireframe
                transparent
              />
              <boxBufferGeometry name="geometry" args={[r, r, r]} />
            </mesh>
          </boxHelper>
        )}
        {/* Lines connecting particles */}
        {showLines && (
          <lineSegments
            geometry={lineMeshGeometry}
            material={lineMeshMaterial}
          />
        )}

        {/* Particles */}
        {showParticles && (
          <points geometry={pointCloudGeometry} material={pointMaterial} />
        )}
      </group>
    </scene>
  );
};

ParticleCube.propTypes = {
  showParticles: PropTypes.bool,
  showLines: PropTypes.bool,
  showCube: PropTypes.bool,
  minDistance: PropTypes.number,
  limitConnections: PropTypes.bool,
  maxConnections: PropTypes.number,
  particleCount: PropTypes.number,
  minParticleSize: PropTypes.number,
  maxParticleSize: PropTypes.number,
  boundingBox: PropTypes.oneOf(['canvas', 'cube']),
  particleShape: PropTypes.oneOf(['circle', 'square']),
  cameraControls: PropTypes.shape({
    enabled: PropTypes.bool,
    enableDamping: PropTypes.bool,
    dampingFactor: PropTypes.number,
    enableZoom: PropTypes.bool,
    autoRotate: PropTypes.bool,
    autoRotateSpeed: PropTypes.number
  })
};

ParticleCube.defaultProps = {
  showParticles: true,
  showLines: false,
  showCube: true,
  minDistance: 150,
  limitConnections: true,
  maxConnections: 20,
  particleCount: 300,
  minParticleSize: 10,
  maxParticleSize: 75,
  boundingBox: 'canvas',
  particleShape: 'square',
  cameraControls: {
    enabled: true,
    enableDamping: true,
    dampingFactor: 0.2,
    enableZoom: true,
    autoRotate: true,
    autoRotateSpeed: 0.5
  }
};

export default ParticleCube;
