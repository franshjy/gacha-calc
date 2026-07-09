import React, { useEffect, useRef, useState } from 'react';
import './CustomScrollbar.css';

const MIN_THUMB_HEIGHT = 44;
const TRACK_GAP = 8;

const getNavHeight = () => {
	const value = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
	return parseFloat(value) || 68;
};

const getScrollMetrics = () => {
	const root = document.documentElement;
	const navHeight = getNavHeight();
	const viewportHeight = window.innerHeight;
	const scrollHeight = root.scrollHeight;
	const maxScroll = Math.max(scrollHeight - viewportHeight, 0);
	const trackHeight = Math.max(viewportHeight - navHeight - (TRACK_GAP * 2), 0);
	const isScrollable = maxScroll > 1 && trackHeight > MIN_THUMB_HEIGHT;
	const thumbHeight = isScrollable
		? Math.max(MIN_THUMB_HEIGHT, Math.min(trackHeight, (viewportHeight / scrollHeight) * trackHeight))
		: 0;
	const availableTrack = Math.max(trackHeight - thumbHeight, 0);
	const scrollRatio = maxScroll > 0 ? window.scrollY / maxScroll : 0;

	return {
		availableTrack,
		isScrollable,
		maxScroll,
		thumbHeight,
		thumbTop: availableTrack * scrollRatio,
	};
};

const CustomScrollbar = () => {
	const [metrics, setMetrics] = useState(() => ({
		isScrollable: false,
		thumbHeight: 0,
		thumbTop: 0,
	}));
	const metricsRef = useRef(metrics);
	const dragRef = useRef(null);

	useEffect(() => {
		let frameId;
		let resizeObserver;

		const updateMetrics = () => {
			const nextMetrics = getScrollMetrics();
			metricsRef.current = nextMetrics;
			setMetrics(nextMetrics);
		};

		const scheduleUpdate = () => {
			window.cancelAnimationFrame(frameId);
			frameId = window.requestAnimationFrame(updateMetrics);
		};

		scheduleUpdate();
		window.addEventListener('scroll', scheduleUpdate, { passive: true });
		window.addEventListener('resize', scheduleUpdate);

		if ('ResizeObserver' in window) {
			resizeObserver = new ResizeObserver(scheduleUpdate);
			resizeObserver.observe(document.body);
		}

		return () => {
			window.cancelAnimationFrame(frameId);
			window.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
			resizeObserver?.disconnect();
		};
	}, []);

	useEffect(() => {
		const handlePointerMove = (event) => {
			if (!dragRef.current) return;

			const { startScrollY, startY } = dragRef.current;
			const { availableTrack, maxScroll } = metricsRef.current;
			if (availableTrack <= 0 || maxScroll <= 0) return;

			const deltaY = event.clientY - startY;
			const nextScrollY = startScrollY + ((deltaY / availableTrack) * maxScroll);
			window.scrollTo({ top: nextScrollY });
		};

		const handlePointerUp = () => {
			dragRef.current = null;
			document.documentElement.classList.remove('is-dragging-scrollbar');
		};

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('pointercancel', handlePointerUp);

		return () => {
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerup', handlePointerUp);
			window.removeEventListener('pointercancel', handlePointerUp);
		};
	}, []);

	const handlePointerDown = (event) => {
		event.preventDefault();
		dragRef.current = {
			startScrollY: window.scrollY,
			startY: event.clientY,
		};
		document.documentElement.classList.add('is-dragging-scrollbar');
	};

	return (
		<div className={`custom-scrollbar ${metrics.isScrollable ? 'is-scrollable' : ''}`} aria-hidden="true">
			<div className="custom-scrollbar-track">
				<div
					className="custom-scrollbar-thumb"
					onPointerDown={handlePointerDown}
					style={{
						height: `${metrics.thumbHeight}px`,
						transform: `translateY(${metrics.thumbTop}px)`,
					}}
				/>
			</div>
		</div>
	);
};

export default CustomScrollbar;
