import React, { useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'


const ChartWidget = (props) => {
    const { autoSize, chartWidth, chartHeight, chartType, symbol, theme, allowSymbolChange, imageButton, showSymbolDescription, showToolbar, chartInterval, showVolume } = props;

    const [tooltipVisible, setTooltipVisible] = useState(false);


    const codeString = `<!-- Auronum Widget BEGIN -->
    <div class="auronum-widget-container" style="height:100%;width:100%">
    <link
    rel="stylesheet"
    href="https://auronum.co.uk/trading-chart/assets/widget.css"
    />
    <script type="text/javascript" src="https://auronum.co.uk/trading-chart/assets/embed-widget-chart.js" async></script>
    <div id="root" data='{
        "autosize": ${autoSize},
        "symbol": "${symbol}",
        "interval": "${chartInterval}",
        "width": ${chartWidth},
        "height": ${chartHeight},
        "theme": "${theme}",
        "style": "${chartType}",
        "locale": "en",
        "showToolbar": ${showToolbar},
        "showVolume": ${showVolume},
        "allowSymbolChange": ${allowSymbolChange},
        "showSymbolDescription": ${showSymbolDescription},
        "save_image": ${imageButton},
        "support_host": "https://auronum.co.uk/"
    }'>
    </div>
    <!-- Auronum Widget END -->`;

    const codeRef = useRef(null);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeString).then(() => {
            setTooltipVisible(true);
            setTimeout(() => setTooltipVisible(false), 2000);  // Hide tooltip after 2 seconds
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <>
            <pre>
                {codeString}
            </pre>
            <button
                onClick={copyToClipboard}
                data-tooltip-id="copyTooltip"
                data-tooltip-content="Code copied to clipboard!"
                className="bg-transparent tooltip hover:bg-blue text-blue-600 px-4 py-2 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white mt-3"
            >
                Copy Code
            </button>
            {tooltipVisible && (
                <Tooltip
                    anchorSelect=".tooltip"
                    id="copyTooltip"
                    place="bottom"
                    isOpen={tooltipVisible}
                    clickable
                />
            )}
        </>
    );
};

export default ChartWidget;
