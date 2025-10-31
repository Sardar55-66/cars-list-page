import { Routes, Route } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import CarsTable from './components/CarsTable';
import { CreateCarComponent } from './components/CreateCarComponent';
import CarLocationOnMap from './components/CarLocationOnMap';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                marginLeft: '25px',
                marginRight: '25px',
                textAlign: 'center',
              }}
            >
              Список машин
            </Typography>
            <CreateCarComponent />
            <CarsTable />
          </Container>
        }
      />
      <Route path="/car/:carId" element={<CarLocationOnMap />} />
    </Routes>
  );
}

export default App;
