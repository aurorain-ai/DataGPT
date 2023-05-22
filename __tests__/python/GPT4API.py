# Note: it does not work. I got 404 error when running it.

import os
from dotenv import load_dotenv
import requests
from requests.structures import CaseInsensitiveDict

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
gpt4_endpoint = "https://api.openai.com/v1/engines/davinci-codex/completions"

def send_image_and_text_to_gpt4(image_path, prompt):
    with open(image_path, "rb") as image_file:
        headers = CaseInsensitiveDict()
        headers["Authorization"] = f"Bearer {api_key}"
        files = {"image": image_file, "prompt": (None, prompt)}
        response = requests.post(gpt4_endpoint, headers=headers, files=files)

    if not response.ok:
        raise Exception(f"GPT-4 API returned an error: {response.status_code}")

    return response.json()

if __name__ == "__main__":
    image_path = "/Users/luhui/GitHub/cv/bags/Image__2023-04-16__10-02-31.png"
    prompt = "Please count the plastic bags in the picture"

    try:
        result = send_image_and_text_to_gpt4(image_path, prompt)
        print(result)
    except Exception as error:
        print(f"GPT-4 API Error: {error}")
