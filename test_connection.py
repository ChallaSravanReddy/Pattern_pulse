import os
from dotenv import load_dotenv
from groq import Groq
import hindsight_client
from hindsight_client.rest import ApiException

load_dotenv()

HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY")
HINDSIGHT_BANK_ID = os.getenv("HINDSIGHT_BANK_ID")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

print("Checking configurations...")

# 1. Test Groq
try:
    groq_client = Groq(api_key=GROQ_API_KEY)
    model = "qwen/qwen3-32b"
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": "Ping"}],
            model=model,
        )
    except Exception as e:
        # Fallback if qwen/qwen3-32b is not available in Groq model catalog
        if "model_not_found" in str(e) or "404" in str(e):
            model = "qwen/qwen3.8-27b"
            chat_completion = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": "Ping"}],
                model=model,
            )
        else:
            raise
    print("Groq Connection: SUCCESS (Response received)")
except Exception as e:
    print(f"Groq Connection: FAILED -> {e}")

# 2. Test Hindsight Client initialization
try:
    configuration = hindsight_client.Configuration(
        api_key={"ApiKeyAuth": HINDSIGHT_API_KEY}
    )
    # Check client instance setup
    with hindsight_client.ApiClient(configuration) as api_client:
        print("Hindsight Client Initialization: SUCCESS")
except Exception as e:
    print(f"Hindsight Client: FAILED -> {e}")

print("\nStep 1 check complete!")
