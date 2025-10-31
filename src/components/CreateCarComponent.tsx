import { useState, useCallback, useEffect, useRef } from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Box,
} from '@mui/material';
import { useCarsStore } from '../store/carsStore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckIcon from '@mui/icons-material/Check';
import styles from './CreateCarComponent.module.scss';

export const CreateCarComponent = () => {
    const { addCar, cars } = useCarsStore();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        year: '',
        color: '',
        price: '',
    });
    const [errors, setErrors] = useState({
        name: false,
        model: false,
        year: false,
        color: false,
        price: false,
    });
    const nameInputRef = useRef<HTMLInputElement>(null);

    const validateForm = useCallback(() => {
        const newErrors = {
            name: !formData.name.trim(),
            model: !formData.model.trim(),
            year: !formData.year.trim(),
            color: !formData.color.trim(),
            price: !formData.price.trim(),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    }, [formData]);

    const handleCancel = useCallback(() => {
        setShowForm(false);
        setFormData({
            name: '',
            model: '',
            year: '',
            color: '',
            price: '',
        });
        setErrors({
            name: false,
            model: false,
            year: false,
            color: false,
            price: false,
        });
    }, []);

    const handleSave = useCallback(() => {
        if (!validateForm()) {
            return;
        }

        const maxId = cars.length > 0 ? Math.max(...cars.map(car => car.id)) : 0;
        const newCar = {
            id: maxId + 1,
            name: formData.name.trim(),
            model: formData.model.trim(),
            year: Number(formData.year),
            color: formData.color.trim(),
            price: Number(formData.price),
            latitude: 0,
            longitude: 0,
        };

        addCar(newCar);
        handleCancel();
    }, [formData, validateForm, addCar, cars, handleCancel]);

    const handleCreateCar = useCallback(() => {
        setShowForm(true);
        setFormData({
            name: '',
            model: '',
            year: '',
            color: '',
            price: '',
        });
        setErrors({
            name: false,
            model: false,
            year: false,
            color: false,
            price: false,
        });
    }, []);

    useEffect(() => {
        if (showForm && nameInputRef.current) {
            setTimeout(() => {
                nameInputRef.current?.focus();
            }, 0);
        }
    }, [showForm]);

    useEffect(() => {
        if (!showForm) return;

        // Блокируем обработку событий focus от расширений браузера
        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (target?.tagName === 'INPUT' && (target.closest('form') || target.closest('table'))) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        };

        const handleInput = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target?.tagName === 'INPUT' && (target.closest('form') || target.closest('table'))) {
                e.stopImmediatePropagation();
            }
        };

        // Используем capture phase для перехвата событий до расширений
        document.addEventListener('focusin', handleFocusIn, true);
        document.addEventListener('input', handleInput, true);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
            if (e.key === 'Enter') {
                const isFormFocused = document.activeElement?.tagName === 'INPUT';
                if (isFormFocused) {
                    handleSave();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('focusin', handleFocusIn, true);
            document.removeEventListener('input', handleInput, true);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showForm, handleCancel, handleSave]);

    const handleFieldChange = useCallback((field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
    }, []);

    const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        let value = e.target.value;

        // Ограничение для поля года - максимум 4 символа
        if (field === 'year') {
            // Удаляем все нецифровые символы и ограничиваем до 4 символов
            value = value.replace(/\D/g, '').slice(0, 4);
        }

        handleFieldChange(field, value);
    }, [handleFieldChange]);

    const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.stopPropagation();
    }, []);

    const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.stopPropagation();
    }, []);

    const handleInputClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
    }, []);

    const handleInputMouseDown = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleSave();
        }
    }, [handleSave]);

    const handleYearKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        // Блокируем ввод, если уже введено 4 символа (кроме служебных клавиш)
        const target = e.target as HTMLInputElement;
        if (target.value.length >= 4 &&
            !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key) &&
            !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }

        // Также обрабатываем Enter для сохранения
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleSave();
        }
    }, [handleSave]);

    return (
        <Box
            sx={{
                marginBottom: 3,
                marginLeft: '25px',
                marginRight: '25px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Button variant="contained" color="primary" onClick={handleCreateCar}>
                Создать запись автомобиля
            </Button>

            {showForm && (
                <TableContainer
                    component={Paper}
                    sx={{
                        marginTop: 2,
                        width: '100%',
                        maxWidth: '100%',
                    }}
                >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Марка</TableCell>
                                <TableCell>Модель</TableCell>
                                <TableCell>Год выпуска</TableCell>
                                <TableCell>Цвет</TableCell>
                                <TableCell>Цена</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TextField
                                        inputRef={nameInputRef}
                                        value={formData.name}
                                        onChange={handleInputChange('name')}
                                        onKeyDown={handleKeyDown}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        onClick={handleInputClick}
                                        onMouseDown={handleInputMouseDown}
                                        size="small"
                                        error={errors.name}
                                        autoComplete="off"
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
                                        className={styles.textInput}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={formData.model}
                                        onChange={handleInputChange('model')}
                                        onKeyDown={handleKeyDown}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        onClick={handleInputClick}
                                        onMouseDown={handleInputMouseDown}
                                        size="small"
                                        error={errors.model}
                                        autoComplete="off"
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
                                        className={styles.textInput}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={formData.year}
                                        onChange={handleInputChange('year')}
                                        onKeyDown={handleYearKeyDown}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        onClick={handleInputClick}
                                        onMouseDown={handleInputMouseDown}
                                        size="small"
                                        type="number"
                                        error={errors.year}
                                        autoComplete="off"
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
                                            maxLength: 4,
                                        }}
                                        className={styles.numberInput}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={formData.color}
                                        onChange={handleInputChange('color')}
                                        onKeyDown={handleKeyDown}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        onClick={handleInputClick}
                                        onMouseDown={handleInputMouseDown}
                                        size="small"
                                        error={errors.color}
                                        autoComplete="off"
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
                                        className={styles.textInput}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        value={formData.price}
                                        onChange={handleInputChange('price')}
                                        onKeyDown={handleKeyDown}
                                        onFocus={handleInputFocus}
                                        onBlur={handleInputBlur}
                                        onClick={handleInputClick}
                                        onMouseDown={handleInputMouseDown}
                                        size="small"
                                        type="number"
                                        error={errors.price}
                                        autoComplete="off"
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
                                        className={styles.numberInput}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            onClick={handleSave}
                                        >
                                            <CheckIcon />
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={handleCancel}
                                        >
                                            <DeleteForeverIcon />
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};