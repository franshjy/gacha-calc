import React, { useState, useEffect } from 'react';
import './ZzzPage.css';
import PolyIcon from '../../assets/zzz/currency-poly.png';
import MonoIcon from '../../assets/zzz/currency-mono.png';
import MasterTapeIcon from '../../assets/zzz/currency-master-tape.png';
import EncryptedTapeIcon from '../../assets/zzz/currency-encrypted-tape.png';
import ZzzLogoDark from '../../assets/zzz/logo-dark.webp';
import ZzzLogoLight from '../../assets/zzz/logo-light.webp';
import { GachaLayout, GachaCard, CurrencyInput, DoublePassContainer, ResultBox } from '../../components/GachaDashboard.jsx';

const ZzzPage = () => {
	useEffect(() => {
		document.title = "Zenless Zone Zero";
		return () => {
			document.title = "Gacha Calculator";
		};
	}, []);

	const [polychromes, setPolychromes] = useState(() => localStorage.getItem('zzz_polychromes') || '0');
	const [monochromes, setMonochromes] = useState(() => localStorage.getItem('zzz_monochromes') || '0');
	const [masterTapes, setMasterTapes] = useState(() => localStorage.getItem('zzz_master_tapes') || '0');
	const [encryptedTapes, setEncryptedTapes] = useState(() => localStorage.getItem('zzz_encrypted_tapes') || '0');
	const [totalSignalSearches, setTotalSignalSearches] = useState(0);
	const [guarantees, setGuarantees] = useState("0");

	useEffect(() => {
		localStorage.setItem('zzz_polychromes', polychromes);
		localStorage.setItem('zzz_monochromes', monochromes);
		localStorage.setItem('zzz_master_tapes', masterTapes);
		localStorage.setItem('zzz_encrypted_tapes', encryptedTapes);
	}, [polychromes, monochromes, masterTapes, encryptedTapes]);

	useEffect(() => {
		const totalPoly = (parseInt(polychromes) || 0) + (parseInt(monochromes) || 0);
		const polyRolls = Math.floor(totalPoly / 160);
		const encryptedTapeRolls = parseInt(encryptedTapes) || 0;
		// Standard tapes (masterTapes) should not count towards limited guarantees

		const limitedSearches = polyRolls + encryptedTapeRolls;
		setTotalSignalSearches(limitedSearches);

		// ZZZ pity is 90 for limited
		setGuarantees((limitedSearches / 90).toFixed(2));
	}, [polychromes, monochromes, masterTapes, encryptedTapes]);

	const handleFocus = (e) => {
		e.target.select();
	};

	const handleInputChange = (e, setter) => {
		const value = e.target.value;
		if (value === '' || parseInt(value, 10) < 0) {
			setter('0');
		} else {
			const cleanValue = String(parseInt(value, 10));
			setter(cleanValue);
		}
	};

	const nextGuaranteeProgress = totalSignalSearches % 90;

	return (
		<GachaLayout
			themeClass="theme-zzz"
			eyebrow="Signal search"
			title="Zenless Zone Zero"
			lightModeLogoSrc={ZzzLogoLight}
			darkModeLogoSrc={ZzzLogoDark}
		>
			<GachaCard title="Resources" isPrimary>
				<CurrencyInput
					label="Polychrome"
					iconSrc={PolyIcon}
					value={polychromes}
					onChange={(e) => handleInputChange(e, setPolychromes)}
					onFocus={handleFocus}
				/>
				<CurrencyInput
					label="Monochrome"
					iconSrc={MonoIcon}
					value={monochromes}
					onChange={(e) => handleInputChange(e, setMonochromes)}
					onFocus={handleFocus}
				/>

				<DoublePassContainer>
					<CurrencyInput
						label="Master Tape"
						iconSrc={MasterTapeIcon}
						value={masterTapes}
						onChange={(e) => handleInputChange(e, setMasterTapes)}
						onFocus={handleFocus}
						inPassContainer
					/>
					<CurrencyInput
						label="Encrypted Tape"
						iconSrc={EncryptedTapeIcon}
						value={encryptedTapes}
						onChange={(e) => handleInputChange(e, setEncryptedTapes)}
						onFocus={handleFocus}
						inPassContainer
						isSpecial
					/>
				</DoublePassContainer>
			</GachaCard>

			<GachaCard title="Result" isResults>
				<ResultBox label="Limited searches" value={totalSignalSearches} progress={(nextGuaranteeProgress / 90) * 100} progressLabel="Next S-rank cycle progress" />
				<ResultBox
					label="S-rank guarantees"
					value={guarantees}
					description={`${nextGuaranteeProgress}/90`}
					highlightType="secondary"
				/>
			</GachaCard>
		</GachaLayout>
	);
};

export default ZzzPage;
