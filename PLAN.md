# LEASE Enquiry Triage Prototype - The Plan

**Candidate:** Apra Khanna

## 1. Problem Restatement

The Leasehold Advisory Service (LEASE) supports leaseholders and park homeowners who arrive at the website with questions about their situation. These users may be anxious because their landlord did something confusing, or they received an unexpected bill, and they don't know what to do. Right now, the answer to their question is buried in long legal documents that are hard to read, especially when someone is anxious. So the first version should help them identify a useful next step rather than present them with a large amount of legal information.

For this first version, I am scoping the prototype to leaseholders only, to keep the first slice small and well-understood. The user will be able to describe their situation using a small set of guided options and provide a short description in their own words.

The prototype will then triage/categorise the enquiry and present a clear, plain-English next step.

A useful first version means that a user can:

1. Understand what the tool is asking them
2. Pick or describe their situation
3. See what type of issue it is (a category)
4. Understand what they can do next

This prototype's job is to help the person figure out what kind of problem they have and what to do next - not to give them an actual legal answer, because that requires a legally qualified advisor and creates liability if wrong.

## 2. Assumptions

### Technical assumptions

- No authentication is required, there is no need for login or sign-up, and there is no persistent user data to store.
- We will not use a database for this first version, because it would require setup, whereas storing data in JSON is easy for a first slice.
- The triage logic will be rule-based rather than AI-based, because we can easily map categories to solutions ourselves, rather than depending on external AI APIs, which have their own internal mechanism for selecting a category that we cannot see or control.
- We will use React for the frontend.
- A small Node.js/Express API will handle the backend.
- Frontend and backend will be kept separate, as the brief asks for.

### Testing assumption

We will test the triage logic with a handful of sample scenarios to validate that the rule-based matching works correctly, rather than testing for multiple simultaneous users, because we are not building a production app.

### Product assumptions

I am scoping this prototype to leaseholders only.

Based on LEASE's website, I used their 7 leasehold topics as first-slice categories:
For 3 categories (Building management, Lease extension, Costs and charges), I added specific sub-scenarios with their own next steps, after finding a single generic next step wasn't specific enough. The remaining 4 categories use one next step each, to keep the first slice manageable within the time available.

- **Building management**: how buildings are managed, including repairs and fire safety
- **Buying and selling**: the process of buying or selling a leasehold flat
- **Costs and charges**: money a leaseholder is asked to pay, like service charges or ground rent
- **Disputes**: problems with a landlord or managing agent, and how to resolve them
- **Lease extension**: extending the number of years left on a lease
- **Leasehold essentials**: general rights and responsibilities of being a leaseholder
- **Shared ownership**: buying or owning a share of a property rather than all of it

### User needs assumption

We will provide a free-text box, and also an option for users who don't know what to type, because sometimes a stressed user might not have the right words to describe their situation.

### Advice and safety assumptions

- I assume the tool will provide next steps with explanation, but will not provide legal advice, because that requires a legally qualified advisor and creates liability if wrong.
- Where the prototype can't confidently match a category, it should point to a general next step rather than guessing.

## 3. Task Breakdown

**Ticket 1 - Setup - React app + Express server scaffold**  

**Done means:** Running `npm start` (or equivalent) launches the React app in the browser, and the Express server runs without errors on its own port.

**Ticket 2 - Category data**  

**Done means:** The JSON file contains a category name, explanation, and next step for all 7 categories.

**Ticket 3 - Triage logic** (the pure function that takes user's free-text and returns a matching category using keyword matching)  

**Done means:** When given the sample text "something added in my bill", the function returns the category "Costs and charges".

**Ticket 4 - Unit tests for triage logic**

**Done means:** Automated tests exist for the most important behaviours, and all tests pass.

**Ticket 5 - Backend API endpoint** (the triage function is connected to an Express route so the frontend can call it)  

**Done means:** Sending a POST request with the text "money is added to my bill" to the endpoint returns a response containing the category "Costs and charges", along with its explanation and next step.

**Ticket 6 - Frontend form** (UI only, not connected to backend yet)  

**Done means:** The page displays a free-text input where the user can describe their situation, and a dropdown with the 7 categories as options.

**Ticket 7 - Connect frontend to backend**  

**Done means:** After the user submits their text (or selects a category from the dropdown), the screen displays the category name, explanation, and next step.

**Ticket 8 - Fallback/edge case flow**  

**Done means:** When the free-text input doesn't match any category, the screen displays a message (e.g., "Sorry, we couldn't identify your category"), and the user can then use the dropdown to select a category manually.

**Ticket 9 - Manual testing**  

**Done means:** All 7 categories and the fallback case tested manually through the actual UI, with correct results shown each time.

**Ticket 10a - Accessibility pass**  

**Done means:** Accessibility check completed — flow tested by navigating with keyboard only, labels added to the text input and dropdown, focus moves to the result section when it appears, and the fallback error message is clear and readable.

**Ticket 10b - Security/data & code review pass**  

**Done means:** Confirmed no personal data (name/email) is collected or stored, empty/invalid input is handled without crashing the app, and the UI copy has been reviewed for clarity.

## 4. Risks and Review Areas

- **Testing**: Keyword matching might miss inputs that don't use expected words. Mitigated by the fallback option (dropdown), but with more time, a larger set of test phrases would help refine the keyword list.
- **Accessibility**: Limited manual accessibility testing done in the time available (keyboard nav, labels, focus). A full screen-reader test with real assistive tech would be needed for production.
- **Data**: No personal data is collected in this prototype, but if this grew into a real product, careful thought would be needed around what enquiry data (if any) is stored and for how long.
- **Security**: Basic input handling (empty/invalid text) is covered, but a production version would need rate-limiting, input sanitisation, and proper error logging.  

**What a code reviewer should scrutinize"**:

- How the triage logic handles text containing keywords from multiple categories (e.g., "dispute about my service charge bill" matches both "Disputes" and "Costs and charges") - the matching order/priority needs to be intentional, not accidental.
- How the function handles empty or whitespace-only input, to ensure it doesn't crash or return an unexpected result.
- Whether keyword matching is case-sensitive - e.g., whether "BILL" or "Bill" matches the same as "bill".

## Scope deliberately left out

This first slice will not attempt to provide:

- A complete legal advice engine
- Authentication or user accounts
- Production deployment or infrastructure
- Real user data
- Comprehensive coverage of every leasehold or park-home scenario
- Personalised legal advice

These could be considered in later iterations if the prototype demonstrated value.
