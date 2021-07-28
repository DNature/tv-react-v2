import React from 'react';

export const BarStyles = {
	BARS: '0',
	CANDLES: '1',
	HOLLOW_CANDLES: '9',
	HEIKIN_ASHI: '8',
	LINE: '2',
	AREA: '3',
	RENKO: '4',
	LINE_BREAK: '7',
	KAGI: '5',
	POINT_AND_FIGURE: '6',
};

export const IntervalTypes = {
	D: 'D',
	W: 'W',
};

export const RangeTypes = {
	ytd: 'ytd',
	all: 'all',
};

type IRangeTypes = keyof typeof RangeTypes;

export const Themes = {
	Light: 'Light',
	Dark: 'Dark',
};

type IThemes = keyof typeof Themes;

const SCRIPT_ID = 'tradingview-widget-script';
const CONTAINER_ID = 'tradingview-widget';

type Strings = '1' | '3' | '5' | '15' | '30' | '60' | '120' | '180';
type Numbers = 1 | 3 | 5 | 15 | 30 | 60 | 120 | 180;
type IIntervalTypes = keyof typeof IntervalTypes | Strings | Numbers;

interface TVChartProps {
	allow_symbol_change?: boolean;
	autosize?: boolean;
	calendar?: boolean;
	details?: boolean;
	enable_publishing?: boolean;
	height?: number;
	hideideas?: boolean;
	hide_legend?: boolean;
	hide_side_toolbar?: boolean;
	hide_top_toolbar?: boolean;
	hotlist?: boolean;
	interval?: IIntervalTypes;
	locale?: string;
	news?: string[];
	no_referral_id?: boolean;
	popup_height?: string | number;
	popup_width?: string | number;
	range?: '1d' | '5d' | '1m' | '3m' | '6m' | IRangeTypes | '12m';
	referral_id?: string;
	save_image?: boolean;
	show_popup_button?: boolean;
	studies?: string[];
	style?: string;
	symbol: string;
	theme?: IThemes;
	timezone?: string;
	toolbar_bg?: string;
	watchlist?: string;
	widgetType?: string;
	width?: number;
	withdateranges?: boolean;
}

const TVChartContainer: React.FC<TVChartProps> = (props) => {
	// const containerId = `${CONTAINER_ID}-${Math.random()}`;
	const containerId = CONTAINER_ID;
	let TV = (window as any).TradingView || undefined;

	const canUseDOM = () =>
		!!(
			typeof window !== 'undefined' &&
			window.document &&
			window.document.createElement
		);

	const getScriptElement = () => document.getElementById(SCRIPT_ID);

	const getStyle = () => {
		if (!props.autosize) return {};
		return {
			width: '100%',
			height: '100%',
		};
	};

	React.useEffect(() => {
		const scriptExists = () => getScriptElement() !== null;
		const updateOnloadListener = (onload: Function) => {
			const script = getScriptElement();
			if (script) {
				const oldOnload = script.onload;

				return (script.onload = () => {
					// @ts-ignore
					oldOnload();
					onload();
				});
			}
		};
		const appendScript = (
			onload: ((_this?: GlobalEventHandlers, ev?: Event) => any) | null
		) => {
			if (!canUseDOM()) {
				onload?.();
				return;
			}

			if (scriptExists()) {
				if (typeof TV === 'undefined') {
					updateOnloadListener(onload?.()); // TODO: check this
					return;
				}
				onload?.();
				return;
			}

			const script = document.createElement('script');
			script.id = SCRIPT_ID;
			script.type = 'text/javascript';
			script.async = true;
			script.src = 'https://s3.tradingview.com/tv.js';
			script.onload = onload?.();
			document.getElementsByTagName('head')[0].appendChild(script);
		};

		const initWidget = () => {
			if (typeof TV === 'undefined' || !document.getElementById(containerId))
				return;

			const { widgetType, ...widgetConfig } = props;
			const config = { ...widgetConfig, container_id: containerId };

			if (config.autosize) {
				delete config.width;
				delete config.height;
			}

			if (typeof config.interval === 'number') {
				config.interval = String(config.interval) as IIntervalTypes;
			}

			if (config.popup_width && typeof config.popup_width === 'number') {
				config.popup_width = String(config.popup_width);
			}

			if (config.popup_height && typeof config.popup_height === 'number') {
				config.popup_height = String(config.popup_height);
			}
			new (window as any).TradingView[widgetType as any](config);
		};
		appendScript(initWidget);

		// TODO: Clean up

		return () => {
			if (canUseDOM()) {
				const container = document.getElementById(containerId);
				if (container) {
					container.innerHTML = '';
				}
			}
		};
	}, [TV, containerId, props]);

	return <main id={containerId} style={getStyle()} />;
};

TVChartContainer.defaultProps = {
	allow_symbol_change: true,
	autosize: false,
	enable_publishing: false,
	height: 610, // TODO:,
	hideideas: true,
	hide_legend: false,
	hide_side_toolbar: false,
	hide_top_toolbar: false,
	interval: IntervalTypes.D as IIntervalTypes,
	locale: 'en',
	save_image: true,
	show_popup_button: true,
	style: BarStyles.CANDLES,
	theme: Themes.Light as IThemes,
	// timezone: 'Etc/UTC',
	timezone: 'WAT',
	toolbar_bg: '',
	widgetType: 'widget',
	width: 980,
	withdateranges: true,
};

export default TVChartContainer;
