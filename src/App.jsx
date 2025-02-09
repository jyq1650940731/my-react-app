import React from "react";
import { HashRouter } from 'react-router-dom';
import RouterView from "./router";
 import { KeepAliveProvider } from 'keepalive-react-component';

const App = function App() {
    return <HashRouter>
        {/* <RouterView /> */}
        <KeepAliveProvider>
            <RouterView />
        </KeepAliveProvider>
    </HashRouter>;
};
export default App;