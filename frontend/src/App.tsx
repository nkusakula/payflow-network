import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Welcome from './components/Welcome';
import Transactions from './components/entity/transaction/Transactions';
import Merchants from './components/entity/merchant/Merchants';
import Issuers from './components/entity/issuer/Issuers';
import Cardholders from './components/entity/cardholder/Cardholders';
import Cards from './components/entity/card/Cards';
import Disputes from './components/entity/dispute/Disputes';
import Settlements from './components/entity/settlement/Settlements';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/merchants" element={<Merchants />} />
              <Route path="/issuers" element={<Issuers />} />
              <Route path="/cardholders" element={<Cardholders />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/disputes" element={<Disputes />} />
              <Route path="/settlements" element={<Settlements />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
