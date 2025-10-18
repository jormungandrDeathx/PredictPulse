from django.urls import path
from . import views

urlpatterns =[
    path('predict/',views.PredictAPIView.as_view(), name='predict'),
    path('upload-csv/',views.UploadCSVAPIView.as_view(), name='upload-csv'),
    path('health/',views.health, name='health')
]