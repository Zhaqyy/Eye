import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";

import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });

function Ocean() {
    const ref = useRef();
    const gl = useThree((state) => state.gl);
    const waterNormals = useLoader(
      THREE.TextureLoader, "/Texture/wn.jpg"
    );
  
  
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
    // waterNormals.repeat.set( 5, 5 );
    const geom = useMemo(() => new THREE.PlaneGeometry(10, 10), []);
    const config = useMemo(
      () => ({
        textureWidth: 124,
        textureHeight: 124,
        waterNormals,
        sunDirection: new THREE.Vector3(),
        sunColor: 0xff0000,
        waterColor: 0x001e0f,
        distortionScale: 3,
        fog: true,
        format: gl.encoding,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [waterNormals]
    );
    useFrame(
      (state, delta) => (ref.current.material.uniforms.time.value += delta * 0.05)
    );
    return (
      <water
        ref={ref}
        args={[geom, config]}
        // rotation-x={-Math.PI / 2}
        position={[0, 0, 1]}
      />
    );
  }