import logo from './logo.svg';
import './App.css';
import HeroSection from './Components/TThero';
import SnapScroll from './Components/scroll';
import Landing from './screens/Landing';
import SimpleLanding from './screens/SimpleLanding';

function App() {
  return (
    <div className="App">
      <Landing />
      {/* <SimpleLanding/> */}
    </div>
  );
}

export default App;
