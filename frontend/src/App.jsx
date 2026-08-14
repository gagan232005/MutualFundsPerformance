import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import api from "./services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Nav from "./components/Nav";
import AIChat from "./components/AIChat";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import ModelComparisonPage from "./pages/ModelComparisonPage";
import UnderstandingModels from "./pages/UnderstandingModels";
import SIP from "./pages/SIP";
import About from "./pages/About";

import LOGO from "./assets/fund.png";
import "./styles.css";


function Layout() {
  const [amcList, setAmcList] = useState([]);
  const [selectedAMC, setSelectedAMC] = useState("");
  const [fundList, setFundList] = useState([]);
  const [fund, setFund] = useState("");

  const [eda, setEda] = useState(null);
  const [predictionData, setPredictionData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showChat, setShowChat] = useState(false);


  /* =========================
     THEME (dark / light)
     Was previously wired to nothing — the Nav button had no
     theme/toggleTheme props at all, so clicking it did nothing.
  ========================= */

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("mfp-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    try {
      localStorage.setItem("mfp-theme", theme);
    } catch {
      // localStorage unavailable (private mode etc.) — ignore
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }


  /* =========================
     LOAD AMC LIST
  ========================= */

  useEffect(() => {
    api
        .get("/amc-list")
        .then((res) => {
          setAmcList(res.data || []);
        })
        .catch((err) => {
          setError(
              friendlyError(err, "Couldn't load the AMC list.")
          );
        });
  }, []);


  /* =========================
     LOAD FUNDS FOR AMC
  ========================= */

  useEffect(() => {
    if (!selectedAMC) return;

    setFundList([]);
    setFund("");

    api
        .get(`/fund-list?name=${selectedAMC}`)
        .then((res) => {
          setFundList(res.data || []);
        })
        .catch((err) => {
          setError(
              friendlyError(
                  err,
                  "Couldn't load funds for this AMC."
              )
          );
        });
  }, [selectedAMC]);


  /* =========================
     CLEAR OLD DATA
  ========================= */

  useEffect(() => {
    setEda(null);
    setPredictionData(null);
    setShowChat(false);
  }, [fund]);


  function friendlyError(err, fallback) {
    return err?.response?.data?.error || fallback;
  }


  /* =========================
     LOAD EDA
  ========================= */

  async function loadEDA() {
    if (!fund) {
      alert("Select fund!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/by-fund?fund=${fund}`);

      setEda(res.data || {});
      setPredictionData(null);
    } catch (err) {
      setError(
          friendlyError(
              err,
              "Couldn't load this fund's data. It may be temporarily unavailable."
          )
      );
    }

    setLoading(false);
  }


  /* =========================
     PREDICTION
  ========================= */

  async function handlePredict() {
    if (!fund) {
      alert("Select fund!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/predict?fund=${fund}`);

      setPredictionData(res.data || {});
    } catch (err) {
      setError(
          friendlyError(
              err,
              "Couldn't generate a prediction for this fund right now."
          )
      );
    }

    setLoading(false);
  }


  /* =========================
     DATA PREPARATION
  ========================= */

  const dates =
      predictionData?.predictionDates || [];

  const predicted =
      predictionData?.prediction || [];

  const actual =
      eda?.navValues ||
      eda?.history ||
      [];

  const historyDates =
      eda?.dates || [];

  const modelData =
      predictionData?.modelComparison || [];


  /* =========================
     FUND NAME
  ========================= */

  const fundName =
      eda?.fundName ||
      predictionData?.fundName ||
      fundList.find(
          (f) => f.code === fund
      )?.name ||
      fund;


  /* =========================
     NEXT NAV
  ========================= */

  const nextNAV =
      predicted.length > 0
          ? predicted[predicted.length - 1]
          : 0;


  /* =========================
     AI CHAT DATA
  ========================= */

  const algorithmsObj =
      (eda?.algorithms || []).reduce(
          (acc, algo) => {

            const key = (
                algo?.name ||
                algo?.model ||
                ""
            )
                .toString()
                .toLowerCase();

            if (key) {
              acc[key] = algo;
            }

            return acc;

          },
          {}
      );


  const chatHistory = actual.map((value) =>
      typeof value === "object" && value !== null
          ? value
          : { nav: value }
  );


  const chatData =
      predictionData && eda
          ? {
            predicted,
            history: chatHistory,
            algorithms: algorithmsObj,
            modelComparison: modelData,
          }
          : null;


  /* =========================
     PROFESSIONAL PDF EXPORT
  ========================= */

  const handleDownloadPDF = async () => {

    const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
    );

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();


    /* ---------- COVER PAGE ---------- */

    pdf.setFillColor(
        8,
        15,
        30
    );

    pdf.rect(
        0,
        0,
        pageWidth,
        pageHeight,
        "F"
    );


    /* Logo */

    const logoImg = new Image();

    logoImg.src = LOGO;

    await new Promise((resolve) => {

      logoImg.onload = () => {

        const logoWidth = 70;
        const logoHeight =
            (logoImg.height / logoImg.width) *
            logoWidth;

        pdf.addImage(
            logoImg,
            "PNG",
            (pageWidth - logoWidth) / 2,
            25,
            logoWidth,
            logoHeight
        );

        resolve();
      };

      logoImg.onerror = () => {
        resolve();
      };

    });


    /* Title */

    pdf.setTextColor(
        255,
        255,
        255
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(25);

    pdf.text(
        "Mutual Funds",
        pageWidth / 2,
        100,
        {
          align: "center",
        }
    );

    pdf.text(
        "Performance Prediction",
        pageWidth / 2,
        112,
        {
          align: "center",
        }
    );


    /* Fund name */

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(13);

    pdf.setTextColor(
        170,
        190,
        215
    );

    pdf.text(
        fundName,
        pageWidth / 2,
        132,
        {
          align: "center",
        }
    );


    /* Generated date */

    pdf.setFontSize(9);

    pdf.setTextColor(
        130,
        150,
        175
    );

    pdf.text(
        `Generated on ${new Date().toLocaleString()}`,
        pageWidth / 2,
        145,
        {
          align: "center",
        }
    );


    /* Footer */

    pdf.setFontSize(8);

    pdf.setTextColor(
        100,
        120,
        145
    );

    pdf.text(
        "Mutual Fund Intelligence Platform",
        pageWidth / 2,
        275,
        {
          align: "center",
        }
    );


    /* ---------- REPORT CONTENT ---------- */

    const input =
        document.getElementById(
            "reportContent"
        );

    if (input) {

      pdf.addPage();

      const canvas =
          await html2canvas(
              input,
              {
                scale: 2.5,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
              }
          );


      const imgData =
          canvas.toDataURL(
              "image/png",
              1.0
          );


      const imgWidth =
          pageWidth;

      const imgHeight =
          (canvas.height * imgWidth) /
          canvas.width;


      let heightLeft =
          imgHeight;

      let position = 0;


      pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
      );

      heightLeft -= pageHeight;


      while (heightLeft > 0) {

        position =
            heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
            imgData,
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight
        );

        heightLeft -= pageHeight;
      }
    }


    /* ---------- PAGE NUMBERS ---------- */

    const totalPages =
        pdf.internal.getNumberOfPages();


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

      pdf.setPage(i);

      pdf.setFont(
          "helvetica",
          "normal"
      );

      pdf.setFontSize(8);

      pdf.setTextColor(
          120,
          120,
          120
      );

      pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 6,
          {
            align: "center",
          }
      );
    }


    pdf.save(
        `${fundName}_Professional_Report.pdf`
    );
  };


  /* =========================
     OUTLET CONTEXT
  ========================= */

  const outletContext = {

    amcList,

    selectedAMC,
    setSelectedAMC,

    fundList,

    fund,
    setFund,

    fundName,

    eda,

    predictionData,

    loading,

    error,

    loadEDA,

    handlePredict,

    handleDownloadPDF,

    dates,

    predicted,

    actual,

    historyDates,

    modelData,

    nextNAV,
  };


  /* =========================
     LAYOUT
  ========================= */

  return (

      <div className="page">

        <div className="container">

          {/* =========================
            BRAND HERO (logo + main title)
        ========================= */}

          <header className="brand-hero">

            <div className="brand-hero-badge">
              <span className="brand-hero-dot" />
              Mutual Fund Intelligence Platform
            </div>

            <div className="brand-hero-logo-frame">
              <img
                  src={LOGO}
                  className="brand-hero-logo"
                  alt="Mutual Funds Performance Prediction"
              />
            </div>

            <h1 className="brand-hero-title">
              Mutual Funds
              <span> Performance Prediction</span>
            </h1>

            <p className="brand-hero-tagline">
              Real-time NAV analytics, statistical insights and AI-assisted
              forecasting to help you evaluate Indian mutual funds with
              confidence.
            </p>

            <div className="brand-hero-chips">
              <span className="brand-hero-chip">Real-time NAV Analytics</span>
              <span className="brand-hero-chip">Machine-learning Forecasts</span>
              <span className="brand-hero-chip">AI Fund Assistant</span>
            </div>

          </header>


          {/* =========================
            NAVIGATION
        ========================= */}

          <Nav theme={theme} toggleTheme={toggleTheme} />


          {/* =========================
            ERROR
        ========================= */}

          {error && (

              <div
                  className="error-banner"
                  role="alert"
              >

            <span>
              ⚠️ {error}
            </span>

                <button
                    className="error-banner-close"
                    onClick={() =>
                        setError("")
                    }
                    aria-label="Dismiss"
                >
                  ✖
                </button>

              </div>

          )}


          {/* =========================
            ROUTED PAGE
        ========================= */}

          <Outlet
              context={outletContext}
          />

        </div>


        {/* =========================
          AI FUND ASSISTANT
      ========================= */}

        {predictionData && (

            <>

              <button
                  className="chatbot-fab"
                  onClick={() =>
                      setShowChat(true)
                  }
                  aria-label="Open AI Fund Assistant"
                  title="Ask the AI Fund Assistant"
              >
                🤖
              </button>


              {showChat && (

                  <AIChat
                      data={chatData}
                      fundName={fundName}
                      onClose={() =>
                          setShowChat(false)
                      }
                  />

              )}

            </>

        )}

      </div>
  );
}


/* =========================
   APP ROUTES
========================= */

export default function App() {

  return (

      <BrowserRouter>

        <Routes>

          <Route
              element={<Layout />}
          >

            <Route
                path="/"
                element={<Dashboard />}
            />

            <Route
                path="/analytics"
                element={<Analytics />}
            />

            <Route
                path="/prediction"
                element={<Prediction />}
            />

            <Route
                path="/model-comparison"
                element={<ModelComparisonPage />}
            />

            <Route
                path="/sip-calculator"
                element={<SIP />}
            />

            <Route
                path="/understanding-models"
                element={<UnderstandingModels />}
            />

            <Route
                path="/about"
                element={<About />}
            />

          </Route>

        </Routes>

      </BrowserRouter>
  );
}