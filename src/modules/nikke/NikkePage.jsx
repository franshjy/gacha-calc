import React, { useState, useEffect } from 'react';
import './NikkePage.css';
import GemIcon from '../../assets/nikke/currency-gem.png';
import VoucherIcon from '../../assets/nikke/currency-voucher.png';
import AdvancedVoucherIcon from '../../assets/nikke/currency-advanced-voucher.png';
import NikkeLogoDark from '../../assets/nikke/logo-dark.png';
import NikkeLogoLight from '../../assets/nikke/logo-light.png';
import { GachaLayout, GachaCard, CurrencyInput, DoublePassContainer, ResultBox } from '../../components/GachaDashboard.jsx';

const NikkePage = () => {
	useEffect(() => {
		document.title = 'Nikke';
		return () => {
			document.title = 'Gacha Calculator';
		};
	}, []);

	const [gems, setGems] = useState(() => localStorage.getItem('nikke_gems') || '0');
	const [vouchers, setVouchers] = useState(() => localStorage.getItem('nikke_vouchers') || '0');
	const [advancedVouchers, setAdvancedVouchers] = useState(() => localStorage.getItem('nikke_advanced_vouchers') || '0');
	const [totalPulls, setTotalPulls] = useState(0);

	useEffect(() => {
		localStorage.setItem('nikke_gems', gems);
		localStorage.setItem('nikke_vouchers', vouchers);
		localStorage.setItem('nikke_advanced_vouchers', advancedVouchers);
	}, [gems, vouchers, advancedVouchers]);

	useEffect(() => {
		const gemRolls = Math.floor((parseInt(gems, 10) || 0) / 300);
		const advancedVoucherRolls = parseInt(advancedVouchers, 10) || 0;

		setTotalPulls(gemRolls + advancedVoucherRolls);
	}, [gems, advancedVouchers]);

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

	const standardVouchers = parseInt(vouchers, 10) || 0;

	return (
		<GachaLayout
			themeClass="theme-nikke"
			eyebrow="Recruitment"
			title="Goddess of Victory: Nikke"
			lightModeLogoSrc={NikkeLogoLight}
			darkModeLogoSrc={NikkeLogoDark}
		>
			<GachaCard title="Resources" isPrimary>
				<CurrencyInput
					label="Gems"
					iconSrc={GemIcon}
					value={gems}
					onChange={(event) => handleInputChange(event, setGems)}
					onFocus={handleFocus}
				/>
				<DoublePassContainer>
					<CurrencyInput
						label="Standard vouchers"
						iconSrc={VoucherIcon}
						value={vouchers}
						onChange={(event) => handleInputChange(event, setVouchers)}
						onFocus={handleFocus}
						inPassContainer
					/>
					<CurrencyInput
						label="Advanced vouchers"
						iconSrc={AdvancedVoucherIcon}
						value={advancedVouchers}
						onChange={(event) => handleInputChange(event, setAdvancedVouchers)}
						onFocus={handleFocus}
						inPassContainer
						isSpecial
					/>
				</DoublePassContainer>
			</GachaCard>

			<GachaCard title="Result" isResults>
				<ResultBox label="Limited pulls" value={totalPulls} />
				<ResultBox
					label="Standard vouchers"
					value={standardVouchers}
					highlightType="secondary"
				/>
			</GachaCard>
		</GachaLayout>
	);
};

export default NikkePage;
