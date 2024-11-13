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
    vehicles_list = [vehicle.serialize() for vehicle in vehicles]

    return jsonify(vehicles_list), 200

#Ruta para obtener un vehiculo especifico por su ID
@vehicles.route('/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return jsonify({"error": "Vehiculo no encontrado"}), 404
    
    return jsonify(vehicle.serialize()), 200

#Ruta para crear un vehiculo
@vehicles.route('/vehicles', methods=['POST'])
def create_vehicle():
    if 'user_id' not in session:
        return jsonify({"error": "Acceso no autorizado"}), 403
    
    #Obtener los datos enviados en la solicitud
    data = request.get_json()
    brand = data.get('brand')
    model = data.get('model')
    year = data.get('year')
    color = data.get('color')
    daily_price = data.get('daily_price')
    availability = data.get('availability', True)
    image_url = data.get('image_url')

    #Verificar si se proporcionan los campos requeridos
    if not brand or not model or not year or not color or not daily_price:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400
    
    #Crear el nuevo vehiculo
    new_vehicle = Vehicle(
        brand=brand,
        model=model,
        year=year,
        color=color,
        daily_price=daily_price,
        availability=availability,
        image_url=image_url
    )

    #Agregar el vehiculo en la base de datos
    db.session.add(new_vehicle)
    db.session.commit()

    return jsonify({"message": "Vehiculo agregado con exito"}), 201

#Ruta para actualizar el vehiculo
@vehicles.route('/vehicles/<int:vehicle_id>', methods=['PUT'])
def uptade_vehicule(vehicle_id):
    if 'user_id' not in session:
        return jsonify({"error":"Acceso no autorizado"}), 403
    
    #Obtener el vehiculo por su ID
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return jsonify({"error": "Vehiculo no encontrado"}), 404
    
    #Obtener los nuevos datos enviados en la solicitud
    data = request.get_json()
    vehicle.brand = data.get('brand', vehicle.brand)
    vehicle.model = data.get('model', vehicle.model)
    vehicle.year = data.get('year', vehicle.year)
    vehicle.color = data.get('color', vehicle.color)
    vehicle.daily_price = data.get('daily_price', vehicle.daily_price)
    vehicle.availability = data.get('availability', vehicle.availability)
    vehicle.image_url = data.get('image_url', vehicle.image_url)

    #Guardar los datos en la base de datos
    db.session.commit()

    return jsonify({"message": "Vehiculo actualizado con exito"}), 200

#Ruta para eliminar un vehiculo
@vehicles.route('/vehicles/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    if 'user_id' not in session:
        return jsonify({"error":"Acceso no autorizado"}), 403
    
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return jsonify({"error":"Vehiculo no encontrado"}), 404
    
    #Eliminar el vehiculo d ela base de datos
    db.session.delete(vehicle)
    db.session.commit()

    return jsonify({"messsage":"Vehiculo eliminado con exito"}), 200