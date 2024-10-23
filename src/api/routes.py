from flask import Flask, jsonify, url_for, Blueprint
from api.models import User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)





    
