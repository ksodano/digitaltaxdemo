from boxdetect.pipelines import get_checkboxes
from boxdetect import config

import cv2
import os, sys, json

file_name = sys.argv[1]
if not os.path.isfile(file_name):
    print("file does not exist", file_name)
    exit()

img = cv2.imread(file_name, 0)
height, width = img.shape[:2]

scale = width / 2490

cfg = config.PipelinesConfig()

cfg.width_range = (30 * scale, 50 * scale)
cfg.height_range = (30 * scale, 50 * scale)

cfg.scaling_factors = [0.7]

cfg.wh_ratio_range = (0.5, 1.7)
cfg.group_size_range = (2, 100)

cfg.dilation_iterations = 0

checkboxes = get_checkboxes(
    file_name, cfg=cfg, px_threshold=0.1, plot=False, verbose=False)

result = []

for checkbox in checkboxes:
    result.append((checkbox[0], checkbox[1]))

f = open(file_name + "-checkboxes.json", "w")
f.write(json.dumps(result))
f.close()
