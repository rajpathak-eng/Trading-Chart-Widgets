# Trading Chart Widgets

Welcome to the Trading Chart Widgets project! This repository contains the source code for creating two customizable trading widgets that can be embedded onto other websites, providing backlinks to your website.

## Overview

This project aims to recreate two specific widgets found on TradingView, allowing users to customize and embed them on their websites. The widgets will provide a backlink to your website, similar to how TradingView's widgets link back to theirs.

### Tool 1: Ticker Tape Widget

The Ticker Tape widget allows users to customize and display a scrolling list of selected commodities, stocks, or currencies. Users can configure the widget on your website and then embed the generated code on their own websites, which includes a backlink to your site.

- **Example:** [TradingView Ticker Tape Widget](https://www.tradingview.com/widget/ticker-tape/#:~:text=Use%20the%20field%20called%20full,to%20your%20individual%20chart%20pages.)
- **Customization:** Users can select the specific commodities, stocks, or currencies they want to display.
- **Embedding:** After customization, users can embed the widget on their websites with a backlink to your site.

### Tool 2: Advanced Chart Widget

The Advanced Chart widget allows users to select and display charts for various markets. Users can configure the chart on your website and then embed the generated code on their own websites, which includes a backlink to your site.

- **Example:** [TradingView Advanced Chart Widget](https://www.tradingview.com/widget/advanced-chart/)
- **Customization:** Users can choose the market and chart type they want to display.
- **Embedding:** After customization, users can embed the widget on their websites with a backlink to your site.

- **Example of usage:** [Scottsdale Mint Live Gold & Silver Price Chart](https://www.scottsdalemint.com/live-gold-silver-price-chart/)

## API Provider

We are using the Financial Modeling Prep API to fetch the data for the widgets. You can sign up and get your API key from [Financial Modeling Prep](https://site.financialmodelingprep.com/login).

## Installation

To get started with the project, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/rajpathak-eng/Trading-Chart-Widgets.git
    cd Trading-Chart-Widgets
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your API key:
    ```env
    API_KEY=your_api_key_here
    ```

4. Start the development server:
    ```bash
    npm start
    ```

## Usage

1. **Customize the Widget:**
    - Navigate to the widget customization page on your website.
    - Select the desired commodities, stocks, or currencies for the Ticker Tape widget.
    - Choose the market and chart type for the Advanced Chart widget.

2. **Generate Embed Code:**
    - After customizing the widget, click the "Generate Embed Code" button.
    - Copy the generated code.

3. **Embed the Widget:**
    - Paste the embed code into the HTML of your website.
    - The widget will now be displayed on your website with a backlink to your site.

## Contribution

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact Me


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
