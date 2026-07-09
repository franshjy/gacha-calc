import { render, screen } from '@testing-library/react';
import Navigation from './components/Navigation';
import Drawer from './components/Drawer';
import HomePage from './modules/home/HomePage';
import GbfPage from './modules/gbf/GbfPage';
import HsrPage from './modules/hsr/HsrPage';
import WuwaPage from './modules/wuwa/WuwaPage';

jest.mock('react-router-dom', () => ({
	Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
	NavLink: ({ to, children, className, end, ...props }) => (
		<a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className} {...props}>
			{children}
		</a>
	),
}), { virtual: true });

beforeEach(() => {
	localStorage.clear();
});

test('navigation exposes a readable dark mode toggle label', () => {
	render(
		<Navigation
			theme="light"
			toggleTheme={() => {}}
			setIsDrawerOpen={() => {}}
			getNavLinkClass={() => ''}
			navLinks={[{ to: '/', label: 'Home' }]}
		/>
	);

	expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
});

test('drawer exposes a readable close control and theme label', () => {
	render(
		<Drawer
			isOpen
			onClose={() => {}}
			theme="light"
			onThemeToggle={() => {}}
		/>
	);

	expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
});

test('hsr page shows the 5-star guarantee label with readable text', () => {
	render(<HsrPage />);

	expect(screen.getByText(/5-star guarantees/i)).toBeInTheDocument();
});

test('home page only promotes implemented calculators', () => {
	render(<HomePage />);

	expect(screen.getByText(/granblue fantasy/i)).toBeInTheDocument();
	expect(screen.queryByRole('link', { name: /wuthering waves/i })).not.toBeInTheDocument();
});

test('home dashboard shows stored total pulls for every implemented game', () => {
	localStorage.setItem('gbf_crystals', '900');
	localStorage.setItem('gbf_single_tickets', '2');
	localStorage.setItem('gbf_ten_tickets', '1');
	localStorage.setItem('hsr_stellar_jades', '320');
	localStorage.setItem('hsr_oneiric_shards', '160');
	localStorage.setItem('hsr_special_passes', '4');
	localStorage.setItem('zzz_polychromes', '160');
	localStorage.setItem('zzz_monochromes', '160');
	localStorage.setItem('zzz_encrypted_tapes', '3');
	localStorage.setItem('nikke_gems', '900');
	localStorage.setItem('nikke_advanced_vouchers', '5');
	localStorage.setItem('ba_pyroxenes', '240');
	localStorage.setItem('ba_single_tickets', '1');
	localStorage.setItem('ba_ten_tickets', '2');

	render(<HomePage />);

	expect(screen.getByLabelText('Granblue Fantasy total pulls')).toHaveTextContent('15');
	expect(screen.getByLabelText('Honkai: Star Rail total pulls')).toHaveTextContent('7');
	expect(screen.getByLabelText('Zenless Zone Zero total pulls')).toHaveTextContent('5');
	expect(screen.getByLabelText('Goddess of Victory: Nikke total pulls')).toHaveTextContent('8');
	expect(screen.getByLabelText('Blue Archive total pulls')).toHaveTextContent('23');
});

test('home dashboard uses rounded game icons', () => {
	const { container } = render(<HomePage />);

	expect(container.querySelectorAll('.home-card-mark img')).toHaveLength(5);
});

test('calculator pages keep copy minimal', () => {
	render(<HsrPage />);

	expect(screen.queryByText(/manifest focused/i)).not.toBeInTheDocument();
	expect(screen.queryByText(/converted at/i)).not.toBeInTheDocument();
	expect(screen.queryByText(/^rate$/i)).not.toBeInTheDocument();
	expect(screen.queryByText(/^cycle$/i)).not.toBeInTheDocument();
	expect(screen.queryByText(/^target$/i)).not.toBeInTheDocument();
});

test('spark progress shows current pulls over spark target', () => {
	localStorage.setItem('gbf_crystals', '27000');

	render(<GbfPage />);

	expect(screen.getByText('90/300')).toBeInTheDocument();
	expect(screen.queryByText(/210 remaining/i)).not.toBeInTheDocument();
});

test('wuwa page is intentionally empty while calculator support is absent', () => {
	const { container } = render(<WuwaPage />);

	expect(container.textContent).toBe('');
});
