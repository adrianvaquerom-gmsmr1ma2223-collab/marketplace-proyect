import { useState } from 'react';
import { apiFetch } from '../api/http';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
    useEffect(() => {    document.title = 'Register';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('La contraseña y la confirmación no son iguales.');
            return;
        }
        try { const response = await apiFetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                alert('Registración completa! Por favor inicia sesión.');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setError('');
            } else {
                const data = await response.json();
                setError(data.message || 'Registración fallida. Inténtalo otra vez');
            }
        } catch (err) {
            setError('Un error inesperado ha ocurrido. Inténtalo otra vez.');
        }
    };

    return (
        <div className="register-container">
            <h2>Pagina de registro</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre de usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirmar contraseña:</label>
                    <input
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
}