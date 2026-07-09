import React, { useId } from 'react';
import './GachaDashboard.css';

export const GachaLayout = ({
	themeClass,
	eyebrow,
	title,
	description,
	logoSrc,
	lightModeLogoSrc,
	darkModeLogoSrc,
	logoAlt = '',
	children,
}) => {
	const hasThemeLogos = lightModeLogoSrc && darkModeLogoSrc;

	return (
		<main className={`gacha-page ${themeClass}`}>
			<section className="gacha-shell">
				<header className="gacha-hero">
					<div className="gacha-hero-copy">
						{hasThemeLogos && (
							<>
								<img src={lightModeLogoSrc} alt={logoAlt} className="gacha-hero-logo gacha-hero-logo-theme gacha-hero-logo-light-mode" />
								<img src={darkModeLogoSrc} alt="" className="gacha-hero-logo gacha-hero-logo-theme gacha-hero-logo-dark-mode" aria-hidden="true" />
							</>
						)}
						{!hasThemeLogos && logoSrc && (
							<img src={logoSrc} alt={logoAlt} className="gacha-hero-logo" />
						)}
						{eyebrow && <p className="gacha-kicker">{eyebrow}</p>}
						<h1>{title}</h1>
						{description && <p className="gacha-subtitle">{description}</p>}
					</div>

				</header>

				<div className="gacha-dashboard">
					{children}
				</div>
			</section>
		</main>
	);
};

export const GachaCard = ({ title, description, isPrimary, isResults, children }) => {
	let cardClass = 'gacha-card';
	if (isPrimary) cardClass += ' gacha-card-primary';
	if (isResults) cardClass += ' gacha-card-results';

	return (
		<section className={cardClass}>
			<div className="gacha-card-heading">
				<h2 className="gacha-card-title">{title}</h2>
				{description && <p>{description}</p>}
			</div>
			{children}
		</section>
	);
};

export const CurrencyInput = ({ label, iconSrc, value, onChange, onFocus, isSpecial, inPassContainer, helper }) => {
	const inputId = useId();
	const content = (
		<>
			<div className="gacha-input-copy">
				<label className="gacha-input-label" htmlFor={inputId}>{label}</label>
				{helper && <span>{helper}</span>}
			</div>
			<div className={`gacha-input-wrapper ${isSpecial ? 'is-special' : ''}`}>
				{iconSrc && <img src={iconSrc} alt="" className="gacha-icon" aria-hidden="true" />}
				<input
					type="number"
					className="gacha-input"
					id={inputId}
					value={value}
					onChange={onChange}
					onFocus={onFocus}
					min="0"
				/>
			</div>
		</>
	);

	if (inPassContainer) {
		return <div className="gacha-input-group gacha-half-width">{content}</div>;
	}
	return <div className="gacha-input-group">{content}</div>;
};

export const DoublePassContainer = ({ children }) => {
	return <div className="gacha-passes-container">{children}</div>;
};

export const ResultBox = ({ label, value, description, highlightType = 'primary', progress, progressLabel }) => {
	const hasProgress = typeof progress === 'number';
	const safeProgress = hasProgress ? Math.max(0, Math.min(progress, 100)) : 0;

	return (
		<div className="gacha-result-box">
			<div>
				<span className="gacha-result-label">{label}</span>
				{description && <p className="gacha-result-description">{description}</p>}
			</div>
			<span className={`gacha-result-value gacha-highlight-${highlightType}`}>{value}</span>
			{hasProgress && (
				<div className="gacha-progress" aria-label={progressLabel || label}>
					<span style={{ width: `${safeProgress}%` }} />
				</div>
			)}
		</div>
	);
};
