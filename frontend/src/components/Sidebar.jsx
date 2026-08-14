import React from 'react'
export default function Sidebar(){
    return (
        <aside className="sidebar">
            <div className="logoSmall">MFP <span className="dot">●</span></div>
            <nav>
                <button className="navBtn active">Predict</button>
                <button className="navBtn">Upload</button>
                <button className="navBtn">About</button>
            </nav>
        </aside>
    )
}