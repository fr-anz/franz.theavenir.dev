import { Header } from "./Header.js";
import { Footer } from "./Footer.js";
export function PageShell(content) {
  return `
     <div class="site-layout">
       ${Header()}

       <main>
         ${content}
       </main>
       ${Footer()}
     </div>
   `;
}
