import { createChart, ColorType } from 'lightweight-charts';
import React, { useState, useEffect, useRef } from 'react';
import { CiSearch } from "react-icons/ci";
import { MdOutlineCameraAlt } from "react-icons/md";
import { PiLineVerticalLight } from "react-icons/pi";
import { BiCandles } from "react-icons/bi";
import { CgLoadbarSound } from "react-icons/cg";
import { FaChartArea } from "react-icons/fa";
import { RiSupabaseLine } from "react-icons/ri";
import { FaChartLine } from "react-icons/fa6";
import {
    Select,
    Option,
    Checkbox,
    Input,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    List,
    ListItem,
    Typography,
    Textarea
} from "@material-tailwind/react";

import useWebSocket, { ReadyState } from 'react-use-websocket';

export const ChartComponent = props => {
    const {
        data,
        formData,
        commodities,
        handleSymbolChange,
        handleIntervalChange,
        fetchHistoricalData,
        isLoading
    } = props;
    let { theme, chartWidth, chartHeight, symbol, chartType, chartInterval, showToolbar, allowSymbolChange, showSymbolDescription, showVolume, imageButton } = formData;

    const [changeChartType, setChangeChartType] = useState(chartType);
    const [currentInterval, setCurrentInterval] = useState(chartInterval);
    const [currentSymbol, setCurrentSymbol] = useState(symbol);
    const [latestData, setLatestData] = useState(data);
    const [realTimeData, setRealTimeData] = useState({ change: 0.00, changesPercentage: 0.00, volume: 0.00 });

    const [chartSeries, setChartSeries] = useState(null);
    const [currentTime, setCurrenTime] = useState('');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const apiKey = 'Xa5wxoEJZlUCRsI1eyyINxAQJ6QEiANY';
    const startDate = '2000-01-01';
    const endDate = formattedDate;

    useEffect(() => {
        setChangeChartType(chartType);
    }, [chartType]);

    useEffect(() => {
        setCurrentInterval(chartInterval);
    }, [chartInterval]);


    useEffect(() => {
        setCurrentSymbol(symbol);
    }, [symbol]);


    const backgroundColor = theme === 'light' ? 'white' : '#161a25'; // Adjust colors as needed
    const textColor = theme === 'light' ? 'black' : 'white'; // Adjust colors as needed
    const lineColor = '#2962FF';
    const candleUpColor = theme === 'light' ? '#089981' : '#0F9960'; // Adjust colors as needed
    const candleDownColor = theme === 'light' ? '#f23645' : '#CF1124'; // Adjust colors as needed
    const wickUpColor = theme === 'light' ? '#4CAF50' : '#34D399'; // Adjust colors as needed
    const wickDownColor = theme === 'light' ? '#FF5722' : '#EF4444'; // Adjust colors as needed
    const gridColor = theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    const legendColor = theme === 'light' ? 'black' : 'white';
    const chartContainerRef = useRef();

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);
    let chart = null;

    const chartSeriesRef = useRef(null);
    const chartLegendRef = useRef(null);
    const [chartData, setChartData] = useState(data);
    const [chartTimeline, setChartTimeline] = useState([]);
    const currentCandle = useRef(null);


    useEffect(
        () => {

            function formatTimestamp(businessDayOrTimestamp) {
                let date;
                // Check if the input is a number (UNIX timestamp in seconds)
                if (typeof businessDayOrTimestamp === 'number') {
                    date = new Date(businessDayOrTimestamp * 1000); // Convert to milliseconds
                } else {
                    date = new Date(businessDayOrTimestamp);
                }

                if (isNaN(date.getTime())) {
                    throw new Error('Invalid date or timestamp');
                }

                const day = date.getUTCDate(); // Get the day component in UTC time
                const month = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
                const year = date.getUTCFullYear() % 100; // Get the year component in UTC time
                const hours = String(date.getUTCHours()).padStart(2, '0'); // Get the hours component in UTC time
                const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Get the minutes component in UTC time

                return;
            }

            chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                rightPriceScale: {
                    borderVisible: false,
                },
                timeScale: {
                    borderVisible: false,
                    timeVisible: true,
                },
                grid: {
                    vertLines: {
                        color: gridColor, // Set the color of vertical grid lines
                    },
                    horzLines: {
                        color: gridColor, // Set the color of horizontal grid lines
                    },
                },
                width: chartWidth,//chartContainerRef.current.clientWidth,
                height: chartHeight,
                localization: {
                    // timeFormatter: businessDayOrTimestamp => {
                    //     // return formatTimestamp(businessDayOrTimestamp); //or whatever JS formatting you want here
                    // },
                },
            });
            const handleResize = () => {
                const width = chartContainerRef.current.clientWidth;

                const chartContainer = document.querySelector('.mainChart');
                chart.applyOptions({ width: window.innerWidth - 20 });
            };
            setCurrenTime(data[0]);
            // chart.timeScale().fitContent();
            const areaSeriesData = data.map((entry, index) => ({
                time: entry.time,
                value: (entry.open + entry.high + entry.low + entry.close) / 4,
            }));
            const candleSeriesData = data.map((entry, index) => ({
                time: entry.time,
                open: entry.open,
                high: entry.high,
                low: entry.low,
                close: entry.close,
                volume: entry.volume
            }));

            const areaSeries = chart.addAreaSeries({ lineColor: '#2962FF', topColor: '#2962FF', bottomColor: 'rgba(41, 98, 255, 0.28)' });

            const barSeries = chart.addBarSeries({ upColor: '#26a69a', downColor: '#ef5350' });

            const baselineSeries = chart.addBaselineSeries({ baseValue: { type: 'price', price: 25 }, topLineColor: 'rgba( 38, 166, 154, 1)', topFillColor1: 'rgba( 38, 166, 154, 0.28)', topFillColor2: 'rgba( 38, 166, 154, 0.05)', bottomLineColor: 'rgba( 239, 83, 80, 1)', bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', bottomFillColor2: 'rgba( 239, 83, 80, 0.28)' });

            const lineSeries = chart.addLineSeries({ color: '#2962FF' });

            const candleSeries = chart.addCandlestickSeries({
                upColor: candleUpColor,
                borderUpColor: candleUpColor,
                wickUpColor,
                downColor: candleDownColor,
                borderDownColor: candleDownColor,
                wickDownColor,
            });

            let legendSeries = null;

            if (currentInterval == '1min') {

            }


            switch (parseInt(changeChartType)) {
                case 1:
                    areaSeries.setData(areaSeriesData);
                    chartSeriesRef.current = areaSeries;
                    areaSeries.priceScale().applyOptions({
                        scaleMargins: {
                            top: 0.1, // highest point of the series will be 10% away from the top
                            bottom: 0.2, // lowest point will be 40% away from the bottom
                        },
                    });
                    legendSeries = areaSeries;
                    break;
                case 2:
                    barSeries.setData(candleSeriesData);
                    chartSeriesRef.current = barSeries;

                    barSeries.priceScale().applyOptions({
                        scaleMargins: {
                            top: 0.1, // highest point of the series will be 10% away from the top
                            bottom: 0.2, // lowest point will be 40% away from the bottom
                        },
                    });
                    legendSeries = barSeries;
                    break;
                case 3:
                    baselineSeries.setData(areaSeriesData);
                    chartSeriesRef.current = baselineSeries;

                    baselineSeries.priceScale().applyOptions({
                        scaleMargins: {
                            top: 0.1, // highest point of the series will be 10% away from the top
                            bottom: 0.2, // lowest point will be 40% away from the bottom
                        },
                    });
                    legendSeries = baselineSeries;
                    break;
                case 4:
                    candleSeries.setData(candleSeriesData);

                    chartSeriesRef.current = candleSeries;
                    candleSeries.priceScale().applyOptions({
                        scaleMargins: {
                            top: 0.1, // highest point of the series will be 10% away from the top
                            bottom: 0.2, // lowest point will be 40% away from the bottom
                        }
                    });
                    legendSeries = candleSeries;
                    break;
                case 5:
                    lineSeries.setData(areaSeriesData);
                    chartSeriesRef.current = lineSeries;


                    lineSeries.priceScale().applyOptions({
                        scaleMargins: {
                            top: 0.1, // highest point of the series will be 10% away from the top
                            bottom: 0.2, // lowest point will be 40% away from the bottom
                        },
                    });
                    legendSeries = lineSeries;
                    break;
                default:
                    break;
            }
            let isUpdated = false;
            // Add histogram series
            const volumeSeries = chart.addHistogramSeries({
                lineWidth: 2,
                priceFormat: {
                    type: 'volume',
                },
                overlay: true,
                priceScaleId: '', // set as an overlay by setting a blank priceScaleId
            });
            volumeSeries.priceScale().applyOptions({
                // set the positioning of the volume series
                scaleMargins: {
                    top: 0.7, // highest point of the series will be 70% away from the top
                    bottom: 0,
                },
            });

            const candleSeriesColors = {
                upColor: candleSeries.options().upColor,
                downColor: candleSeries.options().downColor,
                borderUpColor: candleSeries.options().borderUpColor,
                borderDownColor: candleSeries.options().borderDownColor,
                wickUpColor: candleSeries.options().wickUpColor,
                wickDownColor: candleSeries.options().wickDownColor,
            };

            const histogramSeries = data.map((entry, index) => ({
                time: entry.time,
                value: entry.volume,
                color: entry.open < entry.close ? `${candleSeriesColors.upColor}80` : `${candleSeriesColors.downColor}80`
            }));

            (showVolume && volumeSeries.setData(histogramSeries));

            // chart.timeScale().setVisibleRange({
            //   from: (new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0))).getTime() / 1000,
            //   to: (new Date(Date.UTC(2024, 5, 1, 0, 0, 0, 0))).getTime() / 1000,
            // });

            const container = chartContainerRef.current;
            const legend = document.createElement('div');

            legend.style = `background: ${backgroundColor}; position: absolute; left: 12px; top: 1rem; z-index: 1; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`;
            container.appendChild(legend);

            // const cachedData = localStorage.getItem('initialData');
            let volumeData = data;

            // if (cachedData) {
            //     volumeData = JSON.parse(cachedData);
            // }

            const firstRow = document.createElement('div');
            let openPrice = candleSeriesData[candleSeriesData.length - 1]?.open;
            let closePrice = candleSeriesData[candleSeriesData.length - 1]?.close;
            let highPrice = candleSeriesData[candleSeriesData.length - 1]?.high;
            let lowPrice = candleSeriesData[candleSeriesData.length - 1]?.low;
            let volume = candleSeriesData[candleSeriesData.length - 1]?.volume;
            // console.log(candleSeriesData)
            const legendColor = openPrice < closePrice ? candleSeriesColors.upColor : candleSeriesColors.downColor;

            if (openPrice != undefined) {
                let absoluteChange = parseFloat(closePrice - openPrice).toFixed(2);
                let percentageChange = parseFloat(((closePrice - openPrice) / openPrice) * 100).toFixed(2);

                let volumeString = showVolume ? `V ${formatVolume(realTimeData?.volume)}` : '';

                firstRow.innerHTML = `<strong style="color: ${legendColor}">${currentSymbol} O ${openPrice} H ${highPrice} L ${lowPrice} C ${closePrice} <span class="change">${realTimeData?.change}</span> <span class="changePer">(${parseFloat(realTimeData?.changesPercentage)?.toFixed(2)}%)</span> <span class="volume">${volumeString}</span></strong>`;

                firstRow.style.color = openPrice < closePrice ? candleSeriesColors.upColor : candleSeriesColors.downColor;
                legend.appendChild(firstRow);


            }

            let previousValue = 0;
            // console.log(volumeData)
            chart.subscribeCrosshairMove(param => {
                if (param.time) {
                    let absoluteChange = null;
                    let percentageChange = null;
                    let filterChange = volumeData.find(obj => obj.time === param?.time);
                    // console.log(filterChange)
                    let change = parseFloat(filterChange?.change).toFixed(2);
                    let changePercentage = parseFloat(filterChange?.changePercent).toFixed(2);

                    let data = param.seriesData.get(legendSeries);
                    if (parseInt(changeChartType) === 2 || parseInt(changeChartType) === 4) {

                        openPrice = parseFloat(data?.open).toFixed(2);
                        closePrice = parseFloat(data?.close).toFixed(2);
                        highPrice = parseFloat(data?.high).toFixed(2);
                        lowPrice = parseFloat(data?.low).toFixed(2);

                        // legendColor = openPrice < closePrice ? candleSeriesColors.upColor : candleSeriesColors.downColor;
                        const legendColor = openPrice < closePrice ? candleSeriesColors.upColor : candleSeriesColors.downColor;

                        let filterVolume = volumeData.find(obj => obj.time === data?.time);

                        volume = parseFloat(filterVolume?.volume).toFixed(2);

                        let volumeString = showVolume ? `V ${formatVolume(volume)}` : '';

                        absoluteChange = parseFloat(closePrice - openPrice).toFixed(2);
                        percentageChange = parseFloat(((closePrice - openPrice) / openPrice) * 100).toFixed(2);

                        firstRow.innerHTML = `<strong style="color: ${legendColor}">${currentSymbol} O ${openPrice} H ${highPrice} L ${lowPrice} C ${closePrice} ${absoluteChange} (${percentageChange}%) ${volumeString}</strong>`;
                    } else {

                        let filterVolume = volumeData.find(obj => obj.time === data?.time);

                        volume = parseFloat(filterVolume?.volume).toFixed(2);

                        let volumeString = showVolume ? `V ${formatVolume(volume)}` : '';

                        const legendColor = change > 0 ? candleSeriesColors.upColor : candleSeriesColors.downColor;

                        absoluteChange = parseFloat(data?.value - previousValue).toFixed(2);
                        percentageChange = previousValue !== null ? parseFloat(((data?.value - previousValue) / previousValue) * 100).toFixed(2) : 0;

                        firstRow.innerHTML = ` <strong style="color: ${legendColor}">${currentSymbol} ${parseFloat(data?.value).toFixed(2)} ${absoluteChange} (${percentageChange}%) ${volumeString}</strong>`;

                    }
                    previousValue = data?.value;

                }

            });

            if (showSymbolDescription == false) {
                legend.remove();
            }

            // chart.timeScale().applyOptions({
            //     barSpacing: 30,
            // });

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                // clearInterval(intervalId);
                chart.remove();
            };
        },
        [isLoading, data, changeChartType, backgroundColor, lineColor, textColor, candleUpColor, candleDownColor, wickUpColor, wickDownColor, currentSymbol, chartInterval, currentInterval, realTimeData]
    );

    const formatVolume = (volume) => {
        const numVolume = parseFloat(volume);
        if (numVolume >= 1e6) {
            return (numVolume / 1e6).toFixed(2) + 'm';
        } else if (numVolume >= 1e3) {
            return (numVolume / 1e3).toFixed(2) + 'k';
        } else {
            return numVolume.toString();
        }
    };


    function toUnixTimestamp(dateString) {
        const date = new Date(dateString);
        return Math.floor(date.getTime() / 1000);
    }

    async function isMarketOpen() {
        const url = `https://financialmodelingprep.com/api/v3/is-the-market-open?apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log(data.isTheForexMarketOpen)
            return data.isTheForexMarketOpen;
        } catch (error) {
            console.error('Error fetching market status:', error);
            return false;
        }
    }


    async function fetchRealTimeData() {
        // const url = `https://financialmodelingprep.com/api/v3/otc/real-time-price/${symbol}?apikey=${apiKey}`;
        const url = `https://financialmodelingprep.com/api/v3/quote/GCUSD?apikey=${apiKey}`;
        // const url = `https://financialmodelingprep.com/api/v3/historical-chart/1min/${currentSymbol}?from=${startDate}&to=${endDate}&apikey=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        return data;

    }

    const previousTimestampRef = useRef(null);

    useEffect(() => {

        let intervalId;

        if (currentInterval === '1min' || currentInterval === '1day') {
            intervalId = setInterval(async () => {
                try {
                    const url = `https://financialmodelingprep.com/api/v3/historical-chart/${currentInterval}/${currentSymbol}?from=${startDate}&to=${endDate}&apikey=${apiKey}`;

                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();

                    const currentData = data[0];

                    const currentTimestamp = toUnixTimestamp(currentData.date);
                    const previousTimestamp = previousTimestampRef.current;

                    let updatingData = null;
                    let latestData = null;

                    if (changeChartType == 2 || changeChartType == 4) {
                        updatingData = {
                            time: currentTimestamp,
                            open: currentData.open + parseFloat(Math.random().toFixed(2)),
                            high: currentData.high + parseFloat(Math.random().toFixed(2)),
                            low: currentData.low - parseFloat(Math.random().toFixed(2)),
                            close: currentData.close + parseFloat(Math.random().toFixed(2)),
                            volume: currentData.volume,
                        };

                        latestData = {
                            time: currentTimestamp,
                            open: currentData.open,
                            high: currentData.high,
                            low: currentData.low,
                            close: currentData.close,
                            volume: currentData.volume,
                        };
                    } else {
                        updatingData = {
                            time: currentTimestamp,
                            value: (currentData.open + currentData.high + currentData.low + currentData.close) / 4,
                        };
                        latestData = {
                            time: currentTimestamp,
                            value: (currentData.open + currentData.high + currentData.low + currentData.close) / 4,

                        };
                    }
                    if (previousTimestamp !== null && currentTimestamp === previousTimestamp + 60) {
                        chartSeriesRef.current.update(latestData);
                    } else {
                        // latestData.close = realData.price;
                        chartSeriesRef.current.update(updatingData);
                    }

                    // Update the previous timestamp
                    previousTimestampRef.current = currentTimestamp;

                } catch (error) {
                    console.error('Error fetching real-time data:', error);
                }
            }, 5000);
        }


        return () => clearInterval(intervalId);
    }, [currentInterval, currentSymbol, changeChartType]);

    useEffect(() => {

        const intervalId = setInterval(async () => {

            const marketStatus = await isMarketOpen();

            const realData = await fetchRealTimeData();

            setRealTimeData(realData[0]);
            // chartLegendRef.current = realData[0];

            if (!marketStatus) {
                clearInterval(intervalId);
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);


    const handleClick = (symbol) => {
        // Call the parent function with the symbol
        setCurrentSymbol(symbol);
        handleSymbolChange(symbol);
    }

    const handleChartIntervalChange = (interval) => {
        setCurrentInterval(interval);
        handleIntervalChange(interval);
    }

    const downloadImage = () => {
        const canvas = chartContainerRef.current.querySelector('canvas');
        const dataUrl = canvas.toDataURL();

        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = 'chart.png'; // Set a filename for the downloaded image
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }


    return (
        <>
            <div className={`trading__chart ${isLoading ? 'loading' : ''}`}>
                {showToolbar && (<div className="flex items-center relative" style={{
                    backgroundColor: theme === 'light' ? 'white' : '#131722',
                    width: '100%',
                    height: 38,
                    position: 'relative',
                    paddingLeft: 12,
                    borderBottom: `1px solid ${gridColor}`,
                    color: textColor,
                }}>
                    <div className={`currency__search flex items-center hover:bg-blue-gray-500 p-1 m-1 rounded-sm ${allowSymbolChange ? 'cursor-pointer' : 'cursor-not-allowed'}`} onClick={() => {
                        if (allowSymbolChange) {
                            handleOpen();
                        }
                    }}>
                        <CiSearch className="mr-1" size={20} />
                        {currentSymbol}
                    </div>
                    {/* <MdKeyboardArrowDown size={25} className="hover:bg-blue-50 p-1 m-1 rounded-sm" /> */}
                    {/* <PiLineVerticalLight /> */}

                    {/* <div className="chart__interval w-1 flex items-center p-1 m-1 rounded-sm relative">
                    <Select value={changeChartType} onChange={(val) => setChangeChartType(val)} size="md" variant="static" className='flex items-end change__chart'>
                        <Option className="flex items-center" value="1">1 week</Option>
                        <Option className="flex items-center" value="2">1 month</Option>
                    </Select>
                </div> */}
                    <PiLineVerticalLight className='top__el__hide' />
                    <div className="chart__type w-1 flex items-center p-1 m-1 rounded-sm relative top__el__hide">
                        <Select value={changeChartType} onChange={(val) => setChangeChartType(val)} size="md" variant="static" className='flex items-end change__chart'>
                            <Option className="flex items-center" value="1"><FaChartArea className='mr-1' size={20} /> Area</Option>
                            <Option className="flex items-center" value="2"><CgLoadbarSound className='mr-1' size={20} /> Bar</Option>
                            <Option className="flex items-center" value="3"><RiSupabaseLine className='mr-1' size={20} /> Baseline</Option>
                            <Option className="flex items-center" value="4"><BiCandles className='mr-1' size={20} />
                                Candlestick</Option>
                            <Option className="flex items-center" value="5"><FaChartLine className='mr-1' size={20} /> Line</Option>
                        </Select>
                    </div>
                    <PiLineVerticalLight />
                    <div className="chart__interval w-1 flex items-center p-1 m-1 rounded-sm relative">
                        <Select value={currentInterval} onChange={(val) => handleChartIntervalChange(val)} size="md" variant="static" className='flex items-end change__chart'>
                            <Option className="flex items-center" value="1min">1m</Option>
                            <Option className="flex items-center" value="30min">30m</Option>
                            <Option className="flex items-center" value="1hour">1h</Option>
                            <Option className="flex items-center" value="1day">1 day</Option>
                            <Option className="flex items-center" value="1week">1 week</Option>
                            <Option className="flex items-center" value="1month">1 month</Option>
                        </Select>
                    </div>
                    {
                        imageButton && (
                            <MdOutlineCameraAlt onClick={downloadImage} className="absolute right-0 mr-5 cursor-pointer" size={20} />
                        )
                    }

                </div >
                )}
                <div className="chart-container relative">
                    <div
                        className='relative mainChart'
                        ref={chartContainerRef}
                    />
                    {isLoading && <div className="loader"></div>}
                </div>

                {/* modal */}
                <Dialog open={open} handler={handleOpen} size="md">
                    <div className="flex items-center justify-between">
                        <DialogHeader className="flex flex-col items-start">Symbols</DialogHeader>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="mr-3 h-5 w-5"
                            onClick={handleOpen}
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <DialogBody className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                        <List>
                            {commodities.map((commodity, index) => (
                                <ListItem key={index} value={commodity.symbol} onClick={() => { handleClick(commodity.symbol); handleOpen(); }}>{commodity.name}</ListItem>
                            ))}
                        </List>
                    </DialogBody>
                </Dialog>
            </div>
        </>
    );
};