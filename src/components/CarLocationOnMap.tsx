import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button, Typography, Box } from '@mui/material';
import { useCarsStore } from '../store/carsStore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './CarLocationOnMap.module.scss';

// Исправление иконки маркера для Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CarLocationOnMap = () => {
    const { carId } = useParams<{ carId: string }>();
    const navigate = useNavigate();
    const { cars } = useCarsStore();

    const car = cars.find(c => c.id === Number(carId));

    useEffect(() => {
        if (!car) {
            navigate('/');
        }
    }, [car, navigate]);

    useEffect(() => {
        const rootElement = document.getElementById('root');
        const htmlElement = document.documentElement;

        if (rootElement) {
            rootElement.style.margin = '0';
            rootElement.style.padding = '0';
            rootElement.style.height = '100vh';
            rootElement.style.width = '100vw';
            rootElement.style.overflow = 'hidden';
        }

        htmlElement.style.overflow = 'hidden';
        htmlElement.style.height = '100vh';
        htmlElement.style.width = '100vw';

        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        document.body.style.width = '100vw';

        return () => {
            // Восстанавливаем стили при размонтировании
            if (rootElement) {
                rootElement.style.margin = '';
                rootElement.style.padding = '';
                rootElement.style.height = '';
                rootElement.style.width = '';
                rootElement.style.overflow = '';
            }
            htmlElement.style.overflow = '';
            htmlElement.style.height = '';
            htmlElement.style.width = '';
            document.body.style.margin = '';
            document.body.style.padding = '';
            document.body.style.overflow = '';
            document.body.style.height = '';
            document.body.style.width = '';
        };
    }, []);

    if (!car) {
        return (
            <Box className={styles.errorContainer}>
                <Typography variant="h6" color="error">
                    Машина не найдена
                </Typography>
                <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                    Назад к списку машин
                </Button>
            </Box>
        );
    }

    const position: [number, number] = [car.latitude, car.longitude];

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 2,
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}
        >
            <MapContainer
                center={position}
                zoom={13}
                style={{
                    height: 'calc(100vh - 32px)',
                    width: 'calc(100vw - 32px)',
                    margin: 0,
                    padding: 0,
                    zIndex: 1,
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <strong>{car.name} {car.model}</strong>
                        <br />
                        Год: {car.year}
                        <br />
                        Цвет: {car.color}
                        <br />
                        Цена: {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'USD',
                        }).format(car.price)}
                    </Popup>
                </Marker>
            </MapContainer>

            {/* Заголовок и кнопка поверх карты */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    zIndex: 10000,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: 2,
                    borderRadius: 1,
                    boxShadow: 3,
                    pointerEvents: 'auto',
                }}
            >
                <Typography variant="h6" component="h1" gutterBottom>
                    {car.name} {car.model}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    size="small"
                >
                    Назад к списку машин
                </Button>
            </Box>
        </Box>
    );
};

export default CarLocationOnMap;

