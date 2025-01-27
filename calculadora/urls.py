from django.urls import path
from . import views

urlpatterns = [
    path('agregar/', views.agregar_persona, name='agregar_persona'),
    path('calcular/', views.calcular_deudas, name='calcular_deudas'),
    path('limpiar/', views.limpiar_datos, name='limpiar_datos'),
    path('eliminar/<int:persona_id>/', views.eliminar_persona, name='eliminar_persona'),
    path('agregar-ajax/', views.agregar_persona_ajax, name='agregar_persona_ajax'),
]