from django.http import JsonResponse
from googletrans import Translator
from django.views.decorators.csrf import csrf_exempt
import json

# Initialize Translator
translator = Translator()

@csrf_exempt
def translate_text(request):
    if request.method == 'POST':
        try:
            # Parse the JSON request
            data = json.loads(request.body)
            sentences = data.get('sentences', [])  # Expecting a list of sentences
            target_lang = data.get('target_lang', 'en')  # Default to Hindi
            sentences = [str(sentence) for sentence in sentences]
            # Translate sentences
            translated_sentences = [
                translator.translate(sentence, dest=target_lang).text
                for sentence in sentences
            ]

            # Return the translated sentences
            return JsonResponse({'translated_sentences': translated_sentences}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
