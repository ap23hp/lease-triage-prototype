# AI Usage Note

**Candidate:** Apra Khanna

I used Claude throughout this exercise to talk through my thinking, catch mistakes, and verify my understanding of parts of the code as I wrote them.

## What helped

- I worked through design decisions and trade-offs out loud (e.g. dropdown vs. clickable examples, whether to sub-categorise all 7 categories or just some), and having to explain my reasoning helped me think it through properly.

- I used Claude to help format my planning and documentation (the plan, quality notes, and this note) into clean Markdown, based on content and decisions that were mine.

## What I rejected or changed

- I was initially given a suggestion to keep all 7 categories at one generic next-step level. I decided this wasn't specific enough to be genuinely useful, and chose to add sub-categories for 3 categories instead, after thinking about what a stressed user would actually need.
- When multiple approaches were suggested for handling the "multiple categories match" edge case, I chose the simplest option (a general disclaimer) over a more complex one (showing all matches), given the time available.

## What I verified myself

- I wrote all the keywords and next-step content myself, based on reading LEASE's actual website content, rather than accepting generated text.
- I tested every category, sub-scenario, and edge case (empty input, script injection, case sensitivity, multi-keyword text) manually in the browser myself.
- I checked colour contrast using the WebAIM tool myself and made the decision to darken the button colour.
- I wrote every line of code myself, task by task, rather than generating the whole application at once - Claude explained concepts and reviewed what I wrote, but I typed and understood each piece before moving to the next ticket.