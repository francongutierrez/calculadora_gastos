function agregarPersona() {
    const nombre = document.getElementById('nombre').value;
    const gasto = document.getElementById('gasto').value;

    fetch('{% url "agregar_persona_ajax" %}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token }}'
        },
        body: JSON.stringify({
            nombre: nombre,
            gasto: gasto
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            // Agregar la nueva persona a la lista
            const lista = document.getElementById('lista-personas');
            const nuevoItem = document.createElement('li');
            nuevoItem.id = `persona-${data.id}`;
            nuevoItem.innerHTML = `
                ${data.nombre} - $${data.gasto}
                <button onclick="eliminarPersona('${data.id}')">Eliminar</button>
            `;
            lista.appendChild(nuevoItem);

            // Limpiar el formulario
            document.getElementById('nombre').value = '';
            document.getElementById('gasto').value = '';
        }
    });
}

function eliminarPersona(personaId) {
    fetch(`/eliminar/${personaId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Eliminar la persona de la lista
            const item = document.getElementById(`persona-${personaId}`);
            item.remove();
        } else {
            alert('Error al eliminar la persona');
        }
    });
}

function limpiarDatos() {
    fetch('{% url "limpiar_datos" %}', {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Limpiar la lista de personas
            const lista = document.getElementById('lista-personas');
            lista.innerHTML = '';
        } else {
            alert('Error al limpiar los datos');
        }
    });
}

function calcularDeudas() {
    fetch('{% url "calcular_deudas" %}', {
        method: 'GET',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.transacciones) {
            // Mostrar las transacciones
            const resultado = document.getElementById('resultado-deudas');
            resultado.innerHTML = '<h2>Transacciones</h2><ul>';
            data.transacciones.forEach(transaccion => {
                resultado.innerHTML += `
                    <li>
                        ${transaccion.de} debe pagar $${transaccion.monto.toFixed(2)} a ${transaccion.a}
                    </li>
                `;
            });
            resultado.innerHTML += '</ul>';
        } else {
            alert('Error al calcular las deudas');
        }
    });
}