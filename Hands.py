#Created by MediaPipe
#Modified by Augmented Startups 2021
#Pose-Estimation in 5 Minutes
#Watch 5 Minute Tutorial at www.augmentedstartups.info/YouTube
import math

import cv2
import mediapipe as mp
import json
import time

#Search hands in Images:
mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands

def searchHands():
    with mp_hands.Hands(
        static_image_mode=True,
        max_num_hands=4,
        min_detection_confidence=0.5) as hands:

        # Read an image, flip it around y-axis for correct handedness output (see
        # above).
        image = cv2.imread('Input/handKi.jpg')  #Insert your Image Here
        # Convert the BGR image to RGB before processing.
        results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

        if not results.multi_hand_landmarks:
            hands = {'amount': 0}
            with open('Output/hands.json', 'w') as f:
                json.dump(hands, f)
                print("The json file is created")
            print("Continue")

        # Print handedness and draw hand landmarks on the image.

        image_height, image_width, _ = image.shape
        annotated_image = image.copy()

        amount = 0
        xPos = []
        yPos = []
        # pos = [[],[]]

        if results.multi_hand_landmarks != None:
            for hand_landmarks in results.multi_hand_landmarks:

                xPos.append(hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].x * image_width)
                yPos.append(hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].y * image_width)
                amount = amount + 1

                mp_drawing.draw_landmarks(              annotated_image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            list = {
                "amount": amount,
                "xPos": xPos,
                "yPos": yPos
            }
            print(list)

            with open('Output/hands.json', 'w') as f:
                json.dump(list, f)
                print("The json file is created")

            # cv2.imwrite(r'Output/hands.png', annotated_image)

starttime = time.time()
while True:
    searchHands()
    time.sleep(1 - ((time.time() - starttime) % 1))