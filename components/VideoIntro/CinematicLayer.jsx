'use client';

import { useEffect, useRef } from 'react';
import styles from './VideoIntro.module.css';

export default function CinematicLayer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // All Three.js resources tracked here for clean disposal
    const res = { renderer: null, geo: null, mat: null };
    const listeners = [];
    let rafId;

    const addListener = (el, type, fn, opts) => {
      el.addEventListener(type, fn, opts);
      listeners.push({ el, type, fn });
    };

    const init = async () => {
      const THREE = await import('three');

      // ── Scene ──────────────────────────────────────────────
      const scene    = new THREE.Scene();
      const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 7);

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      res.renderer = renderer;

      // ── Particle geometry ──────────────────────────────────
      const COUNT = 220;
      const positions = new Float32Array(COUNT * 3);
      const colors    = new Float32Array(COUNT * 3);
      const aSizes    = new Float32Array(COUNT);
      const aPhases   = new Float32Array(COUNT);
      const aSpeeds   = new Float32Array(COUNT);

      // Warm orange / amber / near-white palette
      const palette = [
        [1.00, 0.55, 0.26],  // vivid orange
        [1.00, 0.42, 0.16],  // deep ember
        [1.00, 0.70, 0.36],  // amber
        [1.00, 0.85, 0.62],  // warm cream
        [0.88, 0.90, 1.00],  // cool blue-white (monitor glow)
        [1.00, 0.95, 0.82],  // near-white warm
      ];

      for (let i = 0; i < COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 22;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 13;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3]     = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];

        aSizes[i]  = Math.random() * 90 + 20;
        aPhases[i] = Math.random() * Math.PI * 2;
        aSpeeds[i] = Math.random() * 0.35 + 0.08;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
      geo.setAttribute('aSize',    new THREE.BufferAttribute(aSizes,    1));
      geo.setAttribute('aPhase',   new THREE.BufferAttribute(aPhases,   1));
      geo.setAttribute('aSpeed',   new THREE.BufferAttribute(aSpeeds,   1));
      res.geo = geo;

      // ── Bokeh shader material ──────────────────────────────
      const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          attribute float aSize;
          attribute float aPhase;
          attribute float aSpeed;
          attribute vec3  color;
          varying   vec3  vColor;
          varying   float vAlpha;
          uniform   float uTime;

          void main() {
            vColor = color;

            vec3 pos = position;
            float t  = uTime * aSpeed;
            pos.x   += sin(t + aPhase)          * 0.45;
            pos.y   += cos(t * 0.68 + aPhase)   * 0.30;
            pos.z   += sin(t * 0.42 + aPhase)   * 0.18;

            // Depth-based fade so far-back particles are ghostly
            float depthFade = 1.0 - clamp(abs(pos.z) * 0.14, 0.0, 0.75);
            vAlpha = depthFade;

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = aSize * (340.0 / -mv.z);
            gl_Position  = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3  vColor;
          varying float vAlpha;

          void main() {
            vec2  uv   = gl_PointCoord - 0.5;
            float dist = length(uv);
            if (dist > 0.5) discard;

            // Layered bokeh: hard disc center + soft diffusion halo
            float core  = exp(-dist * dist * 18.0);
            float halo  = exp(-dist * dist *  5.0) * 0.55;
            float ring  = smoothstep(0.50, 0.30, dist) * 0.18;
            float alpha = (core + halo + ring) * 0.26 * vAlpha;

            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false,
        vertexColors: true,
      });
      res.mat = mat;

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // ── Mouse parallax ────────────────────────────────────
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

      const onMouse = (e) => {
        mouse.tx = (e.clientX / window.innerWidth  - 0.5) *  2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * -2;
      };
      addListener(window, 'mousemove', onMouse, { passive: true });

      // Touch parallax for mobile
      const onTouch = (e) => {
        if (!e.touches[0]) return;
        mouse.tx = (e.touches[0].clientX / window.innerWidth  - 0.5) *  2;
        mouse.ty = (e.touches[0].clientY / window.innerHeight - 0.5) * -2;
      };
      addListener(window, 'touchmove', onTouch, { passive: true });

      // ── Resize ────────────────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      addListener(window, 'resize', onResize, { passive: true });

      // ── Render loop ───────────────────────────────────────
      let t = 0;
      const tick = () => {
        rafId = requestAnimationFrame(tick);
        t += 0.004;

        mat.uniforms.uTime.value = t;

        // Smooth camera drift toward mouse position
        mouse.x += (mouse.tx - mouse.x) * 0.035;
        mouse.y += (mouse.ty - mouse.y) * 0.035;
        camera.position.x = mouse.x * 0.45;
        camera.position.y = mouse.y * 0.35;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      tick();
    };

    init();

    return () => {
      cancelAnimationFrame(rafId);
      listeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
      res.geo?.dispose();
      res.mat?.dispose();
      res.renderer?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.cinematicCanvas} />;
}
