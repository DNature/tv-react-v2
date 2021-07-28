import React from 'react';
import './App.css';
// import ChartContainer from './components/ChartContainer';
import ChartContainer from './components/TVChartContainer';

function App() {
	return (
		<div className='App'>
			<header className='App-header'>
				<h1>TradingView Chart</h1>
			</header>
			<div className='tv-wrapper'>
				<ChartContainer symbol='BTCUSDT' theme={'Dark'} locale='en' autosize />
			</div>
			<footer>
				Made with 💜 by{' '}
				<a
					href='https://twitter.com/DivineHycenth'
					target='_blank'
					rel='noopener noreferrer'
				>
					Divine Hycenth
				</a>
			</footer>
		</div>
	);
}

export default App;
