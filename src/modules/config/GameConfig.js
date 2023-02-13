
var MW = MW || {};

//life
MW.LIFE = 4;

//sound
MW.SOUND = true;

MW.FONTCOLOR = "#1f2d96";

MW.SCORE = 1;
MW.DROP_ITEM_RATE = 0.4;
MW.DELTA_UPDATE_MAP = 0.9;

MW.MODE_INDEX = 0;
MW.MODE = [
    {
        "MODE": "Easy",
        "SCORE": 1,
        "DROP_ITEM_RATE": 0.4,
        "DELTA_UPDATE_MAP": 0.93,
    },
    {
        "MODE": "Normal",
        "SCORE": 3,
        "DROP_ITEM_RATE": 0.45,
        "DELTA_UPDATE_MAP": 0.9,
    },
    {
        "MODE": "Hard",
        "SCORE": 5,
        "DROP_ITEM_RATE": 0.57,
        "DELTA_UPDATE_MAP": 0.85,
    }
]