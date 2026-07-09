import React, { useState, useEffect } from 'react';
import './GbfPage.css';
import CrystalIcon from '../../assets/gbf/currency-crystal.jpg';
import GbfLogo from '../../assets/gbf/logo-simple.png';
import { GachaLayout, GachaCard, CurrencyInput, ResultBox } from '../../components/GachaDashboard.jsx';

const SPARK_TARGET = 300;

const GbfPage = () => {
	useEffect(() => {
		document.title = 'Granblue Fantasy';
		return () => {
			document.title = 'Gacha Calculator';
		};
	}, []);

	const [crystals, setCrystals] = useState(() => localStorage.getItem('gbf_crystals') || '0');
	const [singleTickets, setSingleTickets] = useState(() => localStorage.getItem('gbf_single_tickets') || '0');
	const [tenTickets, setTenTickets] = useState(() => localStorage.getItem('gbf_ten_tickets') || '0');
	const [totalRolls, setTotalRolls] = useState(0);
	const [percentage, setPercentage] = useState(0);

	useEffect(() => {
		localStorage.setItem('gbf_crystals', crystals);
		localStorage.setItem('gbf_single_tickets', singleTickets);
		localStorage.setItem('gbf_ten_tickets', tenTickets);
	}, [crystals, singleTickets, tenTickets]);

	useEffect(() => {
		const crystalRolls = Math.floor((parseInt(crystals, 10) || 0) / 300);
		const singleRolls = parseInt(singleTickets, 10) || 0;
		const tenRolls = (parseInt(tenTickets, 10) || 0) * 10;
		const total = crystalRolls + singleRolls + tenRolls;

		setTotalRolls(total);
		setPercentage(Math.floor((total / SPARK_TARGET) * 100));
	}, [crystals, singleTickets, tenTickets]);

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
			themeClass="theme-gbf"
			eyebrow="Draw"
			title="Granblue Fantasy"
			logoSrc={GbfLogo}
		>
			<GachaCard title="Resources" isPrimary>
				<CurrencyInput
					label="Crystals"
					iconSrc={CrystalIcon}
					value={crystals}
					onChange={(event) => handleInputChange(event, setCrystals)}
					onFocus={handleFocus}
				/>
				<CurrencyInput
					label="Single tickets"
					value={singleTickets}
					onChange={(event) => handleInputChange(event, setSingleTickets)}
					onFocus={handleFocus}
				/>
				<CurrencyInput
					label="10-part tickets"
					value={tenTickets}
					onChange={(event) => handleInputChange(event, setTenTickets)}
					onFocus={handleFocus}
				/>
			</GachaCard>

			<GachaCard title="Result" isResults>
				<ResultBox label="Total rolls" value={totalRolls} progress={progress} progressLabel="Spark progress" />
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

export default GbfPage;
