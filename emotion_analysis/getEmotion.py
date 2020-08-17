# to call script use $ python "filename.py" --option_name "option_value"

if __name__ == "__main__":
    from decouple import config
    import paralleldots
    import json
    import argparse

    API_KEY = config('EMOTION_API_KEY')
    paralleldots.set_api_key(API_KEY)

    #args is string that is to be analysed
    ap = argparse.ArgumentParser()
    ap.add_argument("-t", "--text", required=True,
        help="string to analyze for emotions")
    args = vars(ap.parse_args())

    text = args["text"]
    # emotion = paralleldots.emotion(text)['emotion'];

    # # possible emotions are Happy, Angry, Bored, Fear, Sad, Excited
    # # right now, just taking the one highest emotion...
    # max_val = max(emotion.values())
    # max_em = [k for k, v in emotion.items() if v==max_val]

    #print(max_em[0])
    print('Happy')

