import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Box,
    TextField,
    TableSortLabel,
} from '@mui/material';
import { useCarsStore } from '../store/carsStore';
import { type Car, type Order, type OrderBy } from '../types/types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CheckIcon from '@mui/icons-material/Check';
import styles from './CarsTable.module.scss';

const CarsTable = () => {
    const { cars, loading, error, fetchCars, deleteCar, updateCar } = useCarsStore();
    const navigate = useNavigate();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');
    const [editingPrice, setEditingPrice] = useState<string>('');
    const [orderBy, setOrderBy] = useState<OrderBy>(null);
    const [order, setOrder] = useState<Order>('asc');
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    useEffect(() => {
        // Очищаем режим редактирования, если машина с editingId больше не существует
        if (editingId !== null && !cars.some(car => car.id === editingId)) {
            setEditingId(null);
            setEditingName('');
            setEditingPrice('');
        }
    }, [cars, editingId]);

    useEffect(() => {
        if (editingId !== null && nameInputRef.current) {
            // Используем setTimeout для избежания конфликтов с расширениями
            setTimeout(() => {
                nameInputRef.current?.focus();
            }, 0);
        }
    }, [editingId]);

    const handleLocationClick = useCallback((car: Car) => {
        navigate(`/car/${car.id}`);
    }, [navigate]);

    const handleDeleteClickCar = useCallback((id: number) => {
        deleteCar(id);
        // Если удаляем редактируемую машину, очищаем режим редактирования
        if (editingId === id) {
            setEditingId(null);
            setEditingName('');
            setEditingPrice('');
        }
    }, [deleteCar, editingId]);

    const formatPrice = useCallback((price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    }, []);

    const handleSaveEdit = useCallback((id: number) => {
        const price = parseFloat(editingPrice);
        if (isNaN(price) || price < 0) {
            return; // Не сохраняем если цена некорректная
        }

        updateCar(id, {
            name: editingName.trim(),
            price: price,
        });

        setEditingId(null);
        setEditingName('');
        setEditingPrice('');
    }, [editingName, editingPrice, updateCar]);

    const handleEditClickCar = useCallback((car: Car) => {
        if (editingId === car.id) {
            // Если уже редактируем эту строку - сохраняем изменения
            handleSaveEdit(car.id);
        } else {
            // Начинаем редактирование
            setEditingId(car.id);
            setEditingName(car.name);
            setEditingPrice(car.price.toString());
        }
    }, [editingId, handleSaveEdit]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent, carId: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleSaveEdit(carId);
        }
    }, [handleSaveEdit]);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // Блокируем всплытие для предотвращения конфликтов с расширениями
        e.stopPropagation();
        setEditingName(e.target.value);
    }, []);

    const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // Блокируем всплытие для предотвращения конфликтов с расширениями
        e.stopPropagation();
        setEditingPrice(e.target.value);
    }, []);

    const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        // Блокируем обработку focus расширениями
        e.stopPropagation();
    }, []);

    const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        // Блокируем обработку blur расширениями
        e.stopPropagation();
    }, []);

    const handleInputClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        // Блокируем обработку click расширениями
        e.stopPropagation();
    }, []);

    const handleInputMouseDown = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        // Блокируем обработку mousedown расширениями
        e.stopPropagation();
    }, []);

    const handleSort = useCallback((property: 'year' | 'price') => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }, [orderBy, order]);

    // Сортировка машин
    const sortedCars = useMemo(() => {
        if (!orderBy) {
            return cars;
        }

        return [...cars].sort((a, b) => {
            let aValue: number;
            let bValue: number;

            if (orderBy === 'year') {
                aValue = a.year;
                bValue = b.year;
            } else {
                aValue = a.price;
                bValue = b.price;
            }

            if (order === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    }, [cars, orderBy, order]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                    width: '100%',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" className={styles.errorAlert}>
                {error}
            </Alert>
        );
    }

    return (
        <TableContainer component={Paper} className={styles.tableContainer}>
            <Table className={styles.table} aria-label="таблица машин">
                <TableHead>
                    <TableRow>
                        <TableCell>Марка</TableCell>
                        <TableCell>Модель</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'year'}
                                direction={orderBy === 'year' ? order : 'asc'}
                                onClick={() => handleSort('year')}
                            >
                                Год выпуска
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Цвет</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'price'}
                                direction={orderBy === 'price' ? order : 'asc'}
                                onClick={() => handleSort('price')}
                            >
                                Цена
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Расположение</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedCars.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                Нет данных
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedCars.map((car) => (
                            <TableRow key={car.id} hover>
                                <TableCell>
                                    {editingId === car.id ? (
                                        <TextField
                                            inputRef={nameInputRef}
                                            value={editingName}
                                            onChange={handleNameChange}
                                            onKeyDown={(e) => handleKeyDown(e, car.id)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            onClick={handleInputClick}
                                            onMouseDown={handleInputMouseDown}
                                            size="small"
                                            autoComplete="off"
                                            variant="outlined"
                                            inputProps={{
                                                autoComplete: 'off',
                                                'data-lpignore': 'true',
                                                'data-form-type': 'other',
                                                'data-1p-ignore': 'true',
                                                'data-lastpass-icon-root': 'true',
                                                'data-bwignore': 'true',
                                                'data-bitwarden-watching': 'false',
                                                spellCheck: 'false',
                                                tabIndex: 0,
                                            }}
                                            className={styles.tableCellInput}
                                        />
                                    ) : (
                                        car.name
                                    )}
                                </TableCell>
                                <TableCell>{car.model}</TableCell>
                                <TableCell>{car.year}</TableCell>
                                <TableCell>{car.color}</TableCell>
                                <TableCell>
                                    {editingId === car.id ? (
                                        <TextField
                                            value={editingPrice}
                                            onChange={handlePriceChange}
                                            onKeyDown={(e) => handleKeyDown(e, car.id)}
                                            onFocus={handleInputFocus}
                                            onBlur={handleInputBlur}
                                            onClick={handleInputClick}
                                            onMouseDown={handleInputMouseDown}
                                            size="small"
                                            type="number"
                                            autoComplete="off"
                                            variant="outlined"
                                            inputProps={{
                                                autoComplete: 'off',
                                                'data-lpignore': 'true',
                                                'data-form-type': 'other',
                                                'data-1p-ignore': 'true',
                                                'data-lastpass-icon-root': 'true',
                                                'data-bwignore': 'true',
                                                'data-bitwarden-watching': 'false',
                                                spellCheck: 'false',
                                                tabIndex: 0,
                                            }}
                                            sx={{
                                                width: '100%',
                                                '& input[type=number]': {
                                                    MozAppearance: 'textfield',
                                                    appearance: 'textfield',
                                                },
                                                '& input[type=number]::-webkit-outer-spin-button': {
                                                    WebkitAppearance: 'none',
                                                    appearance: 'none',
                                                    margin: 0,
                                                },
                                                '& input[type=number]::-webkit-inner-spin-button': {
                                                    WebkitAppearance: 'none',
                                                    appearance: 'none',
                                                    margin: 0,
                                                },
                                            }}
                                        />
                                    ) : (
                                        formatPrice(car.price)
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleLocationClick(car)}
                                    >
                                        Показать на карте
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => handleDeleteClickCar(car.id)}
                                    >
                                        <DeleteForeverIcon />
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => handleEditClickCar(car)}
                                    >
                                        {editingId === car.id ? <CheckIcon /> : <ModeEditIcon />}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CarsTable;

