import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import GbfIcon from '../../assets/gbf/logo-icon.png';
import HsrIcon from '../../assets/hsr/logo-icon.png';
import ZzzIcon from '../../assets/zzz/logo-icon.png';
import NikkeIcon from '../../assets/nikke/logo-icon.webp';
import BaIcon from '../../assets/ba/logo-icon.png';

const numberFromStorage = (key) => parseInt(localStorage.getItem(key), 10) || 0;

const calculators = [
	{
		to: '/gbf',
		code: 'GBF',
		title: 'Granblue Fantasy',
		tone: 'sky',
		icon: GbfIcon,
		getTotal: () => Math.floor(numberFromStorage('gbf_crystals') / 300) + numberFromStorage('gbf_single_tickets') + (numberFromStorage('gbf_ten_tickets') * 10),
	},
	{
		to: '/hsr',
		code: 'HSR',
		title: 'Honkai: Star Rail',
		tone: 'gold',
		icon: HsrIcon,
		getTotal: () => Math.floor((numberFromStorage('hsr_stellar_jades') + numberFromStorage('hsr_oneiric_shards')) / 160) + numberFromStorage('hsr_special_passes'),
	},
	{
		to: '/zzz',
		code: 'ZZZ',
		title: 'Zenless Zone Zero',
		tone: 'amber',
		icon: ZzzIcon,
		getTotal: () => Math.floor((numberFromStorage('zzz_polychromes') + numberFromStorage('zzz_monochromes')) / 160) + numberFromStorage('zzz_encrypted_tapes'),
	},
	{
		to: '/nikke',
		code: 'NIKKE',
		title: 'Goddess of Victory: Nikke',
		tone: 'red',
		icon: NikkeIcon,
		getTotal: () => Math.floor(numberFromStorage('nikke_gems') / 300) + numberFromStorage('nikke_advanced_vouchers'),
	},
	{
		to: '/ba',
		code: 'BA',
		title: 'Blue Archive',
		tone: 'blue',
		icon: BaIcon,
		getTotal: () => Math.floor(numberFromStorage('ba_pyroxenes') / 120) + numberFromStorage('ba_single_tickets') + (numberFromStorage('ba_ten_tickets') * 10),
	},
];

const HomePage = () => {
	useEffect(() => {
		document.title = 'Gacha Calculator';
	}, []);

	const totalPulls = calculators.reduce((sum, game) => sum + game.getTotal(), 0);

	return (
		<main className="home-page">
			<section className="home-hero" aria-labelledby="home-title">
				<div className="home-hero-copy">
					<p className="home-kicker">Dashboard</p>
					<h1 id="home-title">Gacha Calculator</h1>
				</div>

				<div className="home-status-panel" aria-label="Total stored pulls">
					<span>Total Pulls</span>
					<strong>{totalPulls}</strong>
				</div>
			</section>

			<section className="home-calculator-list" aria-label="Available calculators">
				{calculators.map((game) => (
					<Link key={game.to} to={game.to} className={`home-calculator-link tone-${game.tone}`}>
						<article className="home-calculator-card">
							<div className="home-card-mark">
								<img src={game.icon} alt="" aria-hidden="true" />
							</div>
							<div className="home-card-main">
								<h2>{game.title}</h2>
								<span>{game.code}</span>
							</div>
							<div className="home-card-action" aria-label={`${game.title} total pulls`}>
								<strong>{game.getTotal()}</strong>
								<span>pulls</span>
							</div>
						</article>
					</Link>
				))}
			</section>
		</main>
	);
};

export default HomePage;
