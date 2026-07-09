import React from 'react';
import { Link } from 'react-router-dom';
import ThemeIcon from './ThemeIcon.jsx';
import './Drawer.css';

const Drawer = ({ isOpen, onClose, theme, onThemeToggle }) => {
	const themeToggleLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

	return (
		<>
			<div
				className={`drawer-backdrop ${isOpen ? 'active' : ''}`}
				onClick={onClose}
			/>

			<aside className={`drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen} inert={isOpen ? undefined : true}>
				<div className="drawer-header">
					<div>
						<h2>Calculators</h2>
						<p>Open a planner</p>
					</div>
					<button className="drawer-close" onClick={onClose} aria-label="Close menu">
						Close
					</button>
				</div>

				<nav className="drawer-content" aria-label="Mobile navigation">
					<Link to="/" onClick={onClose}>Home</Link>
					<Link to="/gbf" onClick={onClose}>Granblue Fantasy</Link>
					<Link to="/wuwa" onClick={onClose}>Wuthering Waves</Link>
					<Link to="/nikke" onClick={onClose}>Nikke</Link>
					<Link to="/hsr" onClick={onClose}>Honkai: Star Rail</Link>
					<Link to="/zzz" onClick={onClose}>Zenless Zone Zero</Link>
					<Link to="/ba" onClick={onClose}>Blue Archive</Link>
				</nav>

				<div className="drawer-footer">
					<button
						className="theme-toggle-drawer"
						onClick={onThemeToggle}
						aria-label={themeToggleLabel}
					>
						<ThemeIcon theme={theme} />
					</button>
				</div>
			</aside>
		</>
	);
};

export default Drawer;
