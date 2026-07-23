import { Header } from "./Header.js";
export function PageShell(content) {
  return `
     <div class="site-layout">
       ${Header()}

       <main>
         ${content}
       </main>

     </div>
   `;
}
