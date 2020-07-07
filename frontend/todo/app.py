from flask import Flask, render_template
import requests

app = Flask(__name__)



@app.route('/')
def index():
    resp = requests.get('http://localhost:8080/todos/')
    json_resp = resp.json() 
    print(json_resp['data'])
    data = {'todos': json_resp['data']}
    
    return render_template('index.html', data=data)

# app.run(debug=True)


