import os
from huggingface_hub import hf_hub_download

REPO_ID    = os.getenv("HF_DATASET_REPO", "aqibniazi/crime-analytics-models")
MODEL_DIR  = os.getenv("MODEL_DIR", "models")

FILES = [
    "xgb_crime_model.pkl",
    "label_encoder.pkl",
    "le_remap.pkl",
    "nlp_model.pkl",
    "tfidf_vectorizer.pkl",
    "nlp_label_encoder.pkl",
    "prophet_model.pkl",
    "kmeans_model.pkl",
]

def download_models():
    os.makedirs(MODEL_DIR, exist_ok=True)
    for f in FILES:
        dest = os.path.join(MODEL_DIR, f)
        if os.path.exists(dest):
            print(f"  skip (exists): {f}")
            continue
        print(f"  downloading: {f}")
        hf_hub_download(
            repo_id=REPO_ID,
            filename=f,
            repo_type="dataset",
            local_dir=MODEL_DIR,
        )
        print(f"  done: {f}")

if __name__ == "__main__":
    download_models()
