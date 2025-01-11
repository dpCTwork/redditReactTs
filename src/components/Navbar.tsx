import { FaPlus, FaReddit, FaUser } from "react-icons/fa"
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react"
import { Authenticated, Unauthenticated } from "convex/react"
import { Link, useNavigate } from "react-router-dom"

import "../styles/Navbar.css"
import CreateDropdown from "./CreateDropdown"
import { useState } from "react"

const Navbar = () => {
	const { user } = useUser()
	const navigate = useNavigate()

	const [showDropdown, setShowDropdown] = useState(false)

	return (
		<nav className="navbar">
			<div className="navbar-content">
				<Link to="/" className="logo-link">
					<div className="logo-container">
						<FaReddit className="reddit-icon"></FaReddit>
						<span className="site-name">reddit</span>
					</div>
				</Link>

				<div>Search Bar</div>
				<div className="nav-actions">
					<Unauthenticated>
						<SignInButton mode="modal">
							<button className="sign-in-button">Sign In</button>
						</SignInButton>
					</Unauthenticated>
					<Authenticated>
						<div className="dropdown-container">
							<button className="icon-button" onClick={() => setShowDropdown(true)}>
								<FaPlus />
							</button>
							{showDropdown && (
								<CreateDropdown isOpen={showDropdown} onClose={() => setShowDropdown(false)} />
							)}
						</div>
						<button
							className="icon-button"
							onClick={() => user?.username && navigate(`/u/${user.username}`)}
							title="View Profile">
							<FaUser />
						</button>
						<UserButton />
					</Authenticated>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
