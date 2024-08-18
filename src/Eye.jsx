import React, { forwardRef, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export const Eye = forwardRef((props, ref) => {
  const { nodes, materials, animations } = useGLTF('/Model/Eye.glb')
  const { actions } = useAnimations(animations, ref)
  return (
    <group ref={ref} {...props} dispose={null}>
      <group name="Scene">
        <group name="Eye" position={[0,0, 0]} scale={0.003}>
          <skinnedMesh
            name="body"
            geometry={nodes.body.geometry}
            material={materials.ML1010_A_MATa}
            skeleton={nodes.body.skeleton}
          />
          <skinnedMesh
            name="eyeball"
            geometry={nodes.eyeball.geometry}
            material={materials.ML1010_A_MATb_MI}
            skeleton={nodes.eyeball.skeleton}
          />
          <primitive object={nodes['1027']} />
        </group>
      </group>
    </group>
  )
})

useGLTF.preload('/Model/Eye.glb')
