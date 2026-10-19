import React, { useEffect, useState } from 'react';
import './WuwaPage.css';
import AstriteIcon from '../../assets/wuwa/currency-astrite.svg';
import RadiantTideIcon from '../../assets/wuwa/currency-radiant-tide.svg';
import ForgingTideIcon from '../../assets/wuwa/currency-forging-tide.svg';
import LustrousTideIcon from '../../assets/wuwa/currency-lustrous-tide.svg';
import WuwaLogoDark from '../../assets/wuwa/logo-dark.svg';
import WuwaLogoLight from '../../assets/wuwa/logo-light.svg';
import { GachaLayout, GachaCard, CurrencyInput, DoublePassContainer, ResultBox } from '../../components/GachaDashboard.jsx';

const CONVENE_COST = 160;
const FIVE_STAR_CYCLE = 80;

const WuwaPage = () => {
	useEffect(() => {
		document.title = "Wuthering Waves";

		return () => {
			document.title = "Gacha Calculator";
		};
	}, []);

	const [astrites, setAstrites] = useState(() => localStorage.getItem('wuwa_astrites') || '0');
	const [lunites, setLunites] = useState(() => localStorage.getItem('wuwa_lunites') || '0');
	const [radiantTides, setRadiantTides] = useState(() => localStorage.getItem('wuwa_radiant_tides') || '0');
	const [forgingTides, setForgingTides] = useState(() => localStorage.getItem('wuwa_forging_tides') || '0');
	const [lustrousTides, setLustrousTides] = useState(() => localStorage.getItem('wuwa_lustrous_tides') || '0');
	const [characterPulls, setCharacterPulls] = useState(0);
	const [weaponPulls, setWeaponPulls] = useState(0);

	useEffect(() => {
		localStorage.setItem('wuwa_astrites', astrites);
		localStorage.setItem('wuwa_lunites', lunites);
		localStorage.setItem('wuwa_radiant_tides', radiantTides);
		localStorage.setItem('wuwa_forging_tides', forgingTides);
		localStorage.setItem('wuwa_lustrous_tides', lustrousTides);
	}, [astrites, lunites, radiantTides, forgingTides, lustrousTides]);

	useEffect(() => {
		const premiumCurrency = (parseInt(astrites, 10) || 0) + (parseInt(lunites, 10) || 0);
		const currencyPulls = Math.floor(premiumCurrency / CONVENE_COST);
		const radiantPulls = parseInt(radiantTides, 10) || 0;
		const forgingPulls = parseInt(forgingTides, 10) || 0;

		setCharacterPulls(currencyPulls + radiantPulls);
		setWeaponPulls(currencyPulls + forgingPulls);
	}, [astrites, lunites, radiantTides, forgingTides]);

	const handleFocus = (event) => {
		event.target.select();
	};

	const handleInputChange = (event, setter) => {
		const value = event.target.value;
		if (value === '' || parseInt(value, 10) < 0) {
			setter('0');
			return;
		}

		setter(String(parseInt(value, 10)));
	};

	const standardPulls = parseInt(lustrousTides, 10) || 0;
	const characterProgress = characterPulls % FIVE_STAR_CYCLE;
	const weaponProgress = weaponPulls % FIVE_STAR_CYCLE;

	return (
		<GachaLayout
			themeClass="theme-wuwa"
			eyebrow="Convene"
			title="Wuthering Waves"
			lightModeLogoSrc={WuwaLogoLight}
			darkModeLogoSrc={WuwaLogoDark}
			logoAlt="Wuthering Waves"
		>
			<GachaCard title="Resources" isPrimary>
				<CurrencyInput
					label="Astrite"
					iconSrc={AstriteIcon}
					value={astrites}
					onChange={(event) => handleInputChange(event, setAstrites)}
					onFocus={handleFocus}
				/>
				<CurrencyInput
					label="Lunite"
					value={lunites}
					onChange={(event) => handleInputChange(event, setLunites)}
					onFocus={handleFocus}
				/>

				<DoublePassContainer>
					<CurrencyInput
						label="Radiant Tide"
						iconSrc={RadiantTideIcon}
						value={radiantTides}
						onChange={(event) => handleInputChange(event, setRadiantTides)}
						onFocus={handleFocus}
						inPassContainer
						isSpecial
					/>
					<CurrencyInput
						label="Forging Tide"
						iconSrc={ForgingTideIcon}
						value={forgingTides}
						onChange={(event) => handleInputChange(event, setForgingTides)}
						onFocus={handleFocus}
						inPassContainer
					/>
				</DoublePassContainer>

				<CurrencyInput
					label="Lustrous Tide"
					iconSrc={LustrousTideIcon}
					value={lustrousTides}
					onChange={(event) => handleInputChange(event, setLustrousTides)}
					onFocus={handleFocus}
				/>
			</GachaCard>

			<GachaCard title="Result" isResults>
				<ResultBox label="Character pulls" value={characterPulls} progress={(characterProgress / FIVE_STAR_CYCLE) * 100} progressLabel="Next 5-star progress" />
				<ResultBox
					label="Weapon pulls"
					value={weaponPulls}
					description={`${weaponProgress}/${FIVE_STAR_CYCLE}`}
					highlightType="secondary"
				/>
				<ResultBox
					label="Lustrous tides"
					value={standardPulls}
					highlightType="primary"
				/>
			</GachaCard>
		</GachaLayout>
	);
};

export default WuwaPage;
