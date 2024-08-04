import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoutes from "./Routes";
function App() {
    return (
        <div className="h-screen w-full">
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </div>
    );
}

export default App;
