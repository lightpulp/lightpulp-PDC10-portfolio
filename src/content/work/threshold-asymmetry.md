---
title: "A threshold is an ethical decision wearing a number"
order: 6
subtitle: "Reliability and cost asymmetry in an assistive device"
summary: "Obstacle-detection glasses for blind users that vibrate when a model is confident enough. Choosing what counts as confident enough is not a tuning exercise."
finding: "Precision and recall are not symmetric when one of the two failures lands on a person's body."
role: "Integration and alert logic"
status: "Prototype, built on prior open research"
stack: ["ESP32-CAM", "Flask", "MobileNetV2", "Vibration motors"]
techniques: ["Confidence thresholding", "Failure-cost analysis", "Accessible output design", "Attribution"]
outcomes: ["clo1", "clo3", "clo4"]
sources:
  - title: "Using ESP32 camera in project (EyeWay)"
    url: "https://claude.ai/chat/609040a9-eca8-4ffc-ba82-ba5e3c7f6ab9"
---

EyeWay is a pair of glasses with an ESP32-CAM on the frame and four coin vibration motors along the strap. Frames go to a detection server running MobileNetV2, which classifies one of ten obstacle types — chair, door, fence, garbage bin, obstacle, plant, pothole, stairs, table, vehicle. If the result clears a confidence threshold, the alert logic picks a direction from which third of the frame the obstacle sits in, and the matching motors buzz.

The threshold is 0.8.

That number is the most consequential line in the project, and it is not a model-performance question. It is a question about which mistake you would rather make.

A **missed** obstacle leaves the user exactly where they were before the device existed — relying on a cane and their own senses, which is their baseline and which works. A **false** alert does something worse than nothing. It buzzes for an obstacle that is not there, and if that happens often enough the user learns to ignore the device. At that point the glasses are not neutral; they have consumed attention and returned noise, and the one time the alert is real it gets ignored too.

So the two failure modes have different costs, and a threshold tuned to maximise overall accuracy would be the wrong threshold. Raising it trades recall for precision deliberately, because precision is what earns the trust the device needs to be useful at all.

## Output design for a user who cannot see the screen

This is also the clearest example in my semester of a conversational interface with no text in it. The output vocabulary is four motors and a pulse pattern: a short pulse on one side for left or right, both motors continuously for centre, all four rapidly for something close. That is the entire language.

Which forces a discipline that text-based interfaces let you avoid. There is no room for hedging, no qualifier, no "possible obstacle ahead". The system either asserts or stays silent. Every piece of uncertainty has to be resolved before output, because the channel cannot carry it.

I think about that whenever I am tempted to let a chatbot soften a bad answer with "I think" or "it may be". The hedge does not make the answer safer; it transfers the decision to a user who has less information than the system does.

## Attribution

This builds on an existing open project — a CNN and fine-tuned MobileNetV2 with Node-RED audio alerts for obstacle detection — and uses its research and dataset. Our contribution is the hardware path and the haptic feedback layer, not the model. Saying so plainly is part of the work.
