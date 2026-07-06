import json
import re
import sys

with open('/Users/yoshimi/.gemini/antigravity-ide/brain/83a8ebd5-999b-4678-8e68-daad4f9e5e4d/.system_generated/steps/9/content.md', 'r') as f:
    content = f.read()

match = re.search(r'goog\.script\.init\("(.*?)"', content)
if match:
    encoded = match.group(1)
    decoded_str = encoded.replace('\\x22', '"').replace('\\x7b', '{').replace('\\x7d', '}').replace('\\x5b', '[').replace('\\x5d', ']')
    try:
        data = json.loads(decoded_str)
        user_html = data.get('userHtml')
        if user_html:
            with open('decoded_template.html', 'w') as out:
                out.write(user_html.replace('\\n', '\n').replace('\\/', '/').replace('\\"', '"'))
            print("Successfully extracted HTML")
        else:
            print("userHtml not found in JSON")
    except Exception as e:
        print("JSON parse error:", e)
else:
    print("Could not find goog.script.init")
