import React, { forwardRef, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export const Eye = forwardRef((props, ref) => {
  const { nodes, materials, animations } = useGLTF('/Model/Eye.glb')
  const { actions } = useAnimations(animations, ref)
  return (
    <group ref={ref} {...props} dispose={null}>
      <group name="Scene">
        <group name="Eye" scale={0.003}>
          <primitive object={nodes['1027']} />
        </group>
        <skinnedMesh
          name="body"
          geometry={nodes.body.geometry}
          material={materials.skin}
          skeleton={nodes.body.skeleton}
          scale={0.003}
        />
        <skinnedMesh
          name="eyeball"
          geometry={nodes.eyeball.geometry}
          material={materials.eyeball}
          skeleton={nodes.eyeball.skeleton}
          scale={0.003}
        />
      </group>
    </group>
  )
})

useGLTF.preload('/Model/Eye.glb')
