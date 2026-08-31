import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [categoryNames, setCategoryNames] = useState([]);
  const resultRef = useRef(null);

  // Fetch the list of category names from the backend on page load,
  // so the buttons always match what's in categories.json (single source of truth)
  useEffect(() => {
    fetch('http://localhost:3001/categories')
      .then((res) => res.json())
      .then((names) => setCategoryNames(names));
  }, []);

  // Move focus to the result when it appears, so keyboard/screen reader
  // users are taken straight to the answer
  useEffect(() => {
    if (submitted && resultRef.current) {
      resultRef.current.focus();
    }
  }, [submitted, result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    setResult(data);
    setSubmitted(true);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setSubmitted(false);
  };

  // When a category button is picked directly, fill the textbox with its
  // name so the user can submit it through the same existing flow
  const handlePickCategory = (name) => {
    setText(name);
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
          Tell us what's happening and we'll point you to a clear next step. This is not legal advice.
        </p>

        <form className="form-section" onSubmit={handleSubmit}>
          <label htmlFor="situation" className="form-label">What's happening?</label>
          <p className="form-hint">A sentence or two is enough. There's no wrong way to write it.</p>
          <textarea
            id="situation"
            rows="6"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. my landlord increased my service charge without explanation"
            className="situation-textarea"
          />
          <div className="button-row">
            <button type="submit" className="btn-primary">Get my next step</button>
            <button type="button" onClick={handleClear} className="btn-secondary">Start again</button>
          </div>
        </form>

        <div aria-live="polite">
          {submitted && result && (
            <section className="result-card" tabIndex={-1} ref={resultRef}>
              <span className="result-label">Closest category</span>
              <h2 className="result-title">{result.category}</h2>
              <div className="result-next-step">
                <h3>Your next step</h3>
                <p>{result.nextStep}</p>
              </div>
              <p className="result-disclaimer">
                General information only, not legal advice. If this category doesn't fit, choose a different one below.
              </p>
            </section>
          )}

          {submitted && !result && (
            <section className="no-match-card" tabIndex={-1} ref={resultRef}>
              <h2>We couldn't identify a clear category</h2>
              <p>Please try describing it differently, or choose one of the categories below.</p>
            </section>
          )}
        </div>

        <section className="categories-section">
          <h2>Not sure what to write?</h2>
          <p>Choose the area closest to your situation.</p>
          <fieldset className="category-buttons">
            <legend className="visually-hidden">Choose a category</legend>
            {categoryNames.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handlePickCategory(name)}
                className={`category-btn ${text === name ? 'selected' : ''}`}
              >
                {name}
              </button>
            ))}
          </fieldset>
        </section>

        <p className="footer-note">
          Nothing you write here is sent to your landlord or managing agent. For advice on your own lease, speak to a qualified adviser.
        </p>
      </main>
    </div>
  );
}

export default App;