# ==========================================================
# 🧠 FEATURE ENGINEERING MODULE
# ==========================================================
# This file is used by BOTH:
#   - train_model.py
#   - realtime.py
#
# Purpose:
# Convert 63 raw landmarks into engineered feature vector.
#
# Why centralized?
# To prevent feature mismatch between training and inference.
#
# IMPORTANT:
# This version correctly supports:
#   - Single sample input (shape: 63,)
#   - Batch input (shape: N,63)
# ==========================================================

import numpy as np


def compute_features(raw_landmarks):
    """
    Input:
        raw_landmarks → shape (63,)  OR  (N, 63)

    Output:
        Engineered feature matrix

    This ensures:
    - Translation invariance
    - Scale invariance
    - Better finger distinction
    """

    # ======================================================
    # 🔹 Ensure input is 2D
    # ======================================================
    # If single sample → reshape to (1, 63)
    # If batch → keep as (N, 63)
    # ======================================================

    if len(raw_landmarks.shape) == 1:
        X = raw_landmarks.reshape(1, -1)
    else:
        X = raw_landmarks.copy()

    # ======================================================
    # 1️⃣ Wrist-Relative Normalization
    # ======================================================
    # Makes model invariant to hand position in frame.
    # We subtract wrist coordinates (landmark 0)
    # from all other landmarks.
    # ======================================================

    for i in range(21):
        X[:, i*3:(i+1)*3] -= X[:, 0:3]

    # ======================================================
    # 2️⃣ Hand Size Normalization
    # ======================================================
    # Makes model invariant to distance from camera.
    # We divide all landmarks by hand size.
    #
    # Hand size approximated using:
    # distance between wrist (0) and middle fingertip (12)
    # ======================================================

    wrist = X[:, 0:3]
    middle_tip = X[:, 12*3:12*3+3]

    hand_size = np.linalg.norm(middle_tip - wrist, axis=1).reshape(-1, 1)

    # Prevent divide-by-zero
    hand_size[hand_size == 0] = 1

    X = X / hand_size

    # ======================================================
    # 3️⃣ Thumb–Index Distance
    # ======================================================
    # Important for distinguishing:
    # A, T, N
    # ======================================================

    thumb = X[:, 4*3:4*3+3]
    index = X[:, 8*3:8*3+3]

    thumb_index = np.linalg.norm(thumb - index, axis=1).reshape(-1, 1)

    # ======================================================
    # 4️⃣ Finger Curl Features
    # ======================================================
    # Distance between fingertip and MCP joint.
    # Helps distinguish:
    # A vs B
    # S vs 5
    # ======================================================

    def curl(data, tip, mcp):
        return np.linalg.norm(
            data[:, tip*3:tip*3+3] -
            data[:, mcp*3:mcp*3+3],
            axis=1
        ).reshape(-1, 1)

    index_curl = curl(X, 8, 5)
    middle_curl = curl(X, 12, 9)
    ring_curl = curl(X, 16, 13)
    pinky_curl = curl(X, 20, 17)

    # ======================================================
    # 5️⃣ Finger Straightness
    # ======================================================
    # Distance between fingertip and PIP joint.
    # Strong indicator of straight fingers (B sign).
    # ======================================================

    def straight(data, tip, pip):
        return np.linalg.norm(
            data[:, tip*3:tip*3+3] -
            data[:, pip*3:pip*3+3],
            axis=1
        ).reshape(-1, 1)

    index_str = straight(X, 8, 6)
    middle_str = straight(X, 12, 10)
    ring_str = straight(X, 16, 14)
    pinky_str = straight(X, 20, 18)

    # ======================================================
    # Combine all engineered features
    # ======================================================
    # Final feature count:
    # 63 raw +
    # 1 thumb-index +
    # 4 curl +
    # 4 straight
    #
    # TOTAL = 72 features
    # ======================================================

    X = np.hstack((
        X,
        thumb_index,
        index_curl, middle_curl, ring_curl, pinky_curl,
        index_str, middle_str, ring_str, pinky_str
    ))

    return X
