import { useState } from "react";
import { apiFetch } from "../api/http";

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiFetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                alert('¡La sesion se ha iniciado de manera exitosa!');
                setForm({ email: '', password: '' });
                setError('');
            } else {
                const data = await response.json();
                setError(data.message || 'Inicio de sesión fallido. Inténtalo otra vez');
            }
        } catch (err) {
            setError('Un error inesperado ha ocurrido. Inténtalo otra vez.');
        }
    };

    return (
        <div className="login-container">
            <h2>Inicio de sesión</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo Electrónico:</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </div>
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    );
}