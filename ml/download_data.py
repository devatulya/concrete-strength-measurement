"""
Download and verify script for the UCI Concrete Compressive Strength Dataset.

Source:
Prof. I-Cheng Yeh
Department of Civil Engineering, Chung-Hua University, Hsin Chu, Taiwan 30067, R.O.C.
UCI Machine Learning Repository:
https://archive.ics.uci.edu/dataset/165/concrete+compressive+strength
"""

import os
import sys
import io
import urllib.request
import zipfile
import pandas as pd

UCI_ZIP_URL = "https://archive.ics.uci.edu/static/public/165/concrete+compressive+strength.zip"
BACKUP_CSV_URL = "https://raw.githubusercontent.com/stedy/Machine-Learning-with-R-datasets/master/concrete.csv"

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
XLS_TARGET = os.path.join(DATA_DIR, "Concrete_Data.xls")
CSV_TARGET = os.path.join(DATA_DIR, "concrete_data.csv")
README_TARGET = os.path.join(DATA_DIR, "Concrete_Readme.txt")

COLUMN_MAPPING = {
    "Cement (component 1)(kg in a m^3 mixture)": "cement",
    "Blast Furnace Slag (component 2)(kg in a m^3 mixture)": "slag",
    "Fly Ash (component 3)(kg in a m^3 mixture)": "fly_ash",
    "Water  (component 4)(kg in a m^3 mixture)": "water",
    "Superplasticizer (component 5)(kg in a m^3 mixture)": "superplasticizer",
    "Coarse Aggregate  (component 6)(kg in a m^3 mixture)": "coarse_aggregate",
    "Fine Aggregate (component 7)(kg in a m^3 mixture)": "fine_aggregate",
    "Age (day)": "age",
    "Concrete compressive strength(MPa, megapascals) ": "compressive_strength"
}


def download_and_prepare():
    os.makedirs(DATA_DIR, exist_ok=True)
    
    print("[1/3] Fetching dataset from UCI Machine Learning Repository...")
    downloaded = False
    
    try:
        req = urllib.request.Request(UCI_ZIP_URL, headers={"User-Agent": "Mozilla/5.0 ConcreteStrengthPredictor/1.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            zip_bytes = resp.read()
            with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
                # Extract XLS
                if "Concrete_Data.xls" in z.namelist():
                    with open(XLS_TARGET, "wb") as f:
                        f.write(z.read("Concrete_Data.xls"))
                    print(f"  -> Saved {XLS_TARGET}")
                # Extract Readme
                if "Concrete_Readme.txt" in z.namelist():
                    with open(README_TARGET, "wb") as f:
                        f.write(z.read("Concrete_Readme.txt"))
                    print(f"  -> Saved {README_TARGET}")
        downloaded = True
    except Exception as e:
        print(f"  [Warning] Primary UCI download failed: {e}")
        
    if not os.path.exists(XLS_TARGET):
        print("  -> Trying backup mirror for CSV directly...")
        try:
            req = urllib.request.Request(BACKUP_CSV_URL, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                df = pd.read_csv(resp)
                df.to_csv(CSV_TARGET, index=False)
                print(f"  -> Saved backup {CSV_TARGET}")
                downloaded = True
        except Exception as e2:
            print(f"  [Error] Backup mirror failed: {e2}")

    if not downloaded and not os.path.exists(XLS_TARGET) and not os.path.exists(CSV_TARGET):
        print("\n" + "=" * 70)
        print("MANUAL DATASET DOWNLOAD INSTRUCTIONS")
        print("=" * 70)
        print("Could not automatically download the dataset. Please follow these steps:")
        print("1. Visit: https://archive.ics.uci.edu/dataset/165/concrete+compressive+strength")
        print("2. Download 'concrete+compressive+strength.zip'")
        print("3. Extract 'Concrete_Data.xls' into the 'data/' folder:")
        print(f"   Target path: {XLS_TARGET}")
        print("4. Re-run this script: python ml/download_data.py")
        print("=" * 70 + "\n")
        sys.exit(1)

    print("[2/3] Reading and validating dataset...")
    if os.path.exists(XLS_TARGET):
        df = pd.read_excel(XLS_TARGET)
    elif os.path.exists(CSV_TARGET):
        df = pd.read_csv(CSV_TARGET)
    else:
        raise FileNotFoundError("No valid dataset file found.")

    print(f"  Original dataset shape: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # Check if columns match expected UCI format
    mapped_cols = {}
    for col in df.columns:
        clean_col = col.strip()
        matched = False
        for original_key, standard_name in COLUMN_MAPPING.items():
            if clean_col.lower().startswith(original_key.split("(")[0].strip().lower()) or original_key.lower() in clean_col.lower():
                mapped_cols[col] = standard_name
                matched = True
                break
        if not matched:
            # Fallback for simple names if mirror was used
            simple_lower = clean_col.lower().replace(" ", "_")
            if simple_lower in COLUMN_MAPPING.values():
                mapped_cols[col] = simple_lower
            elif "strength" in simple_lower:
                mapped_cols[col] = "compressive_strength"

    df = df.rename(columns=mapped_cols)
    print(f"  Mapped columns: {list(df.columns)}")
    
    expected = [
        "cement", "slag", "fly_ash", "water", "superplasticizer",
        "coarse_aggregate", "fine_aggregate", "age", "compressive_strength"
    ]
    missing = [c for c in expected if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in dataset: {missing}")

    print("[3/3] Saving standardized CSV...")
    df.to_csv(CSV_TARGET, index=False)
    print(f"  -> Successfully generated {CSV_TARGET} ({len(df)} records)")
    print("Dataset verification complete.")


if __name__ == "__main__":
    download_and_prepare()
