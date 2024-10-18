import { CSSProperties } from 'react';

export function Dot({ color }: { color: string }) {
	const styles: CSSProperties = {
		width: '25px',
		height: '25px',
		margin: '0px 10px',
		background: color,
		borderRadius: '50%',
		display: 'inline-block',
	};
	return <span style={styles}></span>;
}
