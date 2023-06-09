// import { useState } from 'react'

import "./App.css";
import ResultsGrid from "./ResultsGrid";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        
        <ResultsGrid />
      </QueryClientProvider>
    </>
  );
}

export default App;
