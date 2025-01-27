from django.shortcuts import render, redirect
from .models import Persona
from .forms import PersonaForm

def agregar_persona(request):
    if request.method == 'POST':
        form = PersonaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('agregar_persona')
    else:
        form = PersonaForm()

    personas = Persona.objects.all()
    return render(request, 'agregar_persona.html', {'form': form, 'personas': personas})

def calcular_deudas(request):
    personas = Persona.objects.all()
    total_gastos = sum(persona.gasto for persona in personas)
    promedio = total_gastos / len(personas) if personas else 0

    deudas = []
    for persona in personas:
        diferencia = persona.gasto - promedio
        deudas.append({
            'nombre': persona.nombre,
            'diferencia': diferencia
        })

    # Calcular transacciones
    transacciones = []
    deudores = [deuda for deuda in deudas if deuda['diferencia'] < 0]
    acreedores = [deuda for deuda in deudas if deuda['diferencia'] > 0]

    for deudor in deudores:
        for acreedor in acreedores:
            if deudor['diferencia'] != 0 and acreedor['diferencia'] != 0:
                monto = min(-deudor['diferencia'], acreedor['diferencia'])
                transacciones.append({
                    'de': deudor['nombre'],
                    'a': acreedor['nombre'],
                    'monto': monto
                })
                deudor['diferencia'] += monto
                acreedor['diferencia'] -= monto

    return render(request, 'calcular_deudas.html', {'transacciones': transacciones})

def limpiar_datos(request):
    Persona.objects.all().delete()
    return redirect('agregar_persona')

from django.shortcuts import get_object_or_404

def eliminar_persona(request, persona_id):
    persona = get_object_or_404(Persona, id=persona_id)
    persona.delete()
    return redirect('agregar_persona')