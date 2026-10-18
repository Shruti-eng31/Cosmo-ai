export interface AskCosmoResponse {
  query: string;
  response: string;
  sources: string[];
  dataPoints?: { x: number; y: number }[];
}

export class AIService {
  /**
   * Send a natural language query to the COSMO AI Assistant
   */
  static async askQuestion(query: string): Promise<AskCosmoResponse> {
    // TODO: Connect to FastAPI -> LLM + RAG backend
    console.log(`[AIService] Sending query: ${query}`);
    
    // Simulating network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return {
      query,
      response: "Based on the DESI DR1 dataset, the relationship between redshift (z) and distance follows Hubble's Law. For the sample of 2.1M galaxies analyzed, we observe a linear correlation at low redshift, which curves at higher redshifts due to the accelerating expansion of the universe (Dark Energy).",
      sources: ["DESI Early Data Release (2023)", "Planck 2018 Results"],
      dataPoints: [
        { x: 0.1, y: 400 },
        { x: 0.5, y: 2200 },
        { x: 1.0, y: 4800 },
        { x: 1.5, y: 8000 }
      ]
    };
  }
}
