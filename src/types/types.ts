export interface Car {
    id: number;
    name: string;
    model: string;
    year: number;
    color: string;
    price: number;
    latitude: number;
    longitude: number;
}

export interface CarsState {
    cars: Car[];
    loading: boolean;
    error: string | null;
    fetchCars: () => Promise<void>;
    setCars: (cars: Car[]) => void;
    addCar: (car: Car) => void;
    updateCar: (id: number, carData: Partial<Car>) => void;
    deleteCar: (id: number) => void;
    clearError: () => void;
}

export type Order = 'asc' | 'desc';
export type OrderBy = 'year' | 'price' | null;

