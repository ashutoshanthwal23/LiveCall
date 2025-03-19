import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Root from "./components/Root";
import Meeting from "./pages/Meeting";
import { ToastContainerWrapper } from "./pages/toast/ToastContainer";
import { WebRTCProvider } from "./pages/hooks/useWebRTC";
import Lobby from "./pages/Lobby";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Root />}>
          <Route path="/" element={<Lobby />} />
        </Route>
        <Route path="/meeting/:id" element={
          <WebRTCProvider>
            <Meeting />
          </WebRTCProvider>
        } />
      </Routes>
      <ToastContainerWrapper />
    </BrowserRouter>
  );
}

export default App;
