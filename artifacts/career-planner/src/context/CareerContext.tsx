import { createContext, useContext, useState, type ReactNode } from "react";
import type { CareerAnalysis } from "../types";

interface CareerContextValue {
  analysisResult: CareerAnalysis | null;
  setAnalysisResult: (result: CareerAnalysis | null) => void;
}

const CareerContext = createContext<CareerContextValue | null>(null);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [analysisResult, setAnalysisResult] = useState<CareerAnalysis | null>(null);

  return (
    <CareerContext.Provider value={{ analysisResult, setAnalysisResult }}>
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const ctx = useContext(CareerContext);
  if (!ctx) throw new Error("useCareer must be used within a CareerProvider");
  return ctx;
}
