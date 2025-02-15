import { WalletContextProvider } from './components/WalletContextProvider';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { PatientStories } from './components/PatientStories';
import { Footer } from './components/Footer';

function App() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <Dashboard />
          <PatientStories />
        </main>
        <Footer />
      </div>
    </WalletContextProvider>
  );
}

export default App;