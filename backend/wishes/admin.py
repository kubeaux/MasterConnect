from django.contrib import admin
from .models import Wish

@admin.register(Wish)
class WishAdmin(admin.ModelAdmin):
    list_display = ('student', 'project', 'rank')
    list_filter = ('student', 'project')
    search_fields = ('student__username', 'project__title')