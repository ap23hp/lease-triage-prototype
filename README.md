# LEASE Enquiry Triage Prototype

**Candidate:** Apra Khanna
**Date:** 02 September 2026

A small prototype that helps leaseholders describe their situation in their own words and get pointed to a clear, plain-English next step - built for LEASE's take-home developer exercise.

This is not a legal advice engine. It uses simple, rule-based keyword matching to triage an enquiry into one of 7 leasehold categories, some of which have more specific sub-scenarios.

## How to run locally

You will need Node.js installed.

**1. Clone the repository:**

git clone https://github.com/ap23hp/lease-triage-prototype.git
cd lease-triage-prototype


**2. Start the backend:**

cd backend
npm install
node server.js

This runs the API on `http://localhost:3001`.

**3. Start the frontend (in a separate terminal):**

cd frontend
npm install
npm run dev

This runs the app on `http://localhost:5173` (or the URL shown in your terminal).

**4. Run the backend tests:**

cd backend
npm test


## What I built

- A form where a user can describe their situation in free text, or click an example question to get started.
- Rule-based keyword matching that identifies the closest leasehold category (and, for 3 categories, a more specific sub-scenario).
- A plain-English explanation and a concrete next step for the matched category - not legal advice.
- A fallback message with example questions when nothing matches.
- A notice suggesting the user describe each part separately when their enquiry seems to relate to more than one category.

**Try it with:**
- "My landlord increased my service charge" → matches **Costs and charges**
- "I'm worried about fire safety in my building" → matches **Building management**
- "How much would it cost to extend my lease?" → matches **Lease extension**
- "I want to buy a bigger share of my home" → matches **Shared ownership**

## What I left out

- A complete legal advice engine, or personalised legal advice
- Authentication, user accounts, or production deployment/infrastructure
- Real user data - only dummy/example data is used
- Park homes - this covers leaseholders only
- Detailed sub-scenarios for all 7 categories - only 3 (Building management, Lease extension, Costs and charges) have them, due to time constraints; the same pattern could be extended to the other 4

## Further documentation

See [`PLAN.md`](./PLAN.md) for the full planning pack, and [`QUALITY_NOTES.md`](./QUALITY_NOTES.md) for the hardening pass, security/accessibility notes, and self code review.

---

Thank you for reviewing this - happy to walk through any part of it in more detail.
