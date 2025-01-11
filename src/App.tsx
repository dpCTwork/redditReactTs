import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProfilePage from "./pages/ProfilePage"
import HomePage from "./pages/HomePage"
import Layout from "./components/Layout"
import SubredditPage from "./pages/SubredditPage"
import SubmitPage from "./pages/SubmitPage"
import PostPage from "./pages/PostPage"
import "./styles/App.css"

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					{/* all other routes encompassed by the main route above that has the layout structure */}
					<Route index element={<HomePage />}></Route>
					<Route path="r/:subredditName" element={<SubredditPage />}></Route>
					<Route path="r/:subredditName/submit" element={<SubmitPage />}></Route>
					<Route path="u/:username" element={<ProfilePage />}></Route>
					<Route path="post/:postId" element={<PostPage />}></Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
