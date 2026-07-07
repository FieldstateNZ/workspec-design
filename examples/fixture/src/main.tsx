import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
// design/* components (S4) don't consume this stylesheet themselves (see
// components-page.tsx's header comment) — it's `@workspec/design`'s own
// published, token-consuming CSS for non-React consumers of the design
// handoff, verified here by the plain `.chip` element in ComponentsPage.
import '@workspec/design/design-shell.css';

const container = document.getElementById('root');
if (!container) throw new Error('#root not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
