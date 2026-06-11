Exercise 1: Personal Task Manager
Best if: This is your first full-stack project, or you want to focus on getting the fundamentals rock-
solid.
The Brief
Build a simple task manager (a glorified to-do list) where a user can create, view, update, and delete
personal tasks. There is no authentication - assume one user.
Functional Requirements
Must Have
• Add a new task with a title (required) and optional description and due date.
• View all tasks in a list, sorted by creation date (newest first).

• Mark a task as complete or incomplete (toggle).
• Edit a task's title, description, or due date.
• Delete a task, with a confirmation prompt before deletion.
• Filter the list by status: All, Active, Completed.
Should Have
• Show a count of active vs completed tasks somewhere on the screen.
• Visually distinguish overdue tasks (due date is in the past and the task is not complete).
• Empty state UI when there are no tasks.
Nice to Have (Bonus)
• Search tasks by title.
• Persist tasks across server restarts (write to a JSON file or SQLite).
• Drag-and-drop to reorder tasks.


Please follow these steps carefully, as incomplete submissions are difficult for us to review.
1. GitHub Repository
1. 2. 3. Create a PUBLIC GitHub repository.
Push your code with a clean commit history. We will look at your commits, so please commit
incrementally rather than as one giant 'final' commit.
Include a single repo for the whole project. A monorepo with /client and /server folders is
the simplest structure and what we recommend.
2. Hosted Deployment (Recommended)
You can deploy a live version of the app.
• Frontend: Netlify, Vercel, or GitHub Pages are all free and easy.
• Backend: Render, Railway, Fly.io, or Cyclic offer free Node.js hosting. (Heroku no longer has
a free tier.)
• Make sure the deployed frontend can actually talk to the deployed backend, and test it from
an incognito window before submitting.
3. README.md - Required
Your README must include the following sections:
• Project Title & Brief Description - which exercise you chose, in one paragraph.
• Live Demo Links - Deployed link.
• Tech Stack - libraries and tools used and why.
• How to Run Locally - exact commands a reviewer can copy and paste. Assume they have
only Node.js installed.
• API Documentation - list of endpoints with method, path, request body, and response
shape.
• Project Structure - a brief tree of the folders and what lives in each.
• Next Steps - what you chose not to do, and what you would build next.

What We Are Looking For
We are evaluating you, so we are not expecting senior-engineer output. We care about:
• Clean, readable code with sensible naming and structure
• A clear separation between frontend (React) and backend (Node.js)
• Basic understanding of REST APIs, state management, and component design
• A README that explains how to run your project locally
• Honesty in the README about what works, what does not, and what you would improve
with more time
Tech Stack Requirements
• Backend: Node.js with Express (or Fastify, if you prefer). JavaScript or TypeScript, your
choice.
• Frontend: React (Create React App, Vite, or Next.js are all acceptable). Functional
components with hooks, please, no class components.
• Storage: An in-memory array, a JSON file, or SQLite is fine. You do not need to set up
MongoDB or PostgreSQL unless you want to.
• Styling: Plain CSS, CSS Modules, Tailwind, or any component library (Material UI, Chakra,
shadcn/ui, etc.) of your choice.
• Testing: Optional but appreciated. One or two meaningful tests are better than ten trivial
ones.
