let token = localStorage.getItem('token');

if (token) {
    mostrarApp();
}

async function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        token = data.token;
        mostrarApp();
    } else {
        alert("Error: " + (data.error || "Credenciales inválidas"));
    }
}

function toggleAuth(showRegister) {
    document.getElementById('login-section').style.display = showRegister ? 'none' : 'block';
    document.getElementById('register-section').style.display = showRegister ? 'block' : 'none';
}

async function handleRegister() {
    const user = document.getElementById('reg-username').value;
    const pass = document.getElementById('reg-password').value;
    if (!user || !pass) return alert("Llenar todos los campos");

    const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });

    if (res.status === 201) {
        alert("¡Registro exitoso!");
        toggleAuth(false);
    } else {
        const data = await res.json();
        alert("Error: " + data.error);
    }
}

function mostrarApp() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
    cargarTareas();
}

let editandoId = null;

async function cargarTareas() {
    const res = await fetch('/tareas', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tareas = await res.json();
    const lista = document.getElementById('lista-tareas');
    
    lista.innerHTML = tareas.map(t => `
        <li>
            <span><strong>${t.titulo}</strong>: ${t.descripcion}</span>
            <div>
                <button onclick="prepararEdicion('${t.id}', '${t.titulo}', '${t.descripcion}')" style="width:auto; background:orange; padding: 5px 10px;">Edit</button>
                <button onclick="eliminarTarea('${t.id}')" style="width:auto; background:red; padding: 5px 10px;">X</button>
            </div>
        </li>
    `).join('');
}

async function crearTarea() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('desc').value;
    if (!titulo || !descripcion) return alert("Llenar campos de tarea");

    await fetch('/tareas', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ titulo, descripcion })
    });
    document.getElementById('titulo').value = '';
    document.getElementById('desc').value = '';
    cargarTareas();
}

// 1. Carga los datos de la tarea en los inputs
function prepararEdicion(id, titulo, descripcion) {
    document.getElementById('titulo').value = titulo;
    document.getElementById('desc').value = descripcion;
    editandoId = id; // Guardamos el ID que estamos editando
    
    // Cambiamos el texto del botón para que el usuario sepa que está editando
    const btn = document.querySelector("#app-container button[onclick='crearTarea()']");
    if(btn) {
        btn.innerText = "Guardar Cambios";
        btn.setAttribute("onclick", "guardarEdicion()");
    }
}

async function guardarEdicion() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('desc').value;

    await fetch(`/tareas/${editandoId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ titulo, descripcion })
    });

    // Limpiamos y regresamos el botón a su estado original
    document.getElementById('titulo').value = '';
    document.getElementById('desc').value = '';
    editandoId = null;
    
    const btn = document.querySelector("#app-container button[onclick='guardarEdicion()']");
    btn.innerText = "+ Agregar Tarea";
    btn.setAttribute("onclick", "crearTarea()");
    
    cargarTareas();
}

// ESTA FUNCIÓN TAMBIÉN FALTABA
async function eliminarTarea(id) {
    if (!confirm("¿Eliminar tarea?")) return;
    await fetch(`/tareas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    cargarTareas();
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}