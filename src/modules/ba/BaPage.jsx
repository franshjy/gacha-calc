import React, { useState, useEffect } from 'react';
import './BaPage.css';
import PyroxeneIcon from '../../assets/ba/currency-pyroxene.png';
import BaLogoDark from '../../assets/ba/logo-dark.png';
import BaLogoLight from '../../assets/ba/logo-light.webp';
import { GachaLayout, GachaCard, CurrencyInput, ResultBox } from '../../components/GachaDashboard.jsx';

const SPARK_TARGET = 200;

const BaPage = () => {
	useEffect(() => {
		document.title = 'Blue Archive';
		return () => {
			document.title = 'Gacha Calculator';
		};
	}, []);

	const [pyroxenes, setPyroxenes] = useState(() => localStorage.getItem('ba_pyroxenes') || '0');
	const [singleTickets, setSingleTickets] = useState(() => localStorage.getItem('ba_single_tickets') || '0');
	const [tenTickets, setTenTickets] = useState(() => localStorage.getItem('ba_ten_tickets') || '0');
	const [totalRolls, setTotalRolls] = useState(0);
	const [percentage, setPercentage] = useState(0);

	useEffect(() => {
		localStorage.setItem('ba_pyroxenes', pyroxenes);
		localStorage.setItem('ba_single_tickets', singleTickets);
		localStorage.setItem('ba_ten_tickets', tenTickets);
	}, [pyroxenes, singleTickets, tenTickets]);

	useEffect(() => {
		const pyroxeneRolls = Math.floor((parseInt(pyroxenes, 10) || 0) / 120);
		const singleRolls = parseInt(singleTickets, 10) || 0;
		const tenRolls = (parseInt(tenTickets, 10) || 0) * 10;
		const total = pyroxeneRolls + singleRolls + tenRolls;

		setTotalRolls(total);
		setPercentage(Math.floor((total / SPARK_TARGET) * 100));
	}, [pyroxenes, singleTickets, tenTickets]);

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

	const progress = Math.min(percentage, 100);

	return (
		<GachaLayout
			themeClass="theme-ba"
			eyebrow="Recruitment"
			title="Blue Archive"
			lightModeLogoSrc={BaLogoLight}
			darkModeLogoSrc={BaLogoDark}
		>
			<GachaCard title="Resources" isPrimary>
				<CurrencyInput
					label="Pyroxenes"
					iconSrc={PyroxeneIcon}
					value={pyroxenes}
					onChange={(event) => handleInputChange(event, setPyroxenes)}
					onFocus={handleFocus}
				/>
				<CurrencyInput
					label="Single tickets"
					value={singleTickets}
					onChange={(event) => handleInputChange(event, setSingleTickets)}
					onFocus={handleFocus}
				/>
				<CurrencyInput
					label="10-pull tickets"
					value={tenTickets}
					onChange={(event) => handleInputChange(event, setTenTickets)}
					onFocus={handleFocus}
				/>
			</GachaCard>

			<GachaCard title="Result" isResults>
				<ResultBox label="Total pulls" value={totalRolls} progress={progress} progressLabel="Spark progress" />
				<ResultBox
					label="Spark progress"
					value={`${percentage}%`}
					description={`${totalRolls}/${SPARK_TARGET}`}
					highlightType="secondary"
				/>
			</GachaCard>
		</GachaLayout>
	);
};

export default BaPage;
