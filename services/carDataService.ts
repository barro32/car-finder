// Car data service using NHTSA API and supplemented with common car data

export interface CarMake {
  id: number;
  name: string;
}

export interface CarModel {
  id: number;
  name: string;
  makeId: number;
}

// Popular car makes for quick access
const POPULAR_MAKES: CarMake[] = [
  { id: 1, name: 'Toyota' },
  { id: 2, name: 'Honda' },
  { id: 3, name: 'Ford' },
  { id: 4, name: 'Chevrolet' },
  { id: 5, name: 'BMW' },
  { id: 6, name: 'Mercedes-Benz' },
  { id: 7, name: 'Audi' },
  { id: 8, name: 'Volkswagen' },
  { id: 9, name: 'Nissan' },
  { id: 10, name: 'Hyundai' },
  { id: 11, name: 'Kia' },
  { id: 12, name: 'Mazda' },
  { id: 13, name: 'Subaru' },
  { id: 14, name: 'Lexus' },
  { id: 15, name: 'Acura' },
  { id: 16, name: 'Infiniti' },
  { id: 17, name: 'Volvo' },
  { id: 18, name: 'Jeep' },
  { id: 19, name: 'Ram' },
  { id: 20, name: 'Dodge' },
  { id: 21, name: 'Cadillac' },
  { id: 22, name: 'Lincoln' },
  { id: 23, name: 'Buick' },
  { id: 24, name: 'GMC' },
  { id: 25, name: 'Tesla' },
  { id: 26, name: 'Porsche' },
  { id: 27, name: 'Land Rover' },
  { id: 28, name: 'Jaguar' },
  { id: 29, name: 'Mini' },
  { id: 30, name: 'Mitsubishi' }
];

// Popular models by make
const POPULAR_MODELS: { [makeId: number]: CarModel[] } = {
  1: [ // Toyota
    { id: 101, name: 'Camry', makeId: 1 },
    { id: 102, name: 'Corolla', makeId: 1 },
    { id: 103, name: 'RAV4', makeId: 1 },
    { id: 104, name: 'Prius', makeId: 1 },
    { id: 105, name: 'Highlander', makeId: 1 },
    { id: 106, name: 'Tacoma', makeId: 1 },
    { id: 107, name: 'Sienna', makeId: 1 },
    { id: 108, name: 'Tundra', makeId: 1 },
    { id: 109, name: 'Avalon', makeId: 1 },
    { id: 110, name: '4Runner', makeId: 1 }
  ],
  2: [ // Honda
    { id: 201, name: 'Civic', makeId: 2 },
    { id: 202, name: 'Accord', makeId: 2 },
    { id: 203, name: 'CR-V', makeId: 2 },
    { id: 204, name: 'Pilot', makeId: 2 },
    { id: 205, name: 'Fit', makeId: 2 },
    { id: 206, name: 'HR-V', makeId: 2 },
    { id: 207, name: 'Odyssey', makeId: 2 },
    { id: 208, name: 'Passport', makeId: 2 },
    { id: 209, name: 'Insight', makeId: 2 },
    { id: 210, name: 'Ridgeline', makeId: 2 }
  ],
  3: [ // Ford
    { id: 301, name: 'F-150', makeId: 3 },
    { id: 302, name: 'Escape', makeId: 3 },
    { id: 303, name: 'Explorer', makeId: 3 },
    { id: 304, name: 'Focus', makeId: 3 },
    { id: 305, name: 'Mustang', makeId: 3 },
    { id: 306, name: 'Edge', makeId: 3 },
    { id: 307, name: 'Fusion', makeId: 3 },
    { id: 308, name: 'Expedition', makeId: 3 },
    { id: 309, name: 'Ranger', makeId: 3 },
    { id: 310, name: 'Bronco', makeId: 3 }
  ],
  4: [ // Chevrolet
    { id: 401, name: 'Silverado', makeId: 4 },
    { id: 402, name: 'Equinox', makeId: 4 },
    { id: 403, name: 'Malibu', makeId: 4 },
    { id: 404, name: 'Tahoe', makeId: 4 },
    { id: 405, name: 'Camaro', makeId: 4 },
    { id: 406, name: 'Cruze', makeId: 4 },
    { id: 407, name: 'Traverse', makeId: 4 },
    { id: 408, name: 'Suburban', makeId: 4 },
    { id: 409, name: 'Impala', makeId: 4 },
    { id: 410, name: 'Colorado', makeId: 4 }
  ],
  5: [ // BMW
    { id: 501, name: '3 Series', makeId: 5 },
    { id: 502, name: '5 Series', makeId: 5 },
    { id: 503, name: 'X3', makeId: 5 },
    { id: 504, name: 'X5', makeId: 5 },
    { id: 505, name: '7 Series', makeId: 5 },
    { id: 506, name: 'X1', makeId: 5 },
    { id: 507, name: 'X7', makeId: 5 },
    { id: 508, name: '4 Series', makeId: 5 }
  ],
  6: [ // Mercedes-Benz
    { id: 601, name: 'C-Class', makeId: 6 },
    { id: 602, name: 'E-Class', makeId: 6 },
    { id: 603, name: 'GLC', makeId: 6 },
    { id: 604, name: 'GLE', makeId: 6 },
    { id: 605, name: 'S-Class', makeId: 6 },
    { id: 606, name: 'A-Class', makeId: 6 },
    { id: 607, name: 'GLS', makeId: 6 },
    { id: 608, name: 'CLA', makeId: 6 }
  ],
  9: [ // Nissan
    { id: 901, name: 'Altima', makeId: 9 },
    { id: 902, name: 'Sentra', makeId: 9 },
    { id: 903, name: 'Rogue', makeId: 9 },
    { id: 904, name: 'Pathfinder', makeId: 9 },
    { id: 905, name: 'Titan', makeId: 9 },
    { id: 906, name: 'Murano', makeId: 9 },
    { id: 907, name: 'Frontier', makeId: 9 },
    { id: 908, name: 'Maxima', makeId: 9 }
  ],
  10: [ // Hyundai
    { id: 1001, name: 'Elantra', makeId: 10 },
    { id: 1002, name: 'Sonata', makeId: 10 },
    { id: 1003, name: 'Tucson', makeId: 10 },
    { id: 1004, name: 'Santa Fe', makeId: 10 },
    { id: 1005, name: 'Accent', makeId: 10 },
    { id: 1006, name: 'Palisade', makeId: 10 },
    { id: 1007, name: 'Kona', makeId: 10 },
    { id: 1008, name: 'Veloster', makeId: 10 }
  ],
  11: [ // Kia
    { id: 1101, name: 'Forte', makeId: 11 },
    { id: 1102, name: 'Optima', makeId: 11 },
    { id: 1103, name: 'Sorento', makeId: 11 },
    { id: 1104, name: 'Sportage', makeId: 11 },
    { id: 1105, name: 'Soul', makeId: 11 },
    { id: 1106, name: 'Telluride', makeId: 11 },
    { id: 1107, name: 'Stinger', makeId: 11 },
    { id: 1108, name: 'Rio', makeId: 11 }
  ],
  25: [ // Tesla
    { id: 2501, name: 'Model 3', makeId: 25 },
    { id: 2502, name: 'Model Y', makeId: 25 },
    { id: 2503, name: 'Model S', makeId: 25 },
    { id: 2504, name: 'Model X', makeId: 25 },
    { id: 2505, name: 'Cybertruck', makeId: 25 }
  ],
  18: [ // Jeep
    { id: 1801, name: 'Wrangler', makeId: 18 },
    { id: 1802, name: 'Grand Cherokee', makeId: 18 },
    { id: 1803, name: 'Cherokee', makeId: 18 },
    { id: 1804, name: 'Compass', makeId: 18 },
    { id: 1805, name: 'Renegade', makeId: 18 },
    { id: 1806, name: 'Gladiator', makeId: 18 }
  ]
};

// Common car colors
export const CAR_COLORS = [
  'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Brown', 'Gold',
  'Green', 'Orange', 'Yellow', 'Purple', 'Maroon', 'Tan', 'Beige'
];

export class CarDataService {
  static async searchMakes(query: string): Promise<CarMake[]> {
    if (!query.trim()) return POPULAR_MAKES.slice(0, 10);

    const filtered = POPULAR_MAKES.filter(make =>
      make.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.slice(0, 10);
  }

  static async searchModels(makeId: number, query: string = ''): Promise<CarModel[]> {
    const models = POPULAR_MODELS[makeId] || [];

    if (!query.trim()) return models.slice(0, 10);

    const filtered = models.filter(model =>
      model.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.slice(0, 10);
  }

  static async searchColors(query: string): Promise<string[]> {
    if (!query.trim()) return CAR_COLORS.slice(0, 8);

    const filtered = CAR_COLORS.filter(color =>
      color.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.slice(0, 8);
  }

  static getMakeByName(name: string): CarMake | undefined {
    return POPULAR_MAKES.find(make =>
      make.name.toLowerCase() === name.toLowerCase()
    );
  }
}
