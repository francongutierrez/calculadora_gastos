from django.db import models

class Persona(models.Model):
    nombre = models.CharField(max_length=100)
    gasto = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nombre