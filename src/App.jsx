import { createChart, ColorType } from 'lightweight-charts';
import React, { useState, useEffect, useRef } from 'react';
import { ChartComponent } from './components/Chart';
import ChartWidget from './components/ChartWidget';

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
import { GoPencil } from "react-icons/go";

export function App(props) {
  const [isLoading, setIsLoading] = useState(false);

  let deviceWidth = window.innerWidth;
  let chartInitWidth = 980;
  let chartInitHeight = 610;

  if (deviceWidth < 980) {
    chartInitWidth = window.innerWidth;
    chartInitHeight = 400;
  }

  const [defaultData, setDefaultData] = useState({
    symbol: 'GCUSD',
    autoSize: true,
    chartWidth: chartInitWidth,
    chartHeight: chartInitHeight,
    chartInterval: '1day',
    theme: 'light',
    chartType: '4',
    showToolbar: true,
    showVolume: true,
    allowSymbolChange: true,
    showSymbolDescription: true,
    imageButton: true,
  });



  const [formData, setFormData] = useState(defaultData);

  const [widget, setWidget] = useState(false);

  const [initialData, setInitialData] = useState([]);

  const [commodities, setCommodities] = useState([]);
  const [symbol, setSymbol] = useState('GCUSD');

  const [chartType, setChartType] = useState("4");

  const [chartWidth, setChartWidth] = useState(defaultData.chartWidth);
  const [chartHeight, setChartHeight] = useState(defaultData.chartHeight);

  const [theme, setTheme] = useState('light');

  const [open, setOpen] = useState(false);

  const [chartInterval, setChartInterval] = useState('1day');
  const [autoSize, setAutoSize] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [allowSymbolChange, setAllowSymbolChange] = useState(true);
  const [showSymbolDescription, setShowSymbolDescription] = useState(true);
  const [imageButton, setImageButton] = useState(true);

  useEffect(() => {
    const rootElement = document.getElementById('root');
    const dataAttribute = rootElement.getAttribute('data');
    // console.log(dataAttribute)
    if (dataAttribute) {
      setWidget(true);
      try {
        const parsedData = JSON.parse(dataAttribute);

        const renamedData = {
          ...parsedData,
          imageButton: parsedData.save_image, // Add new key with the value of 'symbol'
          chartInterval: parsedData.interval
        };
        setSymbol(parsedData.symbol);
        setChartInterval(parsedData.interval)
        setFormData(prevData => ({
          ...prevData,
          ...renamedData
        }));
      } catch (error) {
        console.error('Failed to parse data attribute:', error);
      }
    }
  }, []);
  const handleOpen = () => setOpen(!open);

  const chartEl = document.getElementById("chart");

  async function fetchHistoricalData(apiKey, symbol, interval, startDate, endDate) {
    const url = `https://financialmodelingprep.com/api/v3/historical-chart/${interval}/${symbol}?from=${startDate}&to=${endDate}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const series = mapAndSortData(data ? data : []);
      setInitialData(series);
      localStorage.setItem('initialData', JSON.stringify(series));
      setIsLoading(false);
      // console.log(series)
      // return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const apiKey = 'Xa5wxoEJZlUCRsI1eyyINxAQJ6QEiANY';
  const startDate = '2000-01-01';
  const endDate = formattedDate;


  useEffect(() => {
    setIsLoading(true);
    // Check if data is stored in localStorage
    const cachedData = localStorage.getItem('initialData');
    const localSymbol = localStorage.getItem('symbol');
    // const checkDate = (todayDate > series[series.length - 1].time);
    // console.log(cachedData)
    // Fetch data from API
    fetch(`https://auronum.co.uk/wp-json/bk-chart/v1/symbols`)
      .then(response => response.json())
      .then(data => {
        // Extract commodity symbols from the response
        const commodityList = data.map(commodity => ({
          name: commodity.name,
          symbol: commodity.symbol
        }));
        // Set the fetched commodities in statecandke
        setCommodities(commodityList);
      })
      .catch(error => console.error('Error fetching commodities:', error));

    fetchHistoricalData(apiKey, symbol, chartInterval, startDate, endDate);

  }, [symbol, chartInterval]);

  useEffect(() => {
    if (chartInterval === '1min') {
      const intervalId = setInterval(() => {
        fetchHistoricalData(apiKey, symbol, chartInterval, startDate, endDate);
      }, 60000);
      return () => clearInterval(intervalId); // Clean up the interval on component unmount

    }
  }, [symbol, chartInterval, apiKey, startDate, endDate]);


  function toUnixTimestamp(dateString) {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000);
  }

  const mapAndSortData = (data) => {
    const series = data.map(entry => ({
      time: toUnixTimestamp(entry.date),
      open: entry.open,
      high: entry.high,
      low: entry.low,
      close: entry.close,
      volume: entry.volume,
    }));

    // Sort the series by time
    series.sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateA - dateB;
    });

    return series;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    chartEl.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    setFormData({
      symbol,
      autoSize,
      chartWidth,
      chartHeight,
      theme,
      chartInterval,
      chartType,
      showToolbar,
      showVolume,
      allowSymbolChange,
      showSymbolDescription,
      imageButton,
    });
    fetchHistoricalData(apiKey, symbol, chartInterval, startDate, endDate)
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));


  }

  const handleSymbolChange = (symbol) => {
    fetchHistoricalData(apiKey, symbol, chartInterval, startDate, endDate);

  };

  const handleIntervalChange = (interval) => {
    fetchHistoricalData(apiKey, symbol, interval, startDate, endDate);
  }

  const handleReset = () => {
    // Reset the selected commodity to its initial state (if needed)
    setSymbol('GCUSD'); // Replace 'initialCommodity' with the initial state value

    // Reset other form fields to their initial state (if needed)
    setTheme('light'); // Replace 'initialTheme' with the initial state value
    setChartType('4'); // Replace 'initialChartType' with the initial state value
    setChartInterval('1day');
    setAutoSize(true); // Replace 'initialAutoSize' with the initial state value
    setChartWidth(defaultData.chartWidth);
    setChartHeight(defaultData.chartHeight);
    setImageButton(true);
  };

  return (
    <>
      <div id="chart" className="chart flex flex-col items-center justify-center mt-4">
        <ChartComponent {...props} data={initialData} chartType={chartType} chartInterval={chartInterval} formData={formData} isLoading={isLoading} commodities={commodities} handleSymbolChange={handleSymbolChange} handleIntervalChange={handleIntervalChange} fetchHistoricalData={fetchHistoricalData}></ChartComponent>
      </div>
      <div className='backlink w-full text-center mt-1.5'>Live data provided by<a href="https://auronum.co.uk/" className='text-blue-600' target='_blank'> Auronum</a></div>

      {!widget ? (
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="container order-2 md:order-1">
            {/* Left side content (embed code) */}
            <div className="p-6">
              {/* Embed code */}
              <h2 className="text-xl font-semibold mb-4">Embed Code</h2>
              <ChartWidget
                className="w-full h-32 border border-gray-300 rounded-md px-3 py-2"
                autoSize={autoSize}
                symbol={symbol}
                chartType={chartType}
                chartWidth={chartWidth}
                chartHeight={chartHeight}
                chartInterval={chartInterval}
                theme={theme}
                showToolbar={showToolbar}
                showVolume={showVolume}
                allowSymbolChange={allowSymbolChange}
                showSymbolDescription={showSymbolDescription}
                imageButton={imageButton}
              />
            </div>
          </div>
          <div className="container order-1 md:order-2">
            {/* Right side content (form) */}
            <div className="p-6">
              {/* Form */}
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <form onSubmit={handleSubmit}>
                {/* Form fields */}
                <Typography className="text-gray-700 font-light">
                  Default symbol
                </Typography>
                <div className="symbols bg-blue-gray-50 rounded-lg mb-5 col-12">
                  <div className="flex items-center justify-between p-2 rounded-[7px]" onClick={handleOpen} variant="gradient">
                    <div className="symbol__name flex flex-col items-start">
                      {symbol}
                    </div>
                    <GoPencil size={25} />
                  </div>
                </div>
                <div className="map__size grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                  <div className="size">
                    <Typography className="text-gray-700 font-light">
                      Width
                    </Typography>
                    <Input
                      size="lg"
                      value={chartWidth}
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      disabled={autoSize}
                      onChange={(event) => setChartWidth(event.target.value)}
                    />
                  </div>
                  <div className="size">
                    <Typography className="text-gray-700 font-light">
                      Height
                    </Typography>
                    <Input
                      size="lg"
                      value={chartHeight}
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      disabled={autoSize}
                      onChange={(event) => setChartHeight(event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                  <Checkbox color="blue" label="Autosize" className="pl-0" defaultChecked={autoSize} onChange={(event) => {
                    setAutoSize(event.target.checked)
                  }} />
                  <Select label="Interval" value={chartInterval} onChange={(val) => setChartInterval(val)} size="md">
                    <Option value="1min">1m</Option>
                    <Option value="30min">30m</Option>
                    <Option value="1hour">1h</Option>
                    <Option value="1day">1 day</Option>
                    <Option value="1week">1 week</Option>
                    <Option value="1month">1 month</Option>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                  <div className="select">
                    <Select label="Theme" value={theme} onChange={(val) => setTheme(val)}>
                      <Option value="light">Light</Option>
                      <Option value="dark">Dark</Option>
                    </Select>
                  </div>
                  <div className="select">
                    <Select label="Bar's Style" value={chartType} onChange={(val) => setChartType(val)}>
                      <Option value="1">Area</Option>
                      <Option value="2">Bar</Option>
                      <Option value="3">Baseline</Option>
                      <Option value="4">Candlestick</Option>
                      <Option value="5">Line</Option>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                  <List>
                    <Checkbox color="blue" label="Show top toolbar" checked={showToolbar} onChange={(event) => {
                      setShowToolbar(event.target.checked)
                    }} />
                    <Checkbox color="blue" label="Show Volume" checked={showVolume} onChange={(event) => {
                      setShowVolume(event.target.checked)
                    }} />
                  </List>
                  <List>
                    <Checkbox color="blue" label="Allow symbol change" defaultChecked onChange={(event) => {
                      setAllowSymbolChange(event.target.checked)
                    }} />
                    <Checkbox color="blue" label="Show symbol description" defaultChecked onChange={(event) => {
                      setShowSymbolDescription(event.target.checked)
                    }} />
                    <Checkbox color="blue" label="«Get image» button" defaultChecked onChange={(event) => {
                      setImageButton(event.target.checked)
                    }} />
                  </List>
                </div>
                {/* Submit button */}
                <div className="flex justify-end">
                  <button onClick={handleReset} className="bg-transparent hover:bg-blue text-blue-600 px-4 py-2 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white mr-3">Reset</button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Apply</button>
                </div>
              </form>

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
                      <ListItem key={index} value={commodity.symbol} onClick={() => { setSymbol(commodity.symbol); handleOpen(); }}>{commodity.name}</ListItem>
                    ))}
                  </List>
                </DialogBody>
              </Dialog>
            </div>
          </div>
        </div>
      ) : null}

    </>
  );
}
