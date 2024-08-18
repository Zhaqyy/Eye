import { Environment, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import { Eye } from "./Eye";

const Scene = () => {
  return (
    <>
      <Eye />
      <ambientLight />
      <Environment preset='night' environmentIntensity={1.5} />
      {/* <Ground /> */}
      {/* <Rig from={-Math.PI / 2} to={Math.PI / 2.66} /> */}
    </>
  );
};
export default Scene;

function Ground() {
  const [floor, normal] = useTexture(["/Texture/si-col.webp", "/Texture/si-norm.webp"]);
  return (
    // <MeshReflectorMaterial
    //   blur={[400, 100]}
    //   resolution={512}
    //   args={[10, 10]}
    //   mirror={0.5}
    //   mixBlur={6}
    //   mixStrength={1.5}
    //   rotation={[-Math.PI / 2, 0, Math.PI / 2]}
    // >
    //   {/* {(Material, props) => (
    //     <Material color='#a0a0a0' metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />
    //   )} */}
    // </MeshReflectorMaterial>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0,0,0]}>
        <planeGeometry args={[5, 5]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
  );
}
function Rig() {
    useFrame((state) => {
      state.camera.position.lerp({ x: 0, y: -state.pointer.y / 4, z: state.pointer.x / 2 }, 0.1)
      state.camera.lookAt(-1, 0, 0)
    })
  }
  