import { create } from 'zustand';
import { type Car, type CarsState } from '../types/types';
import carsApi from '../api/carsApi';

export const useCarsStore = create<CarsState>((set) => ({
    cars: [],
    loading: false,
    error: null,

    fetchCars: async () => {
        set({ loading: true, error: null });
        try {
            const response = await carsApi.getCars();
            set({ cars: response.data, loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch cars',
                loading: false,
            });
        }
    },

    setCars: (cars: Car[]) => {
        set({ cars });
    },

    addCar: (car: Car) => {
        set((state) => ({ cars: [car, ...state.cars] }));
    },

    updateCar: (id: number, carData: Partial<Car>) => {
        set((state) => ({
            cars: state.cars.map((car) =>
                car.id === id ? { ...car, ...carData } : car
            ),
        }));
    },

    deleteCar: (id: number) => {
        set((state) => ({
            cars: state.cars.filter((car) => car.id !== id),
        }));
    },

    clearError: () => {
        set({ error: null });
    },
}));

