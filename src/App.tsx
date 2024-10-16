import { useEffect,useState } from 'react'
import { Tldraw, track, useEditor, } from 'tldraw'
import 'tldraw/tldraw.css'
import './custom-ui.css'
import { useSyncDemo } from '@tldraw/sync'


// Splash Screen Component
const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
	useEffect(() => {
		const timer = setTimeout(onFinish, 10000);
		return () => clearTimeout(timer);
	}, [onFinish]);


	return (
		<div className="splash-screen">
			<video
				autoPlay
				playsInline
				muted 
				onEnded={onFinish}>
				<source src="/splash.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
	};

export default function CustomUiExample() {
	const [showSplash, setShowSplash] = useState(true);
	const store = useSyncDemo({ roomId: "Rockefeller2" })
	const [newShapeCreated, setNewShapeCreated] = useState(false);
	const [totalContributions, setTotalContributions] = useState(0);
	const [canContribute, setCanContribute] = useState(true);
	
	const handleSplashFinish = () => {
		setShowSplash(false);
	};

	const handleNewShapeCreated = () => {
		setNewShapeCreated(true);
		if (canContribute) {
			setTotalContributions(prev => prev + 1);
			setCanContribute(false);
		}
	};
	
	return (
		<div className="tldraw__editor">
			{showSplash ? (
				<SplashScreen onFinish={handleSplashFinish} />
			) : (
			<Tldraw hideUi store = {store}>
				<CustomUi newShapeCreated={newShapeCreated}
				totalContributions={totalContributions}
				setTotalContributions={setTotalContributions}
				/>
				<InsideOfContext onNewShapeCreated={handleNewShapeCreated}/>
			</Tldraw>
			)}
		</div>
	)
}
	
const CustomUi = track(({ newShapeCreated, totalContributions }) => {
	const editor = useEditor()

	useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Delete':
				case 'Backspace': {
					editor.deleteShapes(editor.getSelectedShapeIds())
					break
				}
				case 'v': {
					editor.setCurrentTool('select')
					break
				}
				// case 'e': {
				// 	editor.setCurrentTool('eraser')
				// 	break
				// }
				case 'x':
				case 'p':
				case 'b':
				case 'd': {
					editor.setCurrentTool('draw')
					break
				}
			}
		}

		window.addEventListener('keyup', handleKeyUp)
		return () => {
			window.removeEventListener('keyup', handleKeyUp)
		}

	})

	const handleNext = () => {
		// Add your logic for what should happen when "Next" is clicked
		console.log("Next button clicked!")
		window.open("https://docs.google.com/forms/d/e/1FAIpQLSdAN4XF36AGJSsAqEvPm5TMmM4HWXucwZyy8yl62lLQvuabyQ/viewform?usp=sf_link")
	}

	return (
		<div className="custom-layout">
			<div className="header">
				<header>
					{!newShapeCreated && (
					<h1> Welcome! Feel free to add to the conversation!</h1>
					)}
					{newShapeCreated && (
					<h1> Feel free to click next when you're finished!</h1>
					)}
					<h2> {25+ totalContributions} Total Contributions </h2>
				</header>
			</div>
			<div className="custom-toolbar">
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'select'}
					onClick={() => editor.setCurrentTool('select')}
				>
					Select
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'draw'}
					onClick={() => editor.setCurrentTool('draw')}
				>
					Pencil
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'text'}
					onClick={() => editor.setCurrentTool('text')}
				>
					Text
				</button>
				{/* <button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'eraser'}
					onClick={() => editor.setCurrentTool('eraser')}
				>
					Eraser
				</button> */}
				{newShapeCreated && (
					<button
						className="custom-button next-button"
						onClick={handleNext}
					>
						Next
					</button>
				)}
			</div>
			{/* <div className="fill-watermark-container">
				<div className="fill-watermark">
				</div>
			</div> */}
		</div>
	)
})

interface InsideOfContextProps {
	onNewShapeCreated: () => void;
}

function InsideOfContext({ onNewShapeCreated }: InsideOfContextProps) {
	const editor = useEditor()

	useEffect(() => {
		const unsubscribe = editor.sideEffects.registerAfterCreateHandler('shape', (newShape) => {
			if (newShape) {
				console.log('New shape created:', newShape)
				onNewShapeCreated()
			}
		})

		return () => {
			unsubscribe()
		}
	}, [editor, onNewShapeCreated])

	return null
}
