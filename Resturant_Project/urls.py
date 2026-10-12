from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.static import serve
from django.urls import re_path

from Base_App.views import LoginView, LogoutView, SignupView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Base_App.urls')),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView, name='logout'),
    path('signup/', SignupView, name='signup'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
    ]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
