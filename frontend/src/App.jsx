import { useState, useEffect, useRef } from "react";
import "./App.css";

// Example questions shown as clickable buttons, inspired by LEASE's own
// "Ask a question" tool. Each one contains real keywords so it works
// seamlessly with the existing keyword-matching backend.
const EXAMPLE_QUESTIONS = [
  "My landlord increased my service charge",
  "I want to complain about my landlord",
  "How much would it cost to extend my lease?",
  "I'm worried about fire safety in my building",
  "I want to buy a bigger share of my home",
  "I'm buying a leasehold flat",
  "What are my rights as a leaseholder?",
];

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const resultRef = useRef(null);

  // Move focus to the result when it appears, so keyboard/screen reader
  // users are taken straight to the answer
  useEffect(() => {
    if (submitted && resultRef.current) {
      resultRef.current.focus();
    }
  }, [submitted, result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setResult(data);
    setSubmitted(true);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setSubmitted(false);
  };

  // When an example question is clicked, fill the textbox with it so the
  // user can submit it through the same existing flow
  const handlePickExample = (question) => {
    setText(question);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="app-title">Leasehold Enquiry Triage</span>
          <span className="app-subtitle">A free pointer to your next step</span>
        </div>
      </header>

      <main className="app-main">
        <h1 className="page-title">Describe your situation</h1>
        <p className="page-intro">
          Tell us what's happening and we'll point you to a clear next step.
          This is not legal advice.
        </p>

        <form className="form-section" onSubmit={handleSubmit}>
          <label htmlFor="situation" className="form-label">
            What's happening?
          </label>
          <p className="form-hint">
            A sentence or two is enough. There's no wrong way to write it.
          </p>
          <textarea
            id="situation"
            rows="6"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. my landlord increased my service charge without explanation"
            className="situation-textarea"
          />
          <div className="button-row">
            <button type="submit" className="btn-primary">
              Get my next step
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary"
            >
              Start again
            </button>
          </div>
        </form>

        <div aria-live="polite">
          {submitted && result && (
            <section className="result-card" tabIndex={-1} ref={resultRef}>
              <span className="result-label">Closest category</span>
              <h2 className="result-title">{result.category}</h2>
              <p className="result-explanation">{result.explanation}</p>
              <div className="result-next-step">
                <h3>Your next step</h3>
                <p>{result.nextStep}</p>
              </div>
              <p className="result-disclaimer">
                General information only, not legal advice. If this category
                doesn't fit, try one of the example questions below.
              </p>
       {result.hasMultipleMatches && (
  <div className="multi-match-notice">
    <p>This may also relate to other issues — try describing each part of your situation separately for more specific guidance.</p>
  </div>
)}
            </section>
          )}

          {submitted && !result && (
            <section className="no-match-card" tabIndex={-1} ref={resultRef}>
              <h2>We couldn't identify a clear category</h2>
              <p>
                Please try describing it differently, or choose one of the
                example questions below.
              </p>
            </section>
          )}
        </div>

        <section className="categories-section">
          <h2>Not sure what to write?</h2>
          <p>Choose the example closest to your situation.</p>
          <fieldset className="category-buttons">
            <legend className="visually-hidden">
              Choose an example question
            </legend>
            {EXAMPLE_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => handlePickExample(question)}
                className={`category-btn ${text === question ? "selected" : ""}`}
              >
                {question}
              </button>
            ))}
          </fieldset>
        </section>

        <p className="footer-note">
          Nothing you write here is sent to your landlord or managing agent. For
          advice on your own lease, speak to a qualified adviser.
        </p>
      </main>
    </div>
  );
}

export default App;
