import type { Metadata } from 'next';
import './globals.css';
import './auth.css';
import './mobile.css';
export const metadata: Metadata = {
  title:'Zenithis Studio — BONAS-INC & LZO Empire',
  description:'Centre de pilotage éditorial multi-marques : calendrier, campagnes, productions et publications.'
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="fr"><body>{children}</body></html>
}
