import React from 'react';

const ThemeIcon = ({ theme }) => {
	const isLight = theme === 'light';

	if (isLight) {
		return (
			<svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
				<path d="M20.6 14.2A7.4 7.4 0 0 1 9.8 3.4a8.8 8.8 0 1 0 10.8 10.8Z" />
			</svg>
		);
	}

	return (
		<svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
			<circle cx="12" cy="12" r="4.2" />
			<path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
		</svg>
	);
};

export default ThemeIcon;
