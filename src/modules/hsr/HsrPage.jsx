import React, { useState, useEffect } from 'react';
import './HsrPage.css';
import StellarJadeIcon from '../../assets/hsr/currency-stellar-jade.png';
import OneiricShardIcon from '../../assets/hsr/currency-oneiric-shard.png';
import PassIcon from '../../assets/hsr/currency-pass.png';
import SpecialPassIcon from '../../assets/hsr/currency-special-pass.png';
import HsrLogo from '../../assets/hsr/logo.webp';
import { GachaLayout, GachaCard, CurrencyInput, DoublePassContainer, ResultBox } from '../../components/GachaDashboard.jsx';

const HsrPage = () => {
	useEffect(() => {
		document.title = "Honkai: Star Rail";
		return () => {
			document.title = "Gacha Calculator";
		};
	}, []);

	const [stellarJades, setStellarJades] = useState(() => localStorage.getItem('hsr_stellar_jades') || '0');
	const [oneiricShards, setOneiricShards] = useState(() => localStorage.getItem('hsr_oneiric_shards') || '0');
	const [singleTickets, setSingleTickets] = useState(() => localStorage.getItem('hsr_single_tickets') || '0');
	const [specialPasses, setSpecialPasses] = useState(() => localStorage.getItem('hsr_special_passes') || '0');
	const [totalLimitedWarps, setTotalLimitedWarps] = useState(0);
	const [guarantees, setGuarantees] = useState("0");

	useEffect(() => {
		localStorage.setItem('hsr_stellar_jades', stellarJades);
		localStorage.setItem('hsr_oneiric_shards', oneiricShards);
		localStorage.setItem('hsr_single_tickets', singleTickets);
		localStorage.setItem('hsr_special_passes', specialPasses);
	}, [stellarJades, oneiricShards, singleTickets, specialPasses]);

	useEffect(() => {
		const totalJades = (parseInt(stellarJades) || 0) + (parseInt(oneiricShards) || 0);
		const jadeRolls = Math.floor(totalJades / 160);
		const specialPassRolls = parseInt(specialPasses) || 0;

		const limitedWarps = jadeRolls + specialPassRolls;
		setTotalLimitedWarps(limitedWarps);
		setGuarantees((limitedWarps / 90).toFixed(2));
	}, [stellarJades, oneiricShards, singleTickets, specialPasses]);

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

	const nextGuaranteeProgress = totalLimitedWarps % 90;

	return (
		<GachaLayout
			themeClass="theme-hsr"
			eyebrow="Warp"
			title="Honkai: Star Rail"
			logoSrc={HsrLogo}
		>
			<GachaCard title="Resources" isPrimary>
				<CurrencyInput
					label="Stellar Jade"
					iconSrc={StellarJadeIcon}
					value={stellarJades}
					onChange={(e) => handleInputChange(e, setStellarJades)}
					onFocus={handleFocus}
				/>
				<CurrencyInput
					label="Oneiric Shard"
					iconSrc={OneiricShardIcon}
					value={oneiricShards}
					onChange={(e) => handleInputChange(e, setOneiricShards)}
					onFocus={handleFocus}
				/>

				<DoublePassContainer>
					<CurrencyInput
						label="Star Rail Pass"
						iconSrc={PassIcon}
						value={singleTickets}
						onChange={(e) => handleInputChange(e, setSingleTickets)}
						onFocus={handleFocus}
						inPassContainer
					/>
					<CurrencyInput
						label="Special Pass"
						iconSrc={SpecialPassIcon}
						value={specialPasses}
						onChange={(e) => handleInputChange(e, setSpecialPasses)}
						onFocus={handleFocus}
						inPassContainer
						isSpecial
					/>
				</DoublePassContainer>
			</GachaCard>

			<GachaCard title="Result" isResults>
				<ResultBox label="Limited warps" value={totalLimitedWarps} progress={(nextGuaranteeProgress / 90) * 100} progressLabel="Next 5-star cycle progress" />
				<ResultBox
					label="5-star guarantees"
					value={guarantees}
					description={`${nextGuaranteeProgress}/90`}
					highlightType="secondary"
				/>
			</GachaCard>
		</GachaLayout>
	);
};

export default HsrPage;
