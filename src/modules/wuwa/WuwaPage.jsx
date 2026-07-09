import React, { useEffect } from 'react';
import './WuwaPage.css';

const WuwaPage = () => {
	useEffect(() => {
		document.title = "Wuthering Waves";

		return () => {
			document.title = "Gacha Calculator";
		};
	}, []);

	return <main className="wuwa-page" aria-label="Wuthering Waves calculator" />;
};

export default WuwaPage; 
