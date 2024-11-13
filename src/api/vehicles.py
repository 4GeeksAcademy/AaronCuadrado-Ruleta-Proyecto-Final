from flask import Blueprint, jsonify, request, session
from api.models import db, Vehicle
from werkzeug.exceptions import NotFound

vehicles = Blueprint('vehicles', methods=['GET'])
def get_vehicles():
    #obtener los vehiculos disponibles
    vehicles = Vehicle.query.filter_by(availability=True).all()
    if not vehicles:
        return jsonify({"message": "No hay vehiculos disponibles en este momento"}), 404
    
    #Serializar los vehiculos para la respuesta
    vehicles_list = []