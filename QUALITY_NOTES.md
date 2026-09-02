# Quality Notes

**Candidate:** Apra Khanna

## Hardening pass (code)

I made the following improvements as a focused quality pass:

- **Improved accessibility**: added a visible focus outline, `aria-live="polite"` for automatic screen-reader announcements, and moved keyboard focus to the result section when it appears (details in the Accessibility section below).

### Code review notes 

While reviewing the first version of App.jsx, I identified a few issues:

- **Redundant state**: The component had 4 pieces of state (`text`, `result`, `noMatch`, `picked`), but `noMatch` was redundant — it could be derived from whether `result` was `null` after a submission, so I simplified this to 3 states (`text`, `result`, `submitted`) instead of tracking overlapping flags separately.
- **Inline styles**: The initial version used inline `style={{}}` objects throughout, which I felt was not good practice for a maintainable project, it mixes styling and logic, and doesn't support pseudo-classes like `:hover` or `:focus-visible` cleanly. I moved all styling into a separate `App.css` file using class names instead.
- **Missing semantic HTML**: I noticed the form inputs weren't wrapped in a `<form>` element, so pressing Enter wouldn't submit the form — only clicking the button would. I added a proper `<form>` element. I also added a `<fieldset>` and `<legend>` around the category buttons, since they're a related group of choices.

### Design decision - dropdown vs. example questions

I initially thought of a dropdown because it's the simplest, most standard UI pattern for category selection, lots of sites use it. But when I actually looked at LEASE's own website, I noticed their existing 'Ask a question' tool doesn't use a dropdown, it uses clickable example questions instead (like 'What are service charges?'). I preferred this approach because:

- It's more concrete and actionable - selecting 'Costs and charges' from a dropdown is abstract, but clicking a real example sentence shows the user exactly how to describe their own situation.
- It matched our own 'plain English' goal better - the Problem Restatement was about giving stressed users clear guidance, and example sentences guide better than a dropdown does.
- It also had a technical benefit - when a user clicks an example, a real sentence with actual keywords goes into the text box, which works seamlessly with our existing keyword-matching backend, without needing separate category-matching logic.

### Scope decision - sub-categorising 3 categories

I initially considered keeping all 7 categories at a single generic next-step level. I felt this wasn't specific enough to be genuinely useful - for example, a generic 'Building management' next-step wouldn't help someone who specifically wants to change their property manager versus someone with a repairs issue. I decided to add sub-category-level next-steps for 3 categories (Building management, Lease extension, Costs and charges) to give more specific, actionable guidance, and kept the remaining 4 (Buying and selling, Disputes, Leasehold essentials, Shared ownership) at single-level given time constraints. This pattern could be extended to the remaining categories in a future iteration.

## Personal data & security

No personal data (name, email, or any identifying information) is collected or stored by this prototype. The only input is the free-text enquiry, which is sent to the backend for processing and is not logged or persisted anywhere - I confirmed this by reviewing `server.js`, which only logs its own startup message, never the user's input.

I tested the input for XSS vulnerabilities by submitting `<script>alert('test')</script>` as the enquiry text. React's default JSX escaping meant the script was rendered as plain text rather than executed, and the app handled it as expected (returning the 'no match' fallback) without crashing.

I also tested empty and whitespace-only input - handled gracefully without crashing, falling back to the "couldn't identify" message.

**If this grew into a real product, I would think about:**

- **Rate-limiting** - right now, anyone could send unlimited requests to the `/triage` endpoint very quickly (for example, using an automated script). In a real product, I would add a limit on how many requests a single user or IP address can make in a short time, to stop the server from being overwhelmed or abused.
- **Input length limits** - right now, the text box doesn't stop someone from pasting in an extremely long piece of text (thousands of words). In a real product, I would add a reasonable maximum length on the enquiry text, since very long submissions aren't needed for this use case and could waste server resources if someone submitted them repeatedly.

## Accessibility

I ran a manual accessibility check covering:

- **Keyboard navigation** - I tested the whole flow using only the Tab key (no mouse), and confirmed every interactive element (the textarea, both buttons, and all example-question buttons) is reachable in a logical order, with a visible focus outline on each.
- **Focus management** - When a result appears (or the "couldn't identify" message shows), keyboard focus automatically moves to it, so keyboard and screen-reader users are taken straight to the answer rather than having to search for it.
- **Screen reader support** - The result section uses `aria-live="polite"` so it's automatically announced when it appears. The example-question buttons are grouped in a `<fieldset>` with a `<legend>`, and the form input has a proper `<label>`.
- **Colour contrast** - I checked the text/background colour combinations against WCAG using the WebAIM Contrast Checker. Body text (`#0B2033` on `#F0EFED`) achieves 14.4:1, passing both AA and AAA. Button text (originally `#C30F3C` on white) achieved 6.07:1 — passing AA (4.5:1 minimum), but falling short of the stricter AAA standard (7:1 minimum). I darkened the colour slightly to `#B00C35`, which achieves 7.11:1 — now passing both AA and AAA.
- **Responsive layout** - I tested the layout at mobile width (375px, iPhone SE) using Chrome DevTools and adjusted font sizes and button layout for smaller screens.

While refactoring, I also moved all colours into CSS custom properties (`:root` variables) instead of hardcoded hex values scattered across the stylesheet, so that any future colour change only needs to be made in one place.

**What I would do next with more time**: test with an actual screen reader (like NVDA or VoiceOver) rather than just keyboard-only testing, since automated/manual visual checks don't fully replicate the experience of a screen-reader user; and get the colour palette checked by a colour-blindness simulator, since I only checked contrast ratios, not colour-differentiation.

## Self code review

**Strengths:**

- The triage function is simple to understand - it's just a plain function that takes text and gives back a category, no hidden tricks. It's also fully covered by tests.
- Adding sub-categories for 3 of the categories made the advice actually useful, instead of just generic advice for everything.
- I kept thinking about accessibility throughout, not just at the end - labels, keyboard navigation, focus, contrast, all checked.

**Bugs I found and fixed while building this** (leaving these in honestly, not hiding them):

- At first, typing "INSURANCE" in capitals didn't match anything, only lowercase "insurance" worked. I fixed this by converting both the user's text and the keywords to lowercase before comparing.
- Some keywords were too generic, like "landlord" or "flat" - they matched the wrong category because these words show up in lots of different situations. I fixed this by using more specific phrases instead of single common words.
- I completely forgot to include the `explanation` field in the API response at first - I only caught this by testing it in the browser, not by reading the code. This tells me my testing needs to check the actual response shape too, not just whether a category was matched.
- While doing a final fresh-clone test, I found that a question like "How much would it cost to extend my lease?" triggered the "this may also relate to other issues" warning, even though it only relates to one category (Lease extension) - it had just matched two different sub-scenarios within that same category. I fixed this by checking the number of *unique categories* matched, rather than the total number of matches, so the warning only appears when genuinely different categories are involved.

**Things I'm not fully happy with:**

- If someone's text matches more than one category (like a sentence about both a leak and a service charge), the app only shows one category and just adds a note saying "this might relate to other issues too." A better version would clearly show all the matching categories, not just one plus a vague note. I considered detecting and returning all matching categories, but decided this would add meaningful complexity (tracking multiple matches, handling nested sub-scenarios, and redesigning the UI to show multiple results) for a first slice.
- The example question buttons on the frontend are a separate hardcoded array, not linked to `categories.json`. If the categories ever change, someone would have to remember to update the buttons separately too. I considered moving them into `categories.json`, but decided against it since that would mix backend/matching data with frontend UI copy, going against separation of concerns. In a larger version, a small dedicated endpoint could serve example phrases while keeping this separation.
- Only 3 out of 7 categories have detailed sub-scenarios. The other 4 just have one generic next step - not because they don't deserve more detail, just because of time.
- **Scalability**: The current keyword-matching approach with hardcoded categories works for a small first slice, but would not scale well to a full production system with many more categories and sub-scenarios. A production version would likely need the category/keyword data to live in a CMS or database (so non-technical staff could update it), and more sophisticated matching (such as fuzzy matching or semantic search) rather than exact keyword lists.

**What I wouldn't consider "done" for a real production version:**

- There are no automated tests for the frontend at all — only the backend logic is tested. I would want at least a couple of tests for the form submission and the fallback message before calling this production-ready.
- There's no limit on how many requests someone could send, or how much text they could paste in, fine for a prototype, but not something I would ship as-is.