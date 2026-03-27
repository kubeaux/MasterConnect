from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# On personnalise l'affichage pour voir le type d'utilisateur dans la liste
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'user_type', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('user_type', 'num_etudiant')}),
    )

admin.site.register(User, CustomUserAdmin)