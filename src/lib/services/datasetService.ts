export interface DatasetInfo {
  id: string;
  name: string;
  type: string;
  objects: string;
  parameters: string;
  totalRecords: number;
}

export class DatasetService {
  /**
   * Fetch available cosmological datasets
   */
  static async getDatasets(): Promise<DatasetInfo[]> {
    // TODO: Connect to FastAPI -> PostgreSQL metadata DB
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: "desi_dr1",
        name: "DESI",
        type: "Spectroscopic",
        objects: "Galaxies, Quasars",
        parameters: "Redshift, Spectra",
        totalRecords: 2100000,
      },
      {
        id: "gaia_dr3",
        name: "GAIA",
        type: "Astrometric",
        objects: "Stars, Milky Way",
        parameters: "Parallax, Proper Motion",
        totalRecords: 1800000000,
      }
    ];
  }
}
