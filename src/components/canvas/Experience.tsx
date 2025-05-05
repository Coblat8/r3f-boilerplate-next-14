'use client'

import { GizmoHelper, GizmoViewport, OrbitControls, shaderMaterial } from '@react-three/drei'
import { Object3DNode, useFrame } from '@react-three/fiber'
import { editable as e, PerspectiveCamera, useCurrentSheet } from '@theatre/r3f'
import { useIsClient } from '@uidotdev/usehooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'

// @ts-ignore
import vertex from '@/src/glsl/shading/vertex.glsl'
// @ts-ignore
import fragment from '@/src/glsl/shading/fragment.glsl'
import { extend } from '@react-three/fiber'
import { types } from '@theatre/core'
import { MathUtils } from 'three'


const CustomShaderMaterial = shaderMaterial(
	{
		uTime: 0,
		uColor: new THREE.Color(0.2, 0.0, 0.1),
	},
	vertex,
	fragment,
)
extend({ CustomShaderMaterial })

interface ICustomShaderMaterial extends THREE.ShaderMaterial {
	uTime: number
	uColor: THREE.Color,
}

declare module '@react-three/fiber' {
	interface ThreeElements {
		customShaderMaterial: Object3DNode<ICustomShaderMaterial, typeof CustomShaderMaterial>
	}
}



export default function Experience() {

	const isMobile = window.innerWidth < 768
	const lookAtTarget = new THREE.Vector3(0, 0, 0)
	const cameraLookAtRef = useRef<THREE.Mesh>(null)
	const cameraRef = useRef<THREE.PerspectiveCamera>(null)
	const customShaderRef = useRef<ICustomShaderMaterial>(null)

	// Handle all updates in useFrame
	useFrame((state, delta) => {

		if (cameraRef.current && cameraLookAtRef.current) {
			cameraRef.current.lookAt(cameraLookAtRef.current.position)
		}
	})

	const isClient = useIsClient()
	if (!isClient) return null

	return (
		<>
			<PerspectiveCamera
				ref={cameraRef}
				theatreKey="Camera"
				makeDefault
				fov={isMobile ? 100 : 75}
				position={[0, 2, 10]}
				near={0.001}
				far={50000}
			/>

			<e.mesh
				theatreKey='lookAt'
				ref={cameraLookAtRef}
				position={lookAtTarget}
				visible={false}
			>
				<boxGeometry args={[0.2, 0.2, 0.2]} />
				<meshBasicMaterial color="hotpink" />
			</e.mesh>

			<mesh>
				<boxGeometry args={[1, 1, 1]}
				/>
				<customShaderMaterial
					ref={customShaderRef}
					key={CustomShaderMaterial.key}
					side={THREE.DoubleSide}
					transparent
				/>
			</mesh>


			<OrbitControls />
			<GizmoHelper
				alignment="bottom-right" // widget alignment within scene
				margin={[80, 80]} // widget margins (X, Y)
			>
				<GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
				{/* alternative: <GizmoViewcube /> */}
			</GizmoHelper>
		</>
	)
}


