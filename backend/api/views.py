from django.shortcuts import render
import os
import pickle
import numpy as np
import pandas as pd
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "heartd.pkl")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
except Exception as e:
    model = None
    load_error = str(e)
else:
    load_error = None

def health(request):
    if load_error:
        return JsonResponse({"status": "error", "error": load_error}, status=500)
    return JsonResponse({"status": "ok"})

@method_decorator(csrf_exempt, name="dispatch")
class PredictAPIView(APIView):
    # Add JSONParser to handle axios JSON requests
    parser_classes = [JSONParser, FormParser]

    def post(self, request, *args, **kwargs):
        global model
        if model is None:
            return Response(
                {"error": "Model failed to load", "detail": load_error}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        data = request.data
        features = data.get('features')
        
        if features is None:
            return Response(
                {'error': 'No features provided. Expected "features" array in request body.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Convert features to numpy array
            arr = np.array(features, dtype=float).reshape(1, -1)
            
            # Make prediction
            pred = int(model.predict(arr)[0])
            
            # Get probability if available
            probability = None
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(arr)[0]
                probability = float(proba[pred])
            
            # Return response matching React expectations
            response_data = {
                'prediction': pred,  # lowercase 'prediction'
                'label': 'Positive' if pred == 1 else 'Negative'
            }
            
            if probability is not None:
                response_data['probability'] = probability
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except ValueError as e:
            return Response(
                {'error': f'Invalid feature data: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Prediction failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@method_decorator(csrf_exempt, name='dispatch')
class UploadCSVAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('datasetfile')
        if not file_obj:
            return Response(
                {'error': 'No file uploaded'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            df = pd.read_csv(file_obj)
            preview = df.head(20).to_dict(orient='records')
            return Response(
                {
                    'preview': preview,
                    'columns': list(df.columns),
                    'row_count': len(df)
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': f'CSV processing failed: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
