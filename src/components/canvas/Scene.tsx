'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Preload, Stats } from '@react-three/drei'
import { getProject } from '@theatre/core'
import {  SheetProvider } from '@theatre/r3f'
import extension from '@theatre/r3f/dist/extension'
import studio from '@theatre/studio'
// import projectState from '@/public/Ribbon r3f Project.theatre-project-state-5.json'
import Experience from './Experience'
import { useIsClient } from '@uidotdev/usehooks'
import { Leva } from 'leva'


const isProd = false

if (!isProd) {
  studio.initialize()
  studio.extend(extension)
  studio.ui.hide()
}
export const project = getProject(
	'New Project',
	isProd
		? {
			// state: projectState,
		}
		: undefined
)
export const newSheet = project.sheet('New Sheet')



export default function Scene({ ...props }) {
	// const setIntroCompleted = useAnimationStore((state) => state.setIntroCompleted)
	// const [start, setStart] = useState(false)
	// const isClient = useIsClient()
	// const GPUTier = useDetectGPU()

	useEffect(() => {
			// Delay the animation by 2.5 seconds
			const animationTimer = setTimeout(() => {
				project.ready.then(() => {
					newSheet.sequence.position = 0
					newSheet.sequence
						.play({
							range: [0, 9],
							
						})		
				})
			}, 2500)

			// Cleanup function to clear the timeout if component unmounts
			return () => clearTimeout(animationTimer)
	}, [])


	// if (!isClient) return null

	return (
		<>
		<Leva hidden />
				<Canvas
					{...props}
					shadows
					gl={{
						antialias: false,
						preserveDrawingBuffer: true,
						powerPreference: 'high-performance',
						toneMappingExposure: 2,
						precision: "highp",
					}}
					onCreated={({ gl }) => {
						gl.clearDepth()
						gl.toneMapping = THREE.NoToneMapping
						gl.getContext().getExtension('OES_texture_float')
					}}
					dpr={2}
					style={{
						zIndex: 30,
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh',
						pointerEvents: 'auto',
					}}
				>
					<Stats />

					<Suspense fallback={null}>
						<SheetProvider sheet={newSheet}>
							<Experience />
							<Preload all />
						</SheetProvider>
					</Suspense>
				</Canvas>
		</>
	)
}
