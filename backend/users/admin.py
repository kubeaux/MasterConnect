from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from django.contrib.auth.models import Group



# On personnalise l'affichage pour voir le type d'utilisateur dans la liste
admin.site.unregister(Group)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'user_type', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('user_type', 'num_etudiant')}),
    )

admin.site.register(User, CustomUserAdmin)