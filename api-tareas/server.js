const express = require('express');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = "mi_clave_secreta_super_segura";

app.use(express.json());
app.use(express.static('public'));

// --- UTILIDADES PARA ARCHIVOS (fs.promises) ---
const leerArchivo = async (archivo) => {
    try {
        const data = await fs.readFile(archivo, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; 
    }
};

const escribirArchivo = async (archivo, datos) => {
    await fs.writeFile(archivo, JSON.stringify(datos, null, 2));
};

// --- MIDDLEWARE DE AUTENTICACIÓN ---
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });

    try {
        const verificado = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.user = verificado;
        next();
    } catch (error) {
        res.status(400).json({ error: "Token no válido." });
    }
};

// --- RUTAS DE AUTENTICACIÓN ---

// Registro
app.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const usuarios = await leerArchivo('usuarios.json');
        
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);
        
        const nuevoUsuario = { id: Date.now(), username, password: passwordHashed };
        usuarios.push(nuevoUsuario);
        
        await escribirArchivo('usuarios.json', usuarios);
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) { next(error); }
});

// Login
app.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const usuarios = await leerArchivo('usuarios.json');
        const usuario = usuarios.find(u => u.username === username);

        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: usuario.id, name: usuario.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) { next(error); }
});

// --- RUTAS CRUD DE TAREAS (PROTEGIDAS) ---

app.get('/tareas', authMiddleware, async (req, res, next) => {
    try {
        const tareas = await leerArchivo('tareas.json');
        res.json(tareas);
    } catch (error) { next(error); }
});

app.post('/tareas', authMiddleware, async (req, res, next) => {
    try {
        const { titulo, descripcion } = req.body;
        const tareas = await leerArchivo('tareas.json');
        const nuevaTarea = { id: Date.now(), titulo, descripcion, completada: false };
        tareas.push(nuevaTarea);
        await escribirArchivo('tareas.json', tareas);
        res.status(201).json(nuevaTarea);
    } catch (error) { next(error); }
});

app.put('/tareas/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion } = req.body;
        let tareas = await leerArchivo('tareas.json');
        const index = tareas.findIndex(t => t.id == id);
        
        if (index === -1) return res.status(404).json({ error: "Tarea no encontrada" });

        tareas[index] = { ...tareas[index], titulo, descripcion };
        await escribirArchivo('tareas.json', tareas);
        res.json(tareas[index]);
    } catch (error) { next(error); }
});

app.delete('/tareas/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        let tareas = await leerArchivo('tareas.json');
        const nuevasTareas = tareas.filter(t => t.id != id);
        
        if (tareas.length === nuevasTareas.length) return res.status(404).json({ error: "ID no encontrado" });

        await escribirArchivo('tareas.json', nuevasTareas);
        res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) { next(error); }
});

// --- MIDDLEWARE PERSONALIZADO DE MANEJO DE ERRORES ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Algo salió mal en el servidor",
        message: err.message
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});