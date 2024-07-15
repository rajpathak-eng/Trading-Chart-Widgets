import React from 'react';

const Legend = ({ candleSeriesData, candleSeriesColors, currentSymbol, showVolume, formatVolume }) => {
    if (!candleSeriesData || candleSeriesData.length === 0) return null;

    const latestData = candleSeriesData[candleSeriesData.length - 1];
    const { open, close, high, low, volume } = latestData;

    if (open === undefined) return null;

    const legendColor = open < close ? candleSeriesColors.upColor : candleSeriesColors.downColor;
    const absoluteChange = parseFloat(close - open).toFixed(2);
    const percentageChange = parseFloat(((close - open) / open) * 100).toFixed(2);
    const volumeString = showVolume ? `V ${formatVolume(volume)}` : '';

    return (
        <div style={{ color: legendColor }}>
            <strong>
                {currentSymbol} O {open} H {high} L {low} C {close}
                <span className="change">{absoluteChange}</span>
                <span className="changePer">({percentageChange}%)</span>
                <span className="volume">{volumeString}</span>
            </strong>
        </div>
    );
};

export default Legend;
