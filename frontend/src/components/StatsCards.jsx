import React from 'react'
export default function StatsCards({result}){
    return (
        <div>
            <div className="statsRow">
                <div className="statCard">
                    <div className="muted">Avg NAV</div>
                    <div className="big">{result.avgNav.toFixed(3)}</div>
                </div>
                <div className="statCard">
                    <div className="muted">Min / Max</div>
                    <div className="big">{result.minNav.toFixed(3)} / {result.maxNav.toFixed(3)}</div>
                </div>
                <div className="statCard">
                    <div className="muted">Volatility (annual)</div>
                    <div className="big">{result.volatility.toFixed(3)}</div>
                </div>
                <div className="statCard">
                    <div className="muted">Sharpe (annual)</div>
                    <div className="big">{result.sharpe.toFixed(3)}</div>
                </div>
            </div>


            <div className="resultCard large">
                <div className="row"><div className="muted">Fund</div><div className="val">{result.fundName}</div></div>
                <div className="row"><div className="muted">Predicted NAV</div><div className="val">{result.predictedNextNav.toFixed(3)}</div></div>
                <div className="row"><div className="muted">RMSE</div><div className="val">{result.rmse.toFixed(3)}</div></div>
                <div className="row"><div className="muted">Trend</div><div className="val">{result.trend}</div></div>
            </div>
        </div>
    )
}